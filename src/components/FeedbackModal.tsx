import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageSquare, Star, X } from 'lucide-react';

type FeedbackCategory = 'exam_request' | 'syllabus_fix' | 'general';

interface FeedbackModalProps {
  isOpen: boolean;
  userEmail: string | null;
  token: string | null;
  onClose: () => void;
}

const CATEGORY_OPTIONS: Array<{ value: FeedbackCategory; label: string }> = [
  { value: 'exam_request', label: 'Request an Exam' },
  { value: 'syllabus_fix', label: 'Syllabus Update' },
  { value: 'general', label: 'General Feedback' },
];

export function FeedbackModal({
  isOpen,
  userEmail,
  token,
  onClose,
}: FeedbackModalProps) {
  const [category, setCategory] = useState<FeedbackCategory>('exam_request');
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCategory('exam_request');
      setRating(null);
      setMessage('');
      setSubmitted(false);
      setError(null);
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = message.trim();
    if (!trimmed) {
      setError('Please write your feedback or exam suggestion first.');
      return;
    }

    setSubmitting(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          category,
          rating,
          message: trimmed,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Could not send feedback.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Unable to submit feedback.'
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
      aria-labelledby="feedback-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-t-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="feedback-modal-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg"
              >
                Share Feedback
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Suggest an exam, report a syllabus change, or share ideas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback dialog"
            className="flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center dark:border-emerald-800/60 dark:bg-emerald-950/40">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-slate-100">
              Thank you for your feedback!
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
              Your note has been saved so we can keep improving exam syllabi and
              study tools.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
            {/* Category Selection */}
            <div>
              <p className="mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                What is this about?
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORY_OPTIONS.map((opt) => {
                  const active = category === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      className={`min-h-[40px] rounded-xl border px-2 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/50 dark:text-blue-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Star Rating */}
            <div>
              <p className="mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                How helpful is Preppit? (optional)
              </p>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const selected = rating !== null && star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating((prev) => (prev === star ? null : star))
                      }
                      aria-label={`Rate ${star} out of 5`}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                        selected
                          ? 'border-amber-300 bg-amber-50 text-amber-500 dark:border-amber-700/70 dark:bg-amber-950/50 dark:text-amber-400'
                          : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-amber-400'
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${selected ? 'fill-amber-400' : ''}`}
                      />
                    </button>
                  );
                })}
                {rating !== null && (
                  <span className="ml-2 font-mono text-xs font-semibold text-slate-600 tabular-nums dark:text-slate-400">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Feedback Message */}
            <div>
              <label
                htmlFor="feedback-message"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Your message
              </label>
              <textarea
                id="feedback-message"
                rows={4}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  category === 'exam_request'
                    ? 'Which exam syllabus would you like us to add? (e.g., CLAT, IPMAT, KCET)'
                    : category === 'syllabus_fix'
                      ? 'Mention the exam, subject, and chapter that needs updating...'
                      : 'Tell us what works well or what we should improve...'
                }
                className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
              />
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span>
                  {userEmail
                    ? `Submitting as ${userEmail}`
                    : 'Submitting anonymously'}
                </span>
                <span className="font-mono tabular-nums">
                  {message.length}/1000
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
