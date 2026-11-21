import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { ComparisonSummary, StudentClass } from '../data/exams';

export interface StudyStrategyResult {
  headline: string;
  summary: string;
  prioritySteps: string[];
}

interface StudyStrategyBannerProps {
  studentClass: StudentClass;
  summary: ComparisonSummary;
  cachedStrategy: StudyStrategyResult | null;
  cacheKey: string;
  onSaveStrategy: (key: string, data: StudyStrategyResult) => void;
}

export function StudyStrategyBanner({
  studentClass,
  summary,
  cachedStrategy,
  cacheKey,
  onSaveStrategy,
}: StudyStrategyBannerProps) {
  const [strategy, setStrategy] = useState<StudyStrategyResult | null>(
    cachedStrategy
  );
  const [loading, setLoading] = useState<boolean>(!cachedStrategy);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [refreshState, setRefreshState] = useState<{
    key: string;
    tick: number;
  }>({ key: cacheKey, tick: 0 });

  const activeRefreshTick =
    refreshState.key === cacheKey ? refreshState.tick : 0;

  useEffect(() => {
    if (cachedStrategy && activeRefreshTick === 0) {
      setStrategy(cachedStrategy);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 25_000);

    async function fetchStrategy() {
      setLoading(true);
      setError(null);

      const commonTopics = summary.subjectComparisons
        .flatMap((sub) =>
          sub.items
            .filter((item) => item.status === 'common')
            .map((item) => `${sub.subject}: ${item.topic.title}`)
        )
        .slice(0, 12);

      const subjectHighlights = summary.subjectComparisons.map((sub) => ({
        subject: sub.subject,
        overlapPercent: sub.overlapPercent,
        commonCount: sub.commonCount,
        totalUnionTopics: sub.totalUnionTopics,
      }));

      try {
        const response = await fetch('/api/study-strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            studentClass,
            exams: summary.exams.map((e) => ({
              name: e.name,
              shortName: e.shortName,
            })),
            overallOverlapPercent: summary.overallOverlapPercent,
            commonTopics,
            subjectHighlights,
            forceRefresh: activeRefreshTick > 0,
          }),
        });

        const rawText = await response.text();
        let data: Partial<StudyStrategyResult> & { error?: string } = {};
        if (rawText) {
          try {
            data = JSON.parse(rawText) as Partial<StudyStrategyResult> & {
              error?: string;
            };
          } catch {
            data = {};
          }
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              (response.status === 429
                ? 'Study strategy is busy right now. Please tap Retry in a few seconds.'
                : 'Could not load study strategy advice. Please tap Retry.')
          );
        }

        if (!data.headline || !data.summary) {
          throw new Error(
            'Received an incomplete study strategy. Please tap Retry.'
          );
        }

        const cleanStrategy: StudyStrategyResult = {
          headline: data.headline,
          summary: data.summary,
          prioritySteps: Array.isArray(data.prioritySteps)
            ? data.prioritySteps
            : [],
        };

        setStrategy(cleanStrategy);
        onSaveStrategy(cacheKey, cleanStrategy);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          if (timedOut) {
            setError(
              'Generating the study plan took too long. Please tap Retry.'
            );
          }
          return;
        }
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to fetch study strategy right now.'
        );
      } finally {
        window.clearTimeout(timeoutId);
        if (!controller.signal.aborted || timedOut) {
          setLoading(false);
        }
      }
    }

    fetchStrategy();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [cacheKey, activeRefreshTick]);

  const handleTriggerRefresh = () => {
    setRefreshState((prev) => ({
      key: cacheKey,
      tick: prev.key === cacheKey ? prev.tick + 1 : 1,
    }));
  };

  return (
    <div
      className="relative mb-5 rounded-2xl border border-blue-200 bg-white p-4 sm:p-5 dark:border-blue-900/70 dark:bg-slate-900"
      aria-live="polite"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base dark:text-slate-100">
                Study Strategy
              </h2>
              <button
                type="button"
                onClick={() => setShowTooltip((prev) => !prev)}
                onBlur={() => setTimeout(() => setShowTooltip(false), 150)}
                aria-label="AI disclaimer for Study Strategy"
                aria-expanded={showTooltip}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              How to prioritize overlapping topics first
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {!loading && (
            <button
              type="button"
              onClick={handleTriggerRefresh}
              aria-label="Refresh study strategy"
              className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-label={
              isExpanded ? 'Collapse study strategy' : 'Expand study strategy'
            }
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {showTooltip && (
        <div
          role="tooltip"
          className="mt-2.5 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white dark:border-slate-700 dark:bg-slate-800"
        >
          AI responses may include mistakes. Verify them.
        </div>
      )}

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          {loading ? (
            <div className="space-y-2.5" aria-busy="true">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Building a study priority plan for your overlap...
              </p>
              <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ) : error ? (
            <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-rose-800/70 dark:bg-rose-950/40">
              <div className="flex items-start gap-2 text-xs text-rose-800 dark:text-rose-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={handleTriggerRefresh}
                className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Retry
              </button>
            </div>
          ) : strategy ? (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {strategy.headline}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                {strategy.summary}
              </p>
              {strategy.prioritySteps.length > 0 && (
                <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {strategy.prioritySteps.map((step, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                    >
                      <span className="mr-1.5 font-mono font-semibold text-blue-600 tabular-nums dark:text-blue-400">
                        0{idx + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
