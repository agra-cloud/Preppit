import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, X } from 'lucide-react';
import { StudentClass } from '../data/exams';
import { AuthUser, useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signup' | 'login';
  reasonMessage?: string | null;
  studentClass: StudentClass;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export function AuthModal({
  isOpen,
  initialMode = 'signup',
  reasonMessage,
  studentClass,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { registerWithEmail, loginWithEmail, clearAuthError } = useAuth();

  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLocalError(null);
      clearAuthError();
    }
  }, [isOpen, initialMode, clearAuthError]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const switchMode = (nextMode: 'signup' | 'login') => {
    setMode(nextMode);
    setLocalError(null);
    clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setLocalError('Please enter a valid email or Gmail address.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      let authenticatedUser: AuthUser | null = null;
      if (mode === 'signup') {
        authenticatedUser = await registerWithEmail({
          email: trimmedEmail,
          password,
          displayName: displayName.trim() || undefined,
          studentClass,
        });
      } else {
        authenticatedUser = await loginWithEmail({
          email: trimmedEmail,
          password,
        });
      }

      if (authenticatedUser) {
        setPassword('');
        onSuccess(authenticatedUser);
      }
    } catch (err: unknown) {
      setLocalError(
        err instanceof Error ? err.message : 'Unable to continue right now.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-[2px] dark:bg-black/70 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-t-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="auth-modal-title"
              className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl"
            >
              {mode === 'signup'
                ? 'Create your Preppit account'
                : 'Log in to Preppit'}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
              {reasonMessage ||
                'Use your email or Gmail to compare exam syllabi and save your study progress.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in dialog"
            className="flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div
          className="mt-4 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-800"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            onClick={() => switchMode('signup')}
            className={`min-h-[40px] rounded-lg px-3 text-xs font-semibold transition-colors sm:text-sm ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            Sign up
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => switchMode('login')}
            className={`min-h-[40px] rounded-lg px-3 text-xs font-semibold transition-colors sm:text-sm ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            Log in
          </button>
        </div>

        {localError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-200">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5" noValidate>
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Your name (optional)
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Aarav Sharma"
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Email or Gmail address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={
                  mode === 'signup' ? 'new-password' : 'current-password'
                }
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pr-11 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-1.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? mode === 'signup'
                ? 'Creating account...'
                : 'Logging in...'
              : mode === 'signup'
                ? 'Sign up & Continue'
                : 'Log in & Continue'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === 'signup'
            ? 'Already have an account?'
            : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
