import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookCheck,
  GitCompare,
  MessageSquare,
  RefreshCw,
  Shield,
  Star,
  Users,
} from 'lucide-react';

interface AdminUserRow {
  id: number;
  email: string;
  displayName: string | null;
  role: string;
  studentClass: string;
  createdAt: string;
  comparisonsCount: number;
  chaptersDoneCount: number;
}

interface AdminComparisonRow {
  id: number;
  userId: number;
  userEmail: string;
  studentClass: string;
  examNames: string;
  overlapPercent: number;
  commonCount: number;
  totalCount: number;
  createdAt: string;
}

interface AdminFeedbackRow {
  id: number;
  userId: number | null;
  userEmail: string;
  category: string;
  rating: number | null;
  message: string;
  createdAt: string;
}

interface AdminOverviewData {
  totals: {
    usersCount: number;
    comparisonsCount: number;
    completedChaptersCount: number;
    feedbackCount?: number;
  };
  users: AdminUserRow[];
  recentComparisons: AdminComparisonRow[];
  recentFeedback?: AdminFeedbackRow[];
}

interface AdminScreenProps {
  token: string | null;
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatCategory(category: string): string {
  if (category === 'exam_request') return 'Exam Request';
  if (category === 'syllabus_fix') return 'Syllabus Update';
  return 'General Feedback';
}

export function AdminScreen({ token, onBack }: AdminScreenProps) {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    if (!token) {
      setError('Please log in as admin to view this dashboard.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = (await res.json()) as AdminOverviewData & {
        error?: string;
      };
      if (!res.ok) {
        throw new Error(payload.error || 'Could not load admin overview.');
      }
      setData(payload);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Unable to load admin overview.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const feedbackItems = data?.recentFeedback ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-5 pb-14 sm:px-6 sm:pt-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Exam Picker</span>
        </button>

        <button
          type="button"
          onClick={loadOverview}
          disabled={loading}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-blue-600">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            Admin Overview
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            View registered students, saved exam comparisons, progress, and feedback
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-200 sm:text-sm">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800" />
        </div>
      ) : (
        data && (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Registered Accounts</span>
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="mt-2 font-mono text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {data.totals.usersCount}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Saved Comparisons</span>
                  <GitCompare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="mt-2 font-mono text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {data.totals.comparisonsCount}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Chapters Completed</span>
                  <BookCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="mt-2 font-mono text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {data.totals.completedChaptersCount}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Feedback Notes</span>
                  <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="mt-2 font-mono text-3xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {data.totals.feedbackCount ?? feedbackItems.length}
                </div>
              </div>
            </div>

            {/* Registered Students & Accounts */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
                Registered Students
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Only email, name, class, and study counts are stored.
              </p>

              {data.users.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No accounts registered yet.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[540px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <th className="py-2.5 pr-4">Account</th>
                        <th className="py-2.5 pr-4">Class</th>
                        <th className="py-2.5 pr-4 text-right">Comparisons</th>
                        <th className="py-2.5 pr-4 text-right">Chapters Done</th>
                        <th className="py-2.5 text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {data.users.map((u) => (
                        <tr key={u.id}>
                          <td className="py-3 pr-4">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {u.displayName || u.email.split('@')[0]}
                              {u.role === 'admin' && (
                                <span className="ml-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {u.email}
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                            Class {u.studentClass}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                            {u.comparisonsCount}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono text-xs font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">
                            {u.chaptersDoneCount}
                          </td>
                          <td className="py-3 text-right text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(u.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Recent Comparisons Across Students */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
                Recent Exam Comparisons
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Latest saved comparisons across all student accounts
              </p>

              {data.recentComparisons.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No comparisons have been saved yet.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                  {data.recentComparisons.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                          {item.examNames}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span>{item.userEmail}</span>
                          <span aria-hidden="true">·</span>
                          <span>Class {item.studentClass}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                          {item.commonCount}/{item.totalCount} shared
                        </span>
                        <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                          {item.overlapPercent}% overlap
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Student Feedback */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
                Student Feedback
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Exam requests, syllabus updates, and ratings submitted by users
              </p>

              {feedbackItems.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No feedback submitted yet.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                  {feedbackItems.map((fb) => (
                    <div key={fb.id} className="py-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-blue-700 dark:text-blue-400">
                            {formatCategory(fb.category)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{fb.userEmail}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(fb.createdAt)}</span>
                        </div>
                        {fb.rating !== null && (
                          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-amber-600 tabular-nums dark:text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                            {fb.rating}/5
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                        {fb.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )
      )}
    </div>
  );
}
