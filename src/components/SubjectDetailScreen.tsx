import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Layers,
  PlusCircle,
  Share2,
} from 'lucide-react';
import {
  ExamData,
  SubjectComparison,
  TopicDifficulty,
  getTopicDifficulty,
} from '../data/exams';
import {
  copyTextToClipboard,
  formatSubjectShareText,
  shareSyllabusText,
} from '../lib/shareSyllabus';

interface SubjectDetailScreenProps {
  subject: SubjectComparison;
  exams: ExamData[];
  completedTopicIds: Set<string>;
  onToggleChapterDone: (
    topicId: string,
    subjectName: string,
    topicTitle: string
  ) => void;
  onBack: () => void;
}

function DifficultyBadge({ difficulty }: { difficulty: TopicDifficulty }) {
  const config = {
    Easy: {
      container:
        'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300',
      bars: [true, false, false],
      barColor: 'bg-emerald-600 dark:bg-emerald-400',
    },
    Medium: {
      container:
        'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300',
      bars: [true, true, false],
      barColor: 'bg-amber-600 dark:bg-amber-400',
    },
    Hard: {
      container:
        'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-300',
      bars: [true, true, true],
      barColor: 'bg-rose-600 dark:bg-rose-400',
    },
  }[difficulty];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${config.container}`}
      aria-label={`Difficulty: ${difficulty}`}
    >
      <span className="flex items-end gap-0.5" aria-hidden="true">
        <span
          className={`h-1.5 w-0.5 rounded-xs ${
            config.bars[0]
              ? config.barColor
              : 'bg-slate-300 dark:bg-slate-700'
          }`}
        />
        <span
          className={`h-2 w-0.5 rounded-xs ${
            config.bars[1]
              ? config.barColor
              : 'bg-slate-300 dark:bg-slate-700'
          }`}
        />
        <span
          className={`h-2.5 w-0.5 rounded-xs ${
            config.bars[2]
              ? config.barColor
              : 'bg-slate-300 dark:bg-slate-700'
          }`}
        />
      </span>
      <span>{difficulty}</span>
    </span>
  );
}

const DIFFICULTY_FILTERS: Array<'All' | TopicDifficulty> = [
  'All',
  'Easy',
  'Medium',
  'Hard',
];

export function SubjectDetailScreen({
  subject,
  exams,
  completedTopicIds,
  onToggleChapterDone,
  onBack,
}: SubjectDetailScreenProps) {
  const [filterKey, setFilterKey] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<
    'All' | TopicDifficulty
  >('All');
  const [copiedSubject, setCopiedSubject] = useState<boolean>(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleCopySubject = async () => {
    const text = formatSubjectShareText(subject, exams, completedTopicIds);
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    }
  };

  const handleShareSubject = async () => {
    const text = formatSubjectShareText(subject, exams, completedTopicIds);
    const result = await shareSyllabusText({
      title: `${subject.subject} Syllabus (${exams.map((e) => e.shortName).join(' + ')})`,
      text,
    });
    if (result === 'copied') {
      setShareStatus('Copied to share');
      setTimeout(() => setShareStatus(null), 2200);
    } else if (result === 'shared') {
      setShareStatus('Shared');
      setTimeout(() => setShareStatus(null), 2200);
    }
  };

  const filterTabs = useMemo(() => {
    const tabs: Array<{ key: string; label: string; count: number }> = [
      { key: 'all', label: 'All Chapters', count: subject.items.length },
      { key: 'common', label: 'Shared', count: subject.commonCount },
    ];

    if (subject.partialCount > 0) {
      tabs.push({
        key: 'partial',
        label: 'In 2 Exams',
        count: subject.partialCount,
      });
    }

    exams.forEach((exam) => {
      const count = subject.uniqueCountsByExam[exam.id] ?? 0;
      if (count > 0) {
        tabs.push({
          key: `only:${exam.id}`,
          label: `Only ${exam.shortName}`,
          count,
        });
      }
    });

    return tabs;
  }, [subject, exams]);

  const difficultyCounts = useMemo(() => {
    const counts: Record<TopicDifficulty, number> = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };
    subject.items.forEach((item) => {
      const diff = getTopicDifficulty(item.topic);
      counts[diff] += 1;
    });
    return counts;
  }, [subject.items]);

  const studiedInSubjectCount = useMemo(
    () =>
      subject.items.filter((item) => completedTopicIds.has(item.topic.id))
        .length,
    [subject.items, completedTopicIds]
  );

  const filteredItems = useMemo(() => {
    return subject.items.filter((item) => {
      if (filterKey === 'common' && item.status !== 'common') return false;
      if (filterKey === 'partial' && item.status !== 'partial') return false;
      if (filterKey.startsWith('only:')) {
        const targetId = filterKey.replace('only:', '');
        if (!(item.status === 'unique' && item.uniqueToExamId === targetId)) {
          return false;
        }
      }
      if (
        difficultyFilter !== 'All' &&
        getTopicDifficulty(item.topic) !== difficultyFilter
      ) {
        return false;
      }
      return true;
    });
  }, [subject.items, filterKey, difficultyFilter]);

  const getExamShortName = (id?: string) =>
    exams.find((e) => e.id === id)?.shortName ?? 'Exam';

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-5 pb-12 sm:px-6 sm:pt-8">
      {/* Back navigation + Copy & Share */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Results</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySubject}
            className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
              copiedSubject
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {copiedSubject ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>Copy Chapters</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareSubject}
            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {shareStatus ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-800 dark:text-emerald-300">
                  {shareStatus}
                </span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subject Summary Card */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {subject.subject} Chapters
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Comparing {exams.map((e) => e.shortName).join(' · ')}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100 sm:text-3xl">
              {subject.overlapPercent}%
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              subject overlap
            </p>
          </div>
        </div>

        {/* Quick difficulty & study progress summary */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Study load:
            </span>
            <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              {difficultyCounts.Easy} Easy
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
              {difficultyCounts.Medium} Medium
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-rose-700 dark:text-rose-400">
              {difficultyCounts.Hard} Hard
            </span>
          </div>
          <div className="font-mono font-semibold text-blue-700 tabular-nums dark:text-blue-400">
            {studiedInSubjectCount}/{subject.items.length} done
          </div>
        </div>
      </div>

      {/* Interactive Filter Tabs (Overlap Status) */}
      <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const active = filterKey === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterKey(tab.key)}
              className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                active
                  ? 'bg-slate-900 text-white dark:bg-blue-600'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono tabular-nums ${
                  active
                    ? 'text-slate-300 dark:text-blue-100'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Difficulty Filter Row */}
      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="mr-1 shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
          Difficulty:
        </span>
        {DIFFICULTY_FILTERS.map((level) => {
          const active = difficultyFilter === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => setDifficultyFilter(level)}
              className={`min-h-[36px] shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100'
              }`}
            >
              {level}
            </button>
          );
        })}
      </div>

      {/* Chapters List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No chapters match this filter combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterKey('all');
                setDifficultyFilter('All');
              }}
              className="mt-3 inline-flex min-h-[40px] items-center justify-center rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredItems.map((item) => {
              const presentNames = item.presentInExamIds
                .map((id) => getExamShortName(id))
                .join(' + ');
              const difficulty = getTopicDifficulty(item.topic);
              const isDone = completedTopicIds.has(item.topic.id);

              return (
                <li
                  key={item.topic.id}
                  className={`flex flex-col gap-2.5 px-4 py-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                    isDone ? 'bg-slate-50/70 dark:bg-slate-800/40' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isDone
                            ? 'text-slate-500 line-through dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {item.topic.title}
                      </span>
                      <DifficultyBadge difficulty={difficulty} />
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span>Weightage: {item.topic.weightage}</span>
                      {item.topic.note && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.topic.note}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                    {/* Dual-coded status indicator */}
                    <div className="shrink-0">
                      {item.status === 'common' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          <Check className="h-4 w-4 shrink-0" />
                          <span>Shared in all ({exams.length})</span>
                        </span>
                      ) : item.status === 'partial' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                          <Layers className="h-4 w-4 shrink-0" />
                          <span>In {presentNames}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                          <PlusCircle className="h-4 w-4 shrink-0" />
                          <span>
                            Only in {getExamShortName(item.uniqueToExamId)}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Chapter Study Progress Toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        onToggleChapterDone(
                          item.topic.id,
                          subject.subject,
                          item.topic.title
                        )
                      }
                      aria-pressed={isDone}
                      className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950/70'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          <span>Mark done</span>
                        </>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
