/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  LogIn,
  Menu,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  EXAMS,
  ExamData,
  StudentClass,
  SubjectComparison,
  compareExams,
} from './data/exams';
import {
  ExamPickerScreen,
  SavedComparisonRecord,
} from './components/ExamPickerScreen';
import { ExamSearchModal } from './components/ExamSearchModal';
import { ComparisonResultsScreen } from './components/ComparisonResultsScreen';
import { SubjectDetailScreen } from './components/SubjectDetailScreen';
import { StudyStrategyResult } from './components/StudyStrategyBanner';
import { AuthModal } from './components/AuthModal';
import { AdminScreen } from './components/AdminScreen';
import { FeedbackModal } from './components/FeedbackModal';
import { SavedComparisonsDrawer } from './components/SavedComparisonsDrawer';
import { MenuDrawer, ThemeMode } from './components/MenuDrawer';
import { PreppitLogo } from './components/PreppitLogo';
import { AuthUser, useAuth } from './context/AuthContext';

type ScreenView = 'picker' | 'results' | 'chapterDetail' | 'admin';

export default function App() {
  const {
    user,
    authError,
    signOut,
    getToken,
    clearAuthError,
    updateLocalStudentClass,
  } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<ScreenView>('picker');
  const [studentClass, setStudentClass] = useState<StudentClass>('12');
  const [selectedExams, setSelectedExams] = useState<Array<ExamData | null>>([
    null,
    null,
  ]);
  const [activeSearchSlot, setActiveSearchSlot] = useState<number | null>(null);
  const [activeSubjectName, setActiveSubjectName] = useState<string | null>(
    null
  );
  const [strategyCache, setStrategyCache] = useState<
    Record<string, StudyStrategyResult>
  >({});

  const [savedComparisons, setSavedComparisons] = useState<
    SavedComparisonRecord[]
  >([]);
  const [loadingSaved, setLoadingSaved] = useState<boolean>(false);
  const [savingComparison, setSavingComparison] = useState<boolean>(false);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(
    () => new Set()
  );
  const [bannerError, setBannerError] = useState<string | null>(null);

  // Email Auth Modal & Gated Comparison Queue
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'login'>(
    'signup'
  );
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(
    null
  );
  const [pendingCompareExams, setPendingCompareExams] = useState<
    ExamData[] | null
  >(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState<boolean>(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem('preppit-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('preppit-theme', theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const openAuthModal = useCallback(
    (mode: 'signup' | 'login' = 'signup', reason?: string) => {
      setAuthModalMode(mode);
      setAuthPromptMessage(reason ?? null);
      setAuthModalOpen(true);
    },
    []
  );

  const handleSaveStrategy = useCallback(
    (key: string, data: StudyStrategyResult) => {
      setStrategyCache((prev) => ({ ...prev, [key]: data }));
    },
    []
  );

  // Sync profile, saved comparisons, and chapter progress when logged in
  const loadUserData = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoadingSaved(true);
    setBannerError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [meRes, compRes, progRes] = await Promise.all([
        fetch('/api/me', { headers }),
        fetch('/api/comparisons', { headers }),
        fetch('/api/progress', { headers }),
      ]);

      if (meRes.ok) {
        const meData = (await meRes.json()) as { studentClass?: string };
        if (
          meData.studentClass === '10' ||
          meData.studentClass === '11' ||
          meData.studentClass === '12'
        ) {
          setStudentClass(meData.studentClass);
        }
      }

      if (compRes.ok) {
        const compData = (await compRes.json()) as {
          items?: SavedComparisonRecord[];
        };
        setSavedComparisons(compData.items ?? []);
      }

      if (progRes.ok) {
        const progData = (await progRes.json()) as {
          items?: Array<{ topicId: string; status: string }>;
        };
        const nextSet = new Set<string>();
        (progData.items ?? []).forEach((row) => {
          if (row.status === 'completed') {
            nextSet.add(row.topicId);
          }
        });
        setCompletedTopicIds(nextSet);
      }
    } catch {
      setBannerError(
        'Could not load your saved data right now. You can still compare exams normally.'
      );
    } finally {
      setLoadingSaved(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setSavedComparisons([]);
      setCompletedTopicIds(new Set());
      setCurrentScreen((prev) => (prev === 'picker' ? prev : 'picker'));
    }
  }, [user, loadUserData]);

  const filledExams = useMemo(
    () => selectedExams.filter((e): e is ExamData => e !== null),
    [selectedExams]
  );

  const comparisonSummary = useMemo(() => {
    if (filledExams.length < 2) return null;
    return compareExams(filledExams);
  }, [filledExams]);

  const activeSubject: SubjectComparison | null = useMemo(() => {
    if (!comparisonSummary || !activeSubjectName) return null;
    return (
      comparisonSummary.subjectComparisons.find(
        (s) => s.subject === activeSubjectName
      ) ?? null
    );
  }, [comparisonSummary, activeSubjectName]);

  const selectedExamIds = useMemo(
    () => filledExams.map((e) => e.id),
    [filledExams]
  );

  const isComparisonInList = useCallback(
    (
      examsList: ExamData[],
      cls: StudentClass,
      records: SavedComparisonRecord[]
    ) => {
      const signature = [...examsList]
        .map((e) => e.id)
        .sort()
        .join('+');

      return records.some((item) => {
        try {
          const ids = JSON.parse(item.examIdsJson) as string[];
          return (
            item.studentClass === cls &&
            [...ids].sort().join('+') === signature
          );
        } catch {
          return false;
        }
      });
    },
    []
  );

  const isComparisonSaved = useMemo(() => {
    if (!comparisonSummary) return false;
    return isComparisonInList(
      comparisonSummary.exams,
      studentClass,
      savedComparisons
    );
  }, [comparisonSummary, savedComparisons, studentClass, isComparisonInList]);

  const persistComparisonRecord = useCallback(
    async (
      examsToSave: ExamData[],
      cls: StudentClass,
      strategy: StudyStrategyResult | null = null,
      existingRecords?: SavedComparisonRecord[]
    ) => {
      const token = getToken();
      if (!token || examsToSave.length < 2) return;

      const summary = compareExams(examsToSave);
      const listToCheck = existingRecords ?? savedComparisons;
      if (isComparisonInList(summary.exams, cls, listToCheck)) {
        return;
      }

      setSavingComparison(true);
      try {
        const response = await fetch('/api/comparisons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentClass: cls,
            examIds: summary.exams.map((e) => e.id),
            examNames: summary.exams.map((e) => e.shortName).join(' + '),
            overlapPercent: summary.overallOverlapPercent,
            commonCount: summary.commonTopicsCount,
            totalCount: summary.totalUnionTopics,
            strategy,
          }),
        });

        const data = (await response.json()) as {
          item?: SavedComparisonRecord;
          error?: string;
        };
        if (response.ok && data.item) {
          setSavedComparisons((prev) => {
            if (prev.some((p) => p.id === data.item!.id)) return prev;
            return [data.item!, ...prev];
          });
        }
      } catch {
        // Non-blocking background save
      } finally {
        setSavingComparison(false);
      }
    },
    [getToken, isComparisonInList, savedComparisons]
  );

  const runCompareFlow = useCallback(
    (examsToCompare: ExamData[]) => {
      if (examsToCompare.length < 2) return;

      if (!user) {
        setPendingCompareExams(examsToCompare);
        openAuthModal(
          'signup',
          'Sign up or log in with your email to compare exam syllabi and save your results.'
        );
        return;
      }

      setActiveSubjectName(null);
      setCurrentScreen('results');
      void persistComparisonRecord(examsToCompare, studentClass, null);
    },
    [user, openAuthModal, persistComparisonRecord, studentClass]
  );

  const handleAuthSuccess = useCallback(
    async (authenticatedUser: AuthUser) => {
      setAuthModalOpen(false);
      setAuthPromptMessage(null);

      const effectiveClass: StudentClass =
        authenticatedUser.studentClass === '10' ||
        authenticatedUser.studentClass === '11' ||
        authenticatedUser.studentClass === '12'
          ? authenticatedUser.studentClass
          : studentClass;

      if (pendingCompareExams && pendingCompareExams.length >= 2) {
        const queued = pendingCompareExams;
        setPendingCompareExams(null);
        setSelectedExams(queued);
        setActiveSubjectName(null);
        setCurrentScreen('results');

        const token = getToken();
        if (token) {
          try {
            const compRes = await fetch('/api/comparisons', {
              headers: { Authorization: `Bearer ${token}` },
            });
            let existing: SavedComparisonRecord[] = [];
            if (compRes.ok) {
              const compData = (await compRes.json()) as {
                items?: SavedComparisonRecord[];
              };
              existing = compData.items ?? [];
              setSavedComparisons(existing);
            }
            await persistComparisonRecord(
              queued,
              effectiveClass,
              null,
              existing
            );
          } catch {
            // Non-blocking sync
          }
        }
      }
    },
    [getToken, pendingCompareExams, persistComparisonRecord, studentClass]
  );

  const handleChangeClass = async (nextClass: StudentClass) => {
    setStudentClass(nextClass);
    updateLocalStudentClass(nextClass);
    if (!user) return;
    try {
      const token = getToken();
      if (!token) return;
      await fetch('/api/me/class', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentClass: nextClass }),
      });
    } catch {
      // Non-blocking class preference sync
    }
  };

  const handleOpenSearchSlot = (slotIndex: number) => {
    setActiveSearchSlot(slotIndex);
  };

  const handleSelectExam = (exam: ExamData) => {
    if (activeSearchSlot === null) return;
    setSelectedExams((prev) => {
      const next = [...prev];
      next[activeSearchSlot] = exam;
      return next;
    });
    setActiveSearchSlot(null);
  };

  const handleRemoveSlot = (slotIndex: number) => {
    setSelectedExams((prev) => {
      if (slotIndex === 2) {
        return prev.slice(0, 2);
      }
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const handleAddThirdSlot = () => {
    setSelectedExams((prev) => {
      if (prev.length >= 3) return prev;
      return [...prev, null];
    });
    setActiveSearchSlot(2);
  };

  const handleApplyQuickPairing = (examIds: string[]) => {
    const resolved = examIds
      .map((id) => EXAMS.find((e) => e.id === id) ?? null)
      .filter((e): e is ExamData => e !== null);

    if (resolved.length >= 2) {
      setSelectedExams(resolved);
      runCompareFlow(resolved);
    }
  };

  const handleCompareWithRelated = (relatedExam: ExamData) => {
    const primary = selectedExams[0];
    if (!primary) {
      setSelectedExams([relatedExam, null]);
      return;
    }
    const nextPair = [primary, relatedExam];
    setSelectedExams(nextPair);
    runCompareFlow(nextPair);
  };

  const handleSaveComparison = async (strategy: StudyStrategyResult | null) => {
    if (!comparisonSummary) return;
    setBannerError(null);

    if (!user) {
      setPendingCompareExams(comparisonSummary.exams);
      openAuthModal(
        'signup',
        'Sign up or log in with your email to save this comparison.'
      );
      return;
    }

    setSavingComparison(true);
    try {
      const token = getToken();
      if (!token) {
        openAuthModal('login', 'Please log in again to save your comparison.');
        return;
      }

      const response = await fetch('/api/comparisons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentClass,
          examIds: comparisonSummary.exams.map((e) => e.id),
          examNames: comparisonSummary.exams
            .map((e) => e.shortName)
            .join(' + '),
          overlapPercent: comparisonSummary.overallOverlapPercent,
          commonCount: comparisonSummary.commonTopicsCount,
          totalCount: comparisonSummary.totalUnionTopics,
          strategy,
        }),
      });

      const data = (await response.json()) as {
        item?: SavedComparisonRecord;
        error?: string;
      };
      if (!response.ok || !data.item) {
        throw new Error(data.error || 'Could not save comparison.');
      }

      setSavedComparisons((prev) => [data.item!, ...prev]);
    } catch (err: unknown) {
      setBannerError(
        err instanceof Error ? err.message : 'Could not save comparison.'
      );
    } finally {
      setSavingComparison(false);
    }
  };

  const handleOpenSavedComparison = (item: SavedComparisonRecord) => {
    try {
      const ids = JSON.parse(item.examIdsJson) as string[];
      const resolved = ids
        .map((id) => EXAMS.find((e) => e.id === id) ?? null)
        .filter((e): e is ExamData => e !== null);

      if (resolved.length >= 2) {
        if (
          item.studentClass === '10' ||
          item.studentClass === '11' ||
          item.studentClass === '12'
        ) {
          setStudentClass(item.studentClass);
        }
        if (item.strategyJson) {
          try {
            const parsedStrategy = JSON.parse(
              item.strategyJson
            ) as StudyStrategyResult;
            const cacheKey = `${item.studentClass}:${[...ids].sort().join('+')}`;
            setStrategyCache((prev) => ({
              ...prev,
              [cacheKey]: parsedStrategy,
            }));
          } catch {
            // Ignore invalid cached strategy JSON
          }
        }
        setSelectedExams(resolved);
        setActiveSubjectName(null);
        setCurrentScreen('results');
      }
    } catch {
      setBannerError('Could not open this saved comparison.');
    }
  };

  const handleDeleteSavedComparison = async (id: number) => {
    setBannerError(null);
    const previous = savedComparisons;
    setSavedComparisons((prev) => prev.filter((item) => item.id !== id));
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`/api/comparisons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Could not delete comparison.');
      }
    } catch (err: unknown) {
      setSavedComparisons(previous);
      setBannerError(
        err instanceof Error ? err.message : 'Could not delete comparison.'
      );
    }
  };

  const handleToggleChapterDone = async (
    topicId: string,
    subjectName: string,
    topicTitle: string
  ) => {
    const wasDone = completedTopicIds.has(topicId);
    setCompletedTopicIds((prev) => {
      const next = new Set(prev);
      if (wasDone) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });

    if (!user) return;
    try {
      const token = getToken();
      if (!token) return;
      if (wasDone) {
        await fetch(`/api/progress/${encodeURIComponent(topicId)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch('/api/progress', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topicId,
            subjectName,
            topicTitle,
            status: 'completed',
          }),
        });
      }
    } catch {
      setBannerError('Could not update chapter progress right now.');
    }
  };

  const handleResetAll = () => {
    setSelectedExams([null, null]);
    setActiveSearchSlot(null);
    setActiveSubjectName(null);
    setPendingCompareExams(null);
    setCurrentScreen('picker');
  };

  const handleCompare = () => {
    if (filledExams.length < 2) return;
    runCompareFlow(filledExams);
  };

  const handleSelectSubject = (subject: SubjectComparison) => {
    setActiveSubjectName(subject.subject);
    setCurrentScreen('chapterDetail');
  };

  const handleSignOut = () => {
    setPendingCompareExams(null);
    signOut();
    setCurrentScreen('picker');
  };

  const hasAnyExam = filledExams.length > 0;
  const displayError = bannerError || authError;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Compact 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6">
          {/* Zone 1: Single-line Brand Logo + Wordmark */}
          <button
            type="button"
            onClick={() => setCurrentScreen('picker')}
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg py-1 pr-1 font-display text-lg font-extrabold tracking-tight text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-100"
          >
            <PreppitLogo size={28} />
            <span>preppit</span>
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="Primary steps"
            className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex dark:text-slate-400"
          >
            <button
              type="button"
              onClick={() => setCurrentScreen('picker')}
              className={`shrink-0 whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-slate-100 ${
                currentScreen === 'picker'
                  ? 'font-semibold text-slate-900 dark:text-slate-100'
                  : ''
              }`}
            >
              Select Exams
            </button>
            <button
              type="button"
              disabled={!comparisonSummary}
              onClick={() => {
                if (!comparisonSummary) return;
                runCompareFlow(filledExams);
              }}
              className={`shrink-0 whitespace-nowrap transition-colors ${
                !comparisonSummary
                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-700'
                  : currentScreen === 'results' ||
                      currentScreen === 'chapterDetail'
                    ? 'font-semibold text-slate-900 dark:text-slate-100'
                    : 'hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Syllabus Overlap
            </button>
          </nav>

          {/* Zone 3: Contextual Reset, Login, and Three-Line Menu */}
          <div className="flex shrink-0 items-center gap-2">
            {hasAnyExam && currentScreen !== 'admin' && (
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}

            {!user && (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Log in</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMenuDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuDrawerOpen}
              className="relative flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Localized Error Banner */}
      {displayError && (
        <div className="mx-auto max-w-5xl px-4 pt-3 sm:px-6">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-800 dark:border-rose-800/70 dark:bg-rose-950/50 dark:text-rose-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{displayError}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setBannerError(null);
                clearAuthError();
              }}
              aria-label="Dismiss message"
              className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-lg text-rose-600 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-900/50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Screen */}
      <main>
        {currentScreen === 'picker' && (
          <ExamPickerScreen
            studentClass={studentClass}
            onChangeClass={handleChangeClass}
            selectedExams={selectedExams}
            onOpenSearchSlot={handleOpenSearchSlot}
            onRemoveSlot={handleRemoveSlot}
            onAddThirdSlot={handleAddThirdSlot}
            onApplyQuickPairing={handleApplyQuickPairing}
            onCompareWithRelated={handleCompareWithRelated}
            onCompare={handleCompare}
          />
        )}

        {currentScreen === 'results' && user && comparisonSummary && (
          <ComparisonResultsScreen
            studentClass={studentClass}
            summary={comparisonSummary}
            strategyCache={strategyCache}
            onSaveStrategy={handleSaveStrategy}
            onBackToPicker={() => setCurrentScreen('picker')}
            onSwapExamSlot={handleOpenSearchSlot}
            onSelectSubject={handleSelectSubject}
            isComparisonSaved={isComparisonSaved}
            savingComparison={savingComparison}
            onSaveComparison={handleSaveComparison}
          />
        )}

        {currentScreen === 'chapterDetail' &&
          user &&
          comparisonSummary &&
          activeSubject && (
            <SubjectDetailScreen
              subject={activeSubject}
              exams={comparisonSummary.exams}
              completedTopicIds={completedTopicIds}
              onToggleChapterDone={handleToggleChapterDone}
              onBack={() => setCurrentScreen('results')}
            />
          )}

        {currentScreen === 'admin' && isAdmin && (
          <AdminScreen
            token={getToken()}
            onBack={() => setCurrentScreen('picker')}
          />
        )}
      </main>

      {/* Screen 2: Exam Search & Recommendation Popup */}
      <ExamSearchModal
        isOpen={activeSearchSlot !== null}
        slotIndex={activeSearchSlot ?? 0}
        selectedExamIds={selectedExamIds}
        currentSlotExamId={
          activeSearchSlot !== null
            ? selectedExams[activeSearchSlot]?.id
            : undefined
        }
        onSelectExam={handleSelectExam}
        onClose={() => setActiveSearchSlot(null)}
      />

      {/* Email / Gmail Sign Up & Log In Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        reasonMessage={authPromptMessage}
        studentClass={studentClass}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthPromptMessage(null);
          setPendingCompareExams(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Student & Visitor Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        userEmail={user?.email ?? null}
        token={getToken()}
        onClose={() => setFeedbackModalOpen(false)}
      />

      {/* Saved Comparisons Drawer */}
      <SavedComparisonsDrawer
        isOpen={savedDrawerOpen}
        isLoggedIn={Boolean(user)}
        loading={loadingSaved}
        items={savedComparisons}
        onClose={() => setSavedDrawerOpen(false)}
        onOpenComparison={handleOpenSavedComparison}
        onDeleteComparison={handleDeleteSavedComparison}
        onRequireLogin={() =>
          openAuthModal(
            'login',
            'Log in with your email to access your saved exam comparisons.'
          )
        }
      />

      {/* Right-Side Three-Line Menu Drawer */}
      <MenuDrawer
        isOpen={menuDrawerOpen}
        user={user}
        isAdmin={isAdmin}
        studentClass={studentClass}
        savedCount={savedComparisons.length}
        hasAnyExam={hasAnyExam}
        hasComparison={Boolean(comparisonSummary)}
        currentScreen={currentScreen}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onClose={() => setMenuDrawerOpen(false)}
        onChangeClass={handleChangeClass}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onOpenAdmin={() => setCurrentScreen('admin')}
        onGoToPicker={() => setCurrentScreen('picker')}
        onGoToResults={() => {
          if (comparisonSummary) {
            runCompareFlow(filledExams);
          }
        }}
        onResetAll={handleResetAll}
        onOpenLogin={() => openAuthModal('login')}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
