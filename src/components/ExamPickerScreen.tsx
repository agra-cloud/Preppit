import React from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Layers,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  EXAMS,
  ExamData,
  QUICK_PAIRINGS,
  StudentClass,
  getExamTopicCount,
  getRelatedExams,
} from '../data/exams';

export interface SavedComparisonRecord {
  id: number;
  studentClass: string;
  examIdsJson: string;
  examNames: string;
  overlapPercent: number;
  commonCount: number;
  totalCount: number;
  strategyJson?: string | null;
  createdAt?: string;
}

interface ExamPickerScreenProps {
  studentClass: StudentClass;
  onChangeClass: (cls: StudentClass) => void;
  selectedExams: Array<ExamData | null>;
  onOpenSearchSlot: (slotIndex: number) => void;
  onRemoveSlot: (slotIndex: number) => void;
  onAddThirdSlot: () => void;
  onApplyQuickPairing: (examIds: string[]) => void;
  onCompareWithRelated: (relatedExam: ExamData) => void;
  onCompare: () => void;
}

const CLASS_OPTIONS: Array<{ value: StudentClass; label: string }> = [
  { value: '10', label: 'Class 10' },
  { value: '11', label: 'Class 11' },
  { value: '12', label: 'Class 12 / Dropper' },
];

export function ExamPickerScreen({
  studentClass,
  onChangeClass,
  selectedExams,
  onOpenSearchSlot,
  onRemoveSlot,
  onAddThirdSlot,
  onApplyQuickPairing,
  onCompareWithRelated,
  onCompare,
}: ExamPickerScreenProps) {
  const filledExams = selectedExams.filter(
    (exam): exam is ExamData => exam !== null
  );
  const primaryExam = selectedExams[0];
  const relatedExams = primaryExam
    ? getRelatedExams(
        primaryExam,
        filledExams.map((e) => e.id),
        6
      )
    : [];
  const canCompare = filledExams.length >= 2;
  const canAddThird =
    selectedExams.length === 2 &&
    selectedExams[0] !== null &&
    selectedExams[1] !== null;

  const sortedPairings = [...QUICK_PAIRINGS].sort((a, b) => {
    const aMatch = a.recommendedFor.includes(studentClass) ? 0 : 1;
    const bMatch = b.recommendedFor.includes(studentClass) ? 0 : 1;
    return aMatch - bMatch;
  });

  const getExamNamesForPairing = (examIds: string[]) =>
    examIds
      .map((id) => EXAMS.find((e) => e.id === id)?.shortName)
      .filter(Boolean)
      .join(' + ');

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-28 sm:px-6 sm:pt-10 sm:pb-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Main Column: Screen 1 Exam Selection */}
        <section className="lg:col-span-7">
          <div className="mb-6">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Compare Your Exam Syllabus
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              Not sure if you can prepare for two exams together? Pick your exams
              one at a time to see shared chapters and extra topics.
            </p>
          </div>

          {/* Class Selector */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your current class
            </p>
            <div
              className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-800 sm:w-auto"
              role="group"
              aria-label="Select your class"
            >
              {CLASS_OPTIONS.map((opt) => {
                const active = studentClass === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChangeClass(opt.value)}
                    className={`min-h-[44px] flex-1 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 sm:flex-initial sm:text-sm ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exam Selection Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="space-y-4">
              {selectedExams.map((exam, index) => {
                const slotTitle =
                  index === 0
                    ? 'Exam 1 (Primary)'
                    : index === 1
                      ? 'Exam 2 (Compare with)'
                      : 'Exam 3 (Optional)';

                const placeholderText =
                  index === 0
                    ? 'Pick exam (e.g., JEE Mains)'
                    : index === 1
                      ? '2nd exam (e.g., CUET UG)'
                      : '3rd exam (e.g., BITSAT)';

                return (
                  <div key={index}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {slotTitle}
                      </label>
                      {exam && (index === 2 || filledExams.length > 1) && (
                        <button
                          type="button"
                          onClick={() => onRemoveSlot(index)}
                          aria-label={`Remove ${exam.name}`}
                          className="inline-flex min-h-[32px] items-center gap-1 rounded-lg px-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenSearchSlot(index)}
                      className={`flex min-h-[56px] w-full items-center justify-between gap-2.5 rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 sm:min-h-[58px] sm:gap-3 sm:px-4 ${
                        exam
                          ? 'border-blue-200 bg-blue-50/40 hover:border-blue-300 hover:bg-blue-50/70 dark:border-blue-800/70 dark:bg-blue-950/30 dark:hover:border-blue-700 dark:hover:bg-blue-950/50'
                          : 'border-slate-300 bg-slate-50/70 hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-600 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${
                            exam
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                          }`}
                        >
                          <Search className="h-4 w-4" />
                        </div>

                        {exam ? (
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
                              {exam.name}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-600 dark:text-slate-400">
                              <span>{exam.category}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">
                                {getExamTopicCount(exam)} topics
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs leading-snug font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                            {placeholderText}
                          </span>
                        )}
                      </div>

                      <span className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {exam ? 'Change' : 'Search'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Optional 3rd exam button */}
            {canAddThird && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onAddThirdSlot}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Add a 3rd exam
                </button>
              </div>
            )}

            {/* Desktop Primary CTA */}
            <div className="mt-6 hidden sm:block">
              <button
                type="button"
                disabled={!canCompare}
                onClick={onCompare}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  canCompare
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                }`}
              >
                <span>
                  {canCompare
                    ? `Compare ${filledExams.length} Exam Syllabi`
                    : 'Select at least 2 exams to compare'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Automatic Related Exams Suggestions with Overlap % */}
          {primaryExam && relatedExams.length > 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Related exams for {primaryExam.shortName}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Exams you can prepare alongside {primaryExam.shortName} — tap any to compare
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {relatedExams.map(({ exam, overlapPercent, sharedTopicsCount }) => (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => onCompareWithRelated(exam)}
                    className="group flex min-h-[60px] w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800/60 sm:rounded-xl sm:px-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
                        {exam.name}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span>{exam.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {sharedTopicsCount} shared topics
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-emerald-700 tabular-nums dark:text-emerald-400 sm:text-base">
                          {overlapPercent}%
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          overlap
                        </div>
                      </div>
                      <span className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-200">
                        Compare
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Secondary Column: Quick-Compare Pairs & How It Works */}
        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Popular student combinations
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Tap any pair to fill exams automatically
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedPairings.slice(0, 4).map((pair) => (
                <button
                  key={pair.label}
                  type="button"
                  onClick={() => onApplyQuickPairing(pair.examIds)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800/60"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {getExamNamesForPairing(pair.examIds)}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {pair.subtitle}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              How Preppit helps
            </h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Layers className="h-4 w-4" />
                </div>
                <span>
                  See the exact percentage of shared chapters before deciding to
                  prepare for two exams together.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span>
                  Check subject-wise extra topics so you know exactly what needs
                  extra study hours.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Bottom CTA (compact, under 15% mobile height) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:hidden">
        <button
          type="button"
          disabled={!canCompare}
          onClick={onCompare}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all ${
            canCompare
              ? 'bg-blue-600 text-white active:scale-[0.99]'
              : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
          }`}
        >
          <span>
            {canCompare
              ? `Compare ${filledExams.length} Exams`
              : 'Select 2 exams to compare'}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
