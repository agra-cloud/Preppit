import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronRight, Search, X } from 'lucide-react';
import {
  EXAMS,
  ExamCategory,
  ExamData,
  getExamTopicCount,
} from '../data/exams';

interface ExamSearchModalProps {
  isOpen: boolean;
  slotIndex: number;
  selectedExamIds: string[];
  currentSlotExamId?: string;
  onSelectExam: (exam: ExamData) => void;
  onClose: () => void;
}

const CATEGORIES: Array<'All' | ExamCategory> = [
  'All',
  'Engineering',
  'Medical',
  'Boards',
  'Law & MBA',
  'Govt & CA',
  'Scholarship',
  'Defence & General',
];

function HighlightedText({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) {
    return <span>{text}</span>;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return <span>{text}</span>;
  }

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + trimmed.length);
  const after = text.slice(matchIndex + trimmed.length);

  return (
    <span>
      {before}
      <span className="font-bold text-blue-600 underline decoration-blue-200 underline-offset-2 dark:text-blue-400 dark:decoration-blue-700">
        {match}
      </span>
      {after}
    </span>
  );
}

export function ExamSearchModal({
  isOpen,
  slotIndex,
  selectedExamIds,
  currentSlotExamId,
  onSelectExam,
  onClose,
}: ExamSearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | ExamCategory>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveCategory('All');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const filteredExams = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    return EXAMS.filter((exam) => {
      if (activeCategory !== 'All' && exam.category !== activeCategory) {
        return false;
      }
      if (tokens.length === 0) return true;

      const searchable = [
        exam.name,
        exam.shortName,
        exam.category,
        exam.levelSummary,
        ...exam.aliases,
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((token) => searchable.includes(token));
    });
  }, [query, activeCategory]);

  if (!isOpen) return null;

  const slotLabel =
    slotIndex === 0
      ? 'Select your primary exam'
      : slotIndex === 1
        ? 'Select second exam to compare'
        : 'Select third exam to compare';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs dark:bg-black/70 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exam-search-title"
    >
      {/* Backdrop tap target */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 flex h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900 sm:h-[620px] sm:rounded-2xl sm:border sm:border-slate-200">
        {/* Mobile bottom sheet grab bar */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2
            id="exam-search-title"
            className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg"
          >
            {slotLabel}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close exam search"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="border-b border-slate-100 px-5 pt-3.5 pb-3 dark:border-slate-800">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search (e.g., NEET, JEE, ICSE, RBSE)"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800 sm:text-sm"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search text"
                className="absolute right-1 flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Interactive Stream Filter Buttons */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[36px] shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-blue-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommendations List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="px-2 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {query.trim()
              ? `Matching exams (${filteredExams.length})`
              : `Recommended exams (${filteredExams.length})`}
          </div>

          {filteredExams.length === 0 ? (
            <div className="mx-2 my-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/60">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                No exam found for &ldquo;{query.trim()}&rdquo;
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Try searching &ldquo;NEET&rdquo;, &ldquo;JEE&rdquo;, &ldquo;ICSE&rdquo;, &ldquo;MP Board&rdquo;, or &ldquo;RBSE&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('All');
                  inputRef.current?.focus();
                }}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Show all exams
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredExams.map((exam) => {
                const isSelectedHere = exam.id === currentSlotExamId;
                const isSelectedElsewhere =
                  selectedExamIds.includes(exam.id) && !isSelectedHere;
                const topicCount = getExamTopicCount(exam);

                return (
                  <li key={exam.id}>
                    <button
                      type="button"
                      disabled={isSelectedElsewhere}
                      onClick={() => onSelectExam(exam)}
                      className={`flex min-h-[60px] w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                        isSelectedElsewhere
                          ? 'cursor-not-allowed opacity-50'
                          : isSelectedHere
                            ? 'bg-blue-50/70 hover:bg-blue-50 dark:bg-blue-950/50 dark:hover:bg-blue-950/70'
                            : 'hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-slate-800/60 dark:active:bg-slate-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
                            <HighlightedText text={exam.name} query={query} />
                          </span>
                        </div>
                        {/* Clean unboxed metadata with dot separators (zero pill clutter) */}
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span>{exam.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{exam.levelSummary}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {topicCount} topics
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelectedElsewhere ? (
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Already picked
                          </span>
                        ) : isSelectedHere ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <Check className="h-4 w-4" />
                            Selected
                          </span>
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
