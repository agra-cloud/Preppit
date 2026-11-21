import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  createSessionToken,
  hashPassword,
  requireAdmin,
  requireAuth,
  verifyPassword,
  verifySessionToken,
} from './src/middleware/auth.ts';
import type { AuthRequest } from './src/middleware/auth.ts';
import {
  ADMIN_EMAIL,
  createFeedback,
  createSavedComparison,
  deleteSavedComparison,
  findUserByEmail,
  findUserById,
  getAdminOverview,
  listChapterProgress,
  listSavedComparisons,
  registerEmailUser,
  removeChapterProgress,
  updateUserClassById,
  upsertChapterProgress,
} from './src/db/queries.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface StudyStrategyRequestBody {
  studentClass?: string;
  exams?: Array<{ name: string; shortName: string }>;
  overallOverlapPercent?: number;
  commonTopics?: string[];
  subjectHighlights?: Array<{
    subject: string;
    overlapPercent: number;
    commonCount: number;
    totalUnionTopics: number;
  }>;
  forceRefresh?: boolean;
}

interface StudyStrategyPayload {
  headline: string;
  summary: string;
  prioritySteps: string[];
}

const STRATEGY_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_STRATEGY_CACHE_ENTRIES = 250;
const GEMINI_ATTEMPT_TIMEOUT_MS = 12_000;
const GEMINI_MAX_ATTEMPTS = 3;

const strategyCache = new Map<
  string,
  { data: StudyStrategyPayload; expiresAt: number }
>();
const inFlightStrategyRequests = new Map<
  string,
  Promise<StudyStrategyPayload>
>();

let cachedGeminiClient: GoogleGenAI | null = null;
let cachedGeminiApiKey: string | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from environment variables.');
  }
  if (!cachedGeminiClient || cachedGeminiApiKey !== apiKey) {
    cachedGeminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    cachedGeminiApiKey = apiKey;
  }
  return cachedGeminiClient;
}

function getCachedStrategy(key: string): StudyStrategyPayload | null {
  const entry = strategyCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    strategyCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedStrategy(key: string, data: StudyStrategyPayload): void {
  if (strategyCache.size >= MAX_STRATEGY_CACHE_ENTRIES) {
    const oldestKey = strategyCache.keys().next().value;
    if (oldestKey !== undefined) {
      strategyCache.delete(oldestKey);
    }
  }
  strategyCache.set(key, {
    data,
    expiresAt: Date.now() + STRATEGY_CACHE_TTL_MS,
  });
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseStudyStrategyJson(rawText: string): StudyStrategyPayload {
  let cleaned = rawText.trim();
  if (!cleaned) {
    throw new Error('Empty response from Gemini.');
  }

  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: {
    headline?: unknown;
    summary?: unknown;
    prioritySteps?: unknown;
  };

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx === -1 || endIdx <= startIdx) {
      throw new Error('Response did not contain valid JSON.');
    }
    parsed = JSON.parse(cleaned.slice(startIdx, endIdx + 1));
  }

  const headline =
    typeof parsed.headline === 'string' ? parsed.headline.trim() : '';
  const summary =
    typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
  const prioritySteps = Array.isArray(parsed.prioritySteps)
    ? parsed.prioritySteps
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        .map((s) => s.trim())
        .slice(0, 3)
    : [];

  if (!headline || !summary || prioritySteps.length === 0) {
    throw new Error('Incomplete study strategy JSON fields.');
  }

  return { headline, summary, prioritySteps };
}

function isNonRetryableGeminiError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('API_KEY_INVALID') ||
    msg.includes('PERMISSION_DENIED') ||
    msg.includes('GEMINI_API_KEY is missing') ||
    msg.includes('status: 403')
  );
}

