import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Info,
  Pencil,
  Share2,
} from 'lucide-react';
import {
  ComparisonSummary,
  ExamData,
  ExamDifficultyLevel,
  StudentClass,
  SubjectComparison,
  getExamPattern,
} from '../data/exams';
import {
  StudyStrategyBanner,
  StudyStrategyResult,
} from './StudyStrategyBanner';
import {
  copyTextToClipboard,
  formatComparisonShareText,
  shareSyllabusText,
} from '../lib/shareSyllabus';

interface ComparisonResultsScreenProps {
  studentClass: StudentClass;
  summary: ComparisonSummary;
  strategyCache: Record<string, StudyStrategyResult>;
  onSaveStrategy: (key: string, data: StudyStrategyResult) => void;
  onBackToPicker: () => void;
  onSwapExamSlot: (slotIndex: number) => void;
  onSelectSubject: (subject: SubjectComparison) => void;
  isComparisonSaved: boolean;
  savingComparison: boolean;
  onSaveComparison: (strategy: StudyStrategyResult | null) => void;
}

export function ComparisonResultsScreen({
  studentClass,
  summary,
  strategyCache,
  onSaveStrategy,
  onBackToPicker,
  onSwapExamSlot,
  onSelectSubject,
  isComparisonSaved,
  savingComparison,
  onSaveComparison,
}: ComparisonResultsScreenProps) {
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [copiedSyllabus, setCopiedSyllabus] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const cacheKey = `${studentClass}:${summary.exams
    .map((e) => e.id)
    .sort()
    .join('+')}`;
  const currentStrategy = strategyCache[cacheKey] ?? null;

  const handleCopyOverlap = async () => {
    const text = formatComparisonShareText(summary, studentClass);
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedSyllabus(true);
      setTimeout(() => setCopiedSyllabus(false), 2000);
    }
  };

  const handleShareOverlap = async () => {
    const examNames = summary.exams.map((e) => e.shortName).join(' + ');
    const text = formatComparisonShareText(summary, studentClass);
    const result = await shareSyllabusText({
      title: `Preppit Syllabus Overlap: ${examNames}`,
      text,
    });
    if (result === 'copied') {
      setShareFeedback('Copied to share');
      setTimeout(() => setShareFeedback(null), 2200);
    } else if (result === 'shared') {
      setShareFeedback('Shared');
      setTimeout(() => setShareFeedback(null), 2200);
    }
  };

  const subjectNames = useMemo(
    () => ['All', ...summary.subjectComparisons.map((s) => s.subject)],
    [summary.subjectComparisons]
  );

  const visibleSubjects = useMemo(() => {
    if (subjectFilter === 'All') return summary.subjectComparisons;
    return summary.subjectComparisons.filter(
      (s) => s.subject === subjectFilter
    );
  }, [summary.subjectComparisons, subjectFilter]);

  const verdictStyles = {
    high: {
      container:
        'border-emerald-200 bg-emerald-50/70 dark:border-emerald-800/60 dark:bg-emerald-950/35',
      iconColor: 'text-emerald-700 dark:text-emerald-400',
      labelColor: 'text-emerald-800 dark:text-emerald-300',
      badgeText: 'Recommended together',
      Icon: CheckCircle2,
    },
    moderate: {
      container:
        'border-amber-200 bg-amber-50/70 dark:border-amber-800/60 dark:bg-amber-950/35',
      iconColor: 'text-amber-700 dark:text-amber-400',
      labelColor: 'text-amber-800 dark:text-amber-300',
      badgeText: 'Manageable with extra hours',
      Icon: Info,
    },
    low: {
      container:
        'border-rose-200 bg-rose-50/70 dark:border-rose-800/60 dark:bg-rose-950/35',
      iconColor: 'text-rose-700 dark:text-rose-400',
      labelColor: 'text-rose-800 dark:text-rose-300',
      badgeText: 'Mostly separate syllabi',
      Icon: AlertTriangle,
    },
  }[summary.verdictLevel];

  const VerdictIcon = verdictStyles.Icon;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-5 pb-12 sm:px-6 sm:pt-8">
      {/* Top Action Row */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToPicker}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Change Exams</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 hidden font-mono text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400 md:inline">
            {summary.totalUnionTopics} chapters compared
          </span>

          <button
            type="button"
            onClick={handleCopyOverlap}
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
              copiedSyllabus
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {copiedSyllabus ? (
              <>
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>Copy Syllabus</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareOverlap}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {shareFeedback ? (
              <>
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-800 dark:text-emerald-300">
                  {shareFeedback}
                </span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={savingComparison || isComparisonSaved}
            onClick={() => onSaveComparison(currentStrategy)}
            className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
              isComparisonSaved
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500'
            }`}
          >
            {isComparisonSaved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>
                  {savingComparison ? 'Saving...' : 'Save Comparison'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected Exams Strip (Tap any exam to swap it directly) */}
      <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {summary.exams.map((exam: ExamData, index: number) => (
          <button
            key={exam.id}
            type="button"
            onClick={() => onSwapExamSlot(index)}
            className="flex min-h-[54px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left transition-colors hover:border-blue-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-slate-800/70"
          >
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Exam {index + 1}
              </div>
              <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                {exam.name}
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Pencil className="h-3.5 w-3.5" />
              Swap
            </span>
          </button>
        ))}
      </div>

      {/* Study Strategy AI Banner */}
      <StudyStrategyBanner
        studentClass={studentClass}
        summary={summary}
        cachedStrategy={currentStrategy}
        cacheKey={cacheKey}
        onSaveStrategy={onSaveStrategy}
      />

      {/* Main Layout: Verdict Overview + Subject Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Overview Score & Verdict */}
        <section className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Overall syllabus overlap
                </p>
                <div className="mt-1 font-mono text-4xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-slate-100 sm:text-5xl">
                  {summary.overallOverlapPercent}%
                </div>
              </div>
              <div className="text-right font-mono text-xs text-slate-600 tabular-nums dark:text-slate-400">
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-slate-100">
                    {summary.commonTopicsCount}
                  </strong>{' '}
                  common
                </div>
                {summary.partialTopicsCount > 0 && (
                  <div>
                    <strong className="font-semibold text-slate-900 dark:text-slate-100">
                      {summary.partialTopicsCount}
                    </strong>{' '}
                    in 2 exams
                  </div>
                )}
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-slate-100">
                    {summary.totalUnionTopics -
                      summary.commonTopicsCount -
                      summary.partialTopicsCount}
                  </strong>{' '}
                  unique
                </div>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="flex h-full w-full">
                <div
                  className="bg-emerald-600 transition-all duration-200"
                  style={{
                    width: `${
                      summary.totalUnionTopics
                        ? (summary.commonTopicsCount /
                            summary.totalUnionTopics) *
                          100
                        : 0
                    }%`,
                  }}
                />
                {summary.partialTopicsCount > 0 && (
                  <div
                    className="bg-blue-500 transition-all duration-200"
                    style={{
                      width: `${
                        summary.totalUnionTopics
                          ? (summary.partialTopicsCount /
                              summary.totalUnionTopics) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                )}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-xs bg-emerald-600" />
                Shared by all
              </span>
              {summary.partialTopicsCount > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-xs bg-blue-500" />
                  Shared by 2
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-xs bg-slate-200 dark:bg-slate-700" />
                Exam-specific
              </span>
            </div>

            {/* Study-Together Verdict Box (Semantic icon + explicit text label) */}
            <div
              className={`mt-5 rounded-xl border p-4 ${verdictStyles.container}`}
            >
              <div className="flex items-start gap-2.5">
                <VerdictIcon
                  className={`mt-0.5 h-5 w-5 shrink-0 ${verdictStyles.iconColor}`}
                />
                <div>
                  <div
                    className={`text-xs font-bold ${verdictStyles.labelColor}`}
                  >
                    {verdictStyles.badgeText}
                  </div>
                  <h2 className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
                    {summary.verdictTitle}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm">
                    {summary.verdictExplanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subject Breakdown List */}
        <section className="lg:col-span-7">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Subject-by-Subject Breakdown
            </h2>
          </div>

          {/* Interactive Subject Filter Tabs */}
          <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            {subjectNames.map((subName) => {
              const active = subjectFilter === subName;
              return (
                <button
                  key={subName}
                  type="button"
                  onClick={() => setSubjectFilter(subName)}
                  className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-blue-600'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  {subName}
                </button>
              );
            })}
          </div>

          {/* Subject Cards */}
          <div className="space-y-3">
            {visibleSubjects.map((sub) => {
              const commonPct = sub.totalUnionTopics
                ? (sub.commonCount / sub.totalUnionTopics) * 100
                : 0;
              const partialPct = sub.totalUnionTopics
                ? (sub.partialCount / sub.totalUnionTopics) * 100
                : 0;

              return (
                <button
                  key={sub.subject}
                  type="button"
                  onClick={() => onSelectSubject(sub)}
                  className="group block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:bg-slate-50/60 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-slate-800/60 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {sub.subject}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                          {sub.commonCount} shared
                        </span>
                        {summary.exams.map((ex) => {
                          const uniqueCount = sub.uniqueCountsByExam[ex.id] ?? 0;
                          if (uniqueCount === 0) return null;
                          return (
                            <React.Fragment key={ex.id}>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">
                                {uniqueCount} only in {ex.shortName}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-mono text-lg font-bold text-slate-900 tabular-nums dark:text-slate-100">
                        {sub.overlapPercent}%
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                    </div>
                  </div>

                  {/* Subject overlap bar */}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="flex h-full w-full">
                      <div
                        className="bg-emerald-600"
                        style={{ width: `${commonPct}%` }}
                      />
                      {partialPct > 0 && (
                        <div
                          className="bg-blue-500"
                          style={{ width: `${partialPct}%` }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>View {sub.totalUnionTopics} chapters</span>
                    <span>Tap to inspect</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Exam Pattern & Key Stats Comparison */}
      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Exam Pattern &amp; Difficulty
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Side-by-side marking scheme, negative marking, selection ratio, and
            conducting body
          </p>
        </div>

        <div
          className={`grid grid-cols-1 gap-3 ${
            summary.exams.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
          }`}
        >
          {summary.exams.map((exam) => {
            const pattern = getExamPattern(exam.id);
            const difficultyStyles: Record<ExamDifficultyLevel, string> = {
              Moderate:
                'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300',
              'Moderate–Hard':
                'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300',
              High: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/60 dark:bg-blue-950/50 dark:text-blue-300',
              'Very High':
                'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-300',
            };
            const hasNoNegative =
              pattern.negativeMarking.startsWith('None') ||
              pattern.negativeMarking.startsWith('N/A');

            return (
              <div
                key={exam.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
                      {exam.shortName}
                    </h3>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {pattern.modeDuration}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-lg border px-2 py-0.5 text-[11px] font-semibold ${difficultyStyles[pattern.difficulty]}`}
                  >
                    {pattern.difficulty}
                  </span>
                </div>

                <dl className="mt-3 divide-y divide-slate-100 text-xs dark:divide-slate-800">
                  <div className="py-2">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">
                      Conducting Body
                    </dt>
                    <dd className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
                      {pattern.conductingBody}
                    </dd>
                  </div>

                  <div className="py-2">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">
                      Marking Scheme
                    </dt>
                    <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                      {pattern.markingScheme}
                    </dd>
                  </div>

                  <div className="py-2">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">
                      Negative Marking
                    </dt>
                    <dd
                      className={`mt-0.5 font-semibold ${
                        hasNoNegative
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {pattern.negativeMarking}
                    </dd>
                  </div>

                  <div className="pt-2">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">
                      Selection Ratio
                    </dt>
                    <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                      {pattern.selectionRatio}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
