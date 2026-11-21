import React, { useEffect } from 'react';
import {
  Bookmark,
  ChevronRight,
  Layers,
  LogIn,
  LogOut,
  MessageSquare,
  Moon,
  RotateCcw,
  Shield,
  Sun,
  User,
  X,
} from 'lucide-react';
import type { StudentClass } from '../data/exams';
import type { AuthUser } from '../context/AuthContext';

export type ThemeMode = 'light' | 'dark';

interface MenuDrawerProps {
  isOpen: boolean;
  user: AuthUser | null;
  isAdmin: boolean;
  studentClass: StudentClass;
  savedCount: number;
  hasAnyExam: boolean;
  hasComparison: boolean;
  currentScreen: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onClose: () => void;
  onChangeClass: (cls: StudentClass) => void;
  onOpenSaved: () => void;
  onOpenFeedback: () => void;
  onOpenAdmin: () => void;
  onGoToPicker: () => void;
  onGoToResults: () => void;
  onResetAll: () => void;
  onOpenLogin: () => void;
  onSignOut: () => void;
}

const CLASS_OPTIONS: Array<{ value: StudentClass; label: string }> = [
  { value: '10', label: 'Class 10' },
  { value: '11', label: 'Class 11' },
  { value: '12', label: 'Class 12' },
];

export function MenuDrawer({
  isOpen,
  user,
  isAdmin,
  studentClass,
  savedCount,
  hasAnyExam,
  hasComparison,
  currentScreen,
  theme,
  onToggleTheme,
  onClose,
  onChangeClass,
  onOpenSaved,
  onOpenFeedback,
  onOpenAdmin,
  onGoToPicker,
  onGoToResults,
  onResetAll,
  onOpenLogin,
  onSignOut,
}: MenuDrawerProps) {
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

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs dark:bg-slate-950/75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-drawer-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Right Slide-Over Menu */}
      <aside className="relative z-10 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl sm:max-w-sm sm:border-l sm:border-slate-200 dark:bg-slate-900 dark:sm:border-slate-800">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <span
            id="menu-drawer-title"
            className="font-display text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Profile Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                    {user
                      ? user.displayName || user.email.split('@')[0]
                      : 'Guest Student'}
                  </p>
                  {isAdmin && (
                    <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user
                    ? user.email
                    : 'Log in to save comparisons & track progress'}
                </p>
              </div>
            </div>

            {/* Class Selector in Profile */}
            <div className="mt-3 border-t border-slate-200/80 pt-3 dark:border-slate-700/80">
              <p className="mb-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Your Class
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {CLASS_OPTIONS.map((opt) => {
                  const active = studentClass === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChangeClass(opt.value)}
                      className={`min-h-[36px] rounded-lg px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {!user && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="mt-3 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <LogIn className="h-4 w-4" />
                <span>Log in / Sign up</span>
              </button>
            )}
          </div>

          {/* Global Dark Mode Theme Switch */}
          <div className="mt-3">
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={onToggleTheme}
              className="flex min-h-[54px] w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-amber-400">
                  {isDark ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Dark Mode
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isDark
                      ? 'On · Late-night study mode'
                      : 'Off · Switch for night reading'}
                  </div>
                </div>
              </div>

              <span
                aria-hidden="true"
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  isDark ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Primary Menu Links */}
          <div className="mt-4 space-y-1.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSaved();
              }}
              className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-3">
                <Bookmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Saved Exams</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                {user && (
                  <span className="font-mono font-semibold text-blue-600 tabular-nums dark:text-blue-400">
                    {savedCount}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  currentScreen === 'admin'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Admin Access</span>
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFeedback();
              }}
              className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span>Feedback</span>
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Quick Navigation */}
          <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="px-3.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigation
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToPicker();
              }}
              className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                currentScreen === 'picker'
                  ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>Select Exams</span>
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            {hasComparison && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToResults();
                }}
                className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  currentScreen === 'results' ||
                  currentScreen === 'chapterDetail'
                    ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Syllabus Overlap</span>
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            )}

            {hasAnyExam && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResetAll();
                }}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2 text-left text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset Selected Exams</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Sign Out */}
        {user && (
          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