async function generateStudyStrategyWithRetry(
  prompt: string
): Promise<StudyStrategyPayload> {
  const ai = getGeminiClient();
  let lastError: unknown;

  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            systemInstruction:
              'You are a concise academic mentor for Indian students. Provide mobile-friendly study strategy focused on prioritizing overlapping chapters first. Return plain text JSON only: headline (<10 words), summary (1-2 short sentences), and exactly 3 concise actionable prioritySteps (1 short sentence each). No markdown.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                headline: {
                  type: Type.STRING,
                  description: 'Short 5-9 word strategy headline.',
                },
                summary: {
                  type: Type.STRING,
                  description:
                    '1-2 concise sentences explaining how to prioritize shared topics.',
                },
                prioritySteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description:
                    'Exactly 3 short, actionable study prioritization steps.',
                },
              },
              required: ['headline', 'summary', 'prioritySteps'],
            },
          },
        }),
        GEMINI_ATTEMPT_TIMEOUT_MS,
        'Gemini generateContent'
      );

      return parseStudyStrategyJson(response.text ?? '');
    } catch (err: unknown) {
      lastError = err;
      if (isNonRetryableGeminiError(err) || attempt === GEMINI_MAX_ATTEMPTS) {
        break;
      }
      const backoffMs = 350 * Math.pow(2, attempt - 1);
      await sleep(backoffMs);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Failed to generate study strategy.');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // --- Email / Gmail Authentication Endpoints ---

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, displayName, studentClass } = req.body as {
        email?: string;
        password?: string;
        displayName?: string;
        studentClass?: string;
      };

      const cleanEmail = String(email || '').trim().toLowerCase();
      const cleanPassword = String(password || '');

      if (!isValidEmail(cleanEmail)) {
        res.status(400).json({ error: 'Please enter a valid email address.' });
        return;
      }
      if (cleanPassword.length < 6) {
        res
          .status(400)
          .json({ error: 'Password must be at least 6 characters long.' });
        return;
      }

      const validClass = ['10', '11', '12'].includes(String(studentClass))
        ? String(studentClass)
        : '12';

      const passwordHash = hashPassword(cleanPassword);
      const { conflict, user } = await registerEmailUser({
        email: cleanEmail,
        passwordHash,
        displayName,
        studentClass: validClass,
      });

      if (conflict || !user) {
        res.status(409).json({
          error:
            'An account with this email already exists. Please log in instead.',
        });
        return;
      }

      const role = user.email.toLowerCase() === ADMIN_EMAIL ? 'admin' : user.role;
      const token = createSessionToken({
        userId: user.id,
        uid: user.uid,
        email: user.email,
        role,
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role,
          studentClass: user.studentClass,
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to register right now.';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as {
        email?: string;
        password?: string;
      };

      const cleanEmail = String(email || '').trim().toLowerCase();
      const cleanPassword = String(password || '');

      if (!isValidEmail(cleanEmail) || !cleanPassword) {
        res
          .status(400)
          .json({ error: 'Please enter both your email and password.' });
        return;
      }

      const user = await findUserByEmail(cleanEmail);
      if (!user) {
        res.status(401).json({
          error: 'No account found with this email. Please sign up first.',
        });
        return;
      }

      if (!user.passwordHash) {
        res.status(401).json({
          error:
            'Please use the Sign Up tab once with this email to set your password.',
        });
        return;
      }

      if (!verifyPassword(cleanPassword, user.passwordHash)) {
        res.status(401).json({ error: 'Incorrect password. Please try again.' });
        return;
      }

      const role = user.email.toLowerCase() === ADMIN_EMAIL ? 'admin' : user.role;
      const token = createSessionToken({
        userId: user.id,
        uid: user.uid,
        email: user.email,
        role,
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role,
          studentClass: user.studentClass,
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to log in right now.';
      res.status(500).json({ error: message });
    }
  });

  // --- AI Study Strategy Endpoint ---

  app.post('/api/study-strategy', async (req: Request, res: Response) => {
    const body = req.body as StudyStrategyRequestBody;
    const exams = Array.isArray(body?.exams) ? body.exams : [];

    if (exams.length < 2) {
      res.status(400).json({
        error: 'Please select at least two exams to generate a study strategy.',
      });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'Gemini API key is not configured. Please check your key in Settings > Secrets.',
      });
      return;
    }

    const examNames = exams.map((e) => e.name).join(' + ');
    const studentClass = body.studentClass || '12';
    const overlapPercent = body.overallOverlapPercent ?? 0;
    const forceRefresh = body.forceRefresh === true;
    const commonTopics = (body.commonTopics ?? []).slice(0, 10);
    const subjectHighlights = (body.subjectHighlights ?? []).slice(0, 6);

    const normalizedExamsKey = exams
      .map((e) => (e.shortName || e.name || '').trim().toLowerCase())
      .filter(Boolean)
      .sort()
      .join('+');
    const strategyCacheKey = `${studentClass}:${normalizedExamsKey}:${Math.round(overlapPercent)}`;

    if (!forceRefresh) {
      const cached = getCachedStrategy(strategyCacheKey);
      if (cached) {
        res.json(cached);
        return;
      }
    }

    const subjectSummaryText = subjectHighlights
      .map(
        (s) =>
          `${s.subject}: ${s.overlapPercent}% (${s.commonCount}/${s.totalUnionTopics})`
      )
      .join('; ');

    const prompt = [
      `Class ${studentClass} student`,
      `Exams: ${examNames}`,
      `Overlap: ${overlapPercent}%`,
      `Subjects: ${subjectSummaryText || 'N/A'}`,
      `Shared chapters: ${commonTopics.join(', ') || 'None'}`,
      'Advise how to prioritize overlapping chapters first.',
    ].join('\n');

    try {
      let pendingRequest = !forceRefresh
        ? inFlightStrategyRequests.get(strategyCacheKey)
        : undefined;

      if (!pendingRequest) {
        pendingRequest = generateStudyStrategyWithRetry(prompt).then(
          (result) => {
            setCachedStrategy(strategyCacheKey, result);
            return result;
          }
        );

        inFlightStrategyRequests.set(strategyCacheKey, pendingRequest);
        pendingRequest.finally(() => {
          if (inFlightStrategyRequests.get(strategyCacheKey) === pendingRequest) {
            inFlightStrategyRequests.delete(strategyCacheKey);
          }
        });
      }

      const result = await pendingRequest;
      res.json(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to generate study strategy.';
      console.error('Gemini study-strategy error:', message);

      if (
        message.includes('RESOURCE_EXHAUSTED') ||
        message.includes('429')
      ) {
        res.status(429).json({
          error:
            'Study strategy is busy right now due to high demand. Please retry in a few seconds.',
        });
        return;
      }

      if (
        message.includes('API_KEY_INVALID') ||
        message.includes('PERMISSION_DENIED') ||
        message.includes('403')
      ) {
        res.status(502).json({
          error:
            'Gemini API key issue. Please check your key in Settings > Secrets.',
        });
        return;
      }

      res.status(502).json({
        error:
          'Could not generate study advice right now. Please tap Retry.',
      });
    }
  });

  // --- Authenticated Cloud SQL Data Endpoints ---

  app.get('/api/me', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const user = await findUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'Account not found.' });
        return;
      }
      res.json({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.email.toLowerCase() === ADMIN_EMAIL ? 'admin' : user.role,
        studentClass: user.studentClass,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load profile.';
      res.status(500).json({ error: message });
    }
  });

  app.patch(
    '/api/me/class',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const userId = req.user!.userId;
        const studentClass = String(req.body?.studentClass || '');
        if (!['10', '11', '12'].includes(studentClass)) {
          res.status(400).json({ error: 'Invalid class selection.' });
          return;
        }
        const updated = await updateUserClassById(userId, studentClass);
        res.json({ studentClass: updated?.studentClass ?? studentClass });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update class.';
        res.status(500).json({ error: message });
      }
    }
  );

  app.get(
    '/api/comparisons',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const items = await listSavedComparisons(req.user!.userId);
        res.json({ items });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load comparisons.';
        res.status(500).json({ error: message });
      }
    }
  );

  app.post(
    '/api/comparisons',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const {
          studentClass,
          examIds,
          examNames,
          overlapPercent,
          commonCount,
          totalCount,
          strategy,
        } = req.body as {
          studentClass?: string;
          examIds?: string[];
          examNames?: string;
          overlapPercent?: number;
          commonCount?: number;
          totalCount?: number;
          strategy?: unknown;
        };

        if (!Array.isArray(examIds) || examIds.length < 2 || !examNames) {
          res.status(400).json({ error: 'Invalid comparison payload.' });
          return;
        }

        const created = await createSavedComparison({
          userId: req.user!.userId,
          studentClass: studentClass || '12',
          examIdsJson: JSON.stringify(examIds),
          examNames,
          overlapPercent: Number(overlapPercent) || 0,
          commonCount: Number(commonCount) || 0,
          totalCount: Number(totalCount) || 0,
          strategyJson: strategy ? JSON.stringify(strategy) : null,
        });

        res.status(201).json({ item: created });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save comparison.';
        res.status(500).json({ error: message });
      }
    }
  );

  app.delete(
    '/api/comparisons/:id',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
          res.status(400).json({ error: 'Invalid comparison ID.' });
          return;
        }

        await deleteSavedComparison(req.user!.userId, id);
        res.json({ deleted: true });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to delete comparison.';
        res.status(500).json({ error: message });
      }
    }
  );

  app.get(
    '/api/progress',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const items = await listChapterProgress(req.user!.userId);
        res.json({ items });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load progress.';
        res.status(500).json({ error: message });
      }
    }
  );

  app.put(
    '/api/progress',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const { topicId, subjectName, topicTitle, status } = req.body as {
          topicId?: string;
          subjectName?: string;
          topicTitle?: string;
          status?: string;
        };

        if (!topicId || !subjectName || !topicTitle) {
          res.status(400).json({ error: 'Missing chapter progress fields.' });
          return;
        }

        const saved = await upsertChapterProgress({
          userId: req.user!.userId,
          topicId,
          subjectName,
          topicTitle,
          status: status || 'completed',
        });

        res.json({ item: saved });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save progress.';
        res.status(500).json({ error: message });
      }
    }
  );

  app.delete(
    '/api/progress/:topicId',
    requireAuth,
    async (req: AuthRequest, res: Response) => {
      try {
        const topicId = String(req.params.topicId || '');
        if (!topicId) {
          res.status(400).json({ error: 'Missing chapter topic ID.' });
          return;
        }

        await removeChapterProgress(req.user!.userId, topicId);
        res.json({ deleted: true });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to remove progress.';
        res.status(500).json({ error: message });
      }
    }
  );

  // --- Feedback Endpoint ---

  app.post('/api/feedback', async (req: Request, res: Response) => {
    try {
      const { category, rating, message } = req.body as {
        category?: string;
        rating?: number | null;
        message?: string;
      };

      const cleanMessage = String(message || '').trim();
      if (!cleanMessage) {
        res
          .status(400)
          .json({ error: 'Please write a short feedback message.' });
        return;
      }
      if (cleanMessage.length > 1000) {
        res.status(400).json({
          error: 'Feedback message must be 1000 characters or fewer.',
        });
        return;
      }

      const allowedCategories = ['exam_request', 'syllabus_fix', 'general'];
      const cleanCategory = allowedCategories.includes(String(category))
        ? String(category)
        : 'general';

      let cleanRating: number | null = null;
      if (rating !== undefined && rating !== null) {
        const num = Number(rating);
        if (Number.isInteger(num) && num >= 1 && num <= 5) {
          cleanRating = num;
        }
      }

      let userId: number | null = null;
      let userEmail: string | null = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        const session = verifySessionToken(token);
        if (session) {
          const dbUser = await findUserById(session.userId);
          if (dbUser) {
            userId = dbUser.id;
            userEmail = dbUser.email;
          }
        }
      }

      const created = await createFeedback({
        userId,
        userEmail,
        category: cleanCategory,
        rating: cleanRating,
        message: cleanMessage,
      });

      res.status(201).json({ item: created });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Unable to save feedback.';
      res.status(500).json({ error: msg });
    }
  });

  // --- Admin Overview Endpoint ---

  app.get(
    '/api/admin/overview',
    requireAuth,
    requireAdmin,
    async (_req: AuthRequest, res: Response) => {
      try {
        const overview = await getAdminOverview();
        res.json(overview);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load admin overview.';
        res.status(500).json({ error: message });
      }
    }
  );

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true as const },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Preppit server running on http://localhost:${PORT}`);
  });
}

startServer();
