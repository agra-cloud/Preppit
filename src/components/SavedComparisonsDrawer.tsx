import React, { useEffect } from 'react';
import {
  Bookmark,
  ChevronRight,
  LogIn,
  Trash2,
  X,
} from 'lucide-react';
import type { SavedComparisonRecord } from './ExamPickerScreen';

interface SavedComparisonsDrawerProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  items: SavedComparisonRecord[];
  onClose: () => void;
  onOpenComparison: (item: SavedComparisonRecord) => void;
  onDeleteComparison: (id: number) => void;
  onRequireLogin: () => void;
}

function formatSavedDate(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function SavedComparisonsDrawer({
  isOpen,
  isLoggedIn,
  loading,
  items,
  onClose,
  onOpenComparison,
  onDeleteComparison,
  onRequireLogin,
}: SavedComparisonsDrawerProps) {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end bg-slate-900/50 backdrop-blur-xs sm:items-stretch dark:bg-slate-950/75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-drawer-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Slide-over / Bottom Sheet */}
      <div className="relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-full sm:max-h-none sm:max-w-md sm:rounded-none sm:border-l sm:border-slate-200 dark:bg-slate-900 dark:sm:border-slate-800">
        {/* Mobile grab bar */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="saved-drawer-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                Saved Exams
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isLoggedIn
                  ? `${items.length} saved ${items.length === 1 ? 'comparison' : 'comparisons'}`
                  : 'Log in to sync across sessions'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved exams"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!isLoggedIn ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400">
                <Bookmark className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                Access your saved comparisons
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Log in or sign up with your email to view and reopen your saved
                exam overlap plans anytime.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequireLogin();
                }}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <LogIn className="h-4 w-4" />
                <span>Log in to view saved</span>
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                No saved exams yet
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Compare any 2 or 3 exams and they will appear here automatically
                for one-tap access.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Select exams to compare
              </button>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {items.map((item) => {
                const dateLabel = formatSavedDate(item.createdAt);
                return (
                  <li
                    key={item.id}
                    className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-blue-700"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onOpenComparison(item);
                        onClose();
                      }}
                      className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                          {item.examNames}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span>Class {item.studentClass}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {item.commonCount}/{item.totalCount} shared
                          </span>
                          {dateLabel && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{dateLabel}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                          {item.overlapPercent}%
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteComparison(item.id)}
                      aria-label={`Remove ${item.examNames}`}
                      className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center border-l border-slate-100 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
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
