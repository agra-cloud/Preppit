import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { ADMIN_EMAIL, findUserById } from '../db/queries.ts';

export interface SessionPayload {
  userId: number;
  uid: string;
  email: string;
  role: string;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: SessionPayload;
}

function getSigningSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.SQL_PASSWORD ||
    process.env.GEMINI_API_KEY ||
    'preppit-session-signing-key'
  );
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [salt, originalHex] = parts;
  if (!salt || !originalHex) return false;

  const derived = crypto.scryptSync(password, salt, 64);
  const original = Buffer.from(originalHex, 'hex');
  if (derived.length !== original.length) return false;
  return crypto.timingSafeEqual(derived, original);
}

export function createSessionToken(payload: {
  userId: number;
  uid: string;
  email: string;
  role: string;
}): string {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const data = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(data)
    .digest('base64url');
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, providedSig] = parts;
  if (!data || !providedSig) return null;

  const expectedSig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(data)
    .digest('base64url');

  const providedBuf = Buffer.from(providedSig);
  const expectedBuf = Buffer.from(expectedSig);
  if (providedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(data, 'base64url').toString('utf8')
    ) as SessionPayload;
    if (!parsed.userId || !parsed.email || !parsed.exp) return null;
    if (Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Please log in or sign up to continue.' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  const session = verifySessionToken(token);
  if (!session) {
    res.status(401).json({ error: 'Your session expired. Please log in again.' });
    return;
  }

  try {
    const dbUser = await findUserById(session.userId);
    if (!dbUser) {
      res.status(401).json({ error: 'Account not found. Please log in again.' });
      return;
    }

    req.user = {
      userId: dbUser.id,
      uid: dbUser.uid,
      email: dbUser.email,
      role:
        dbUser.email.toLowerCase() === ADMIN_EMAIL ? 'admin' : dbUser.role,
      exp: session.exp,
    };
    next();
  } catch {
    res.status(500).json({ error: 'Could not verify your session right now.' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required.' });
    return;
  }
  next();
};
