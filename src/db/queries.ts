import crypto from 'crypto';
import { and, desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import {
  chapterProgress,
  feedback,
  savedComparisons,
  users,
} from './schema.ts';

export const ADMIN_EMAIL = 'superbgamind@gmail.com';

export async function findUserByEmail(email: string) {
  try {
    const normalized = email.trim().toLowerCase();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, normalized))
      .limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error('Database error in findUserByEmail:', error);
    throw new Error('Unable to look up account right now.', { cause: error });
  }
}

export async function findUserById(userId: number) {
  try {
    const result = await db
      .select({
        id: users.id,
        uid: users.uid,
        email: users.email,
        displayName: users.displayName,
        role: users.role,
        studentClass: users.studentClass,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error('Database error in findUserById:', error);
    throw new Error('Unable to load user profile right now.', {
      cause: error,
    });
  }
}

export async function registerEmailUser(input: {
  email: string;
  passwordHash: string;
  displayName?: string;
  studentClass?: string;
}) {
  try {
    const normalizedEmail = input.email.trim().toLowerCase();
    const role = normalizedEmail === ADMIN_EMAIL ? 'admin' : 'student';
    const existing = await findUserByEmail(normalizedEmail);

    if (existing) {
      if (existing.passwordHash) {
        return { conflict: true as const, user: null };
      }
      // Upgrade pre-existing record that had no password set yet
      const updated = await db
        .update(users)
        .set({
          passwordHash: input.passwordHash,
          displayName: input.displayName?.trim() || existing.displayName,
          role,
          studentClass: input.studentClass || existing.studentClass,
        })
        .where(eq(users.id, existing.id))
        .returning({
          id: users.id,
          uid: users.uid,
          email: users.email,
          displayName: users.displayName,
          role: users.role,
          studentClass: users.studentClass,
          createdAt: users.createdAt,
        });
      return { conflict: false as const, user: updated[0] };
    }

    const inserted = await db
      .insert(users)
      .values({
        uid: crypto.randomUUID(),
        email: normalizedEmail,
        passwordHash: input.passwordHash,
        displayName: input.displayName?.trim() || null,
        role,
        studentClass: input.studentClass || '12',
      })
      .returning({
        id: users.id,
        uid: users.uid,
        email: users.email,
        displayName: users.displayName,
        role: users.role,
        studentClass: users.studentClass,
        createdAt: users.createdAt,
      });

    return { conflict: false as const, user: inserted[0] };
  } catch (error) {
    console.error('Database error in registerEmailUser:', error);
    throw new Error('Unable to create account right now.', { cause: error });
  }
}

export async function updateUserClassById(
  userId: number,
  studentClass: string
) {
  try {
    const result = await db
      .update(users)
      .set({ studentClass })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        studentClass: users.studentClass,
      });
    return result[0] ?? null;
  } catch (error) {
    console.error('Database error in updateUserClassById:', error);
    throw new Error('Unable to update your class preference right now.', {
      cause: error,
    });
  }
}

export async function listSavedComparisons(userId: number) {
  try {
    return await db
      .select()
      .from(savedComparisons)
      .where(eq(savedComparisons.userId, userId))
      .orderBy(desc(savedComparisons.createdAt))
      .limit(20);
  } catch (error) {
    console.error('Database error in listSavedComparisons:', error);
    throw new Error('Unable to load saved comparisons right now.', {
      cause: error,
    });
  }
}

export async function createSavedComparison(input: {
  userId: number;
  studentClass: string;
  examIdsJson: string;
  examNames: string;
  overlapPercent: number;
  commonCount: number;
  totalCount: number;
  strategyJson?: string | null;
}) {
  try {
    const result = await db
      .insert(savedComparisons)
      .values({
        userId: input.userId,
        studentClass: input.studentClass,
        examIdsJson: input.examIdsJson,
        examNames: input.examNames,
        overlapPercent: input.overlapPercent,
        commonCount: input.commonCount,
        totalCount: input.totalCount,
        strategyJson: input.strategyJson ?? null,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database error in createSavedComparison:', error);
    throw new Error('Unable to save this comparison right now.', {
      cause: error,
    });
  }
}

export async function deleteSavedComparison(userId: number, id: number) {
  try {
    const result = await db
      .delete(savedComparisons)
      .where(
        and(eq(savedComparisons.id, id), eq(savedComparisons.userId, userId))
      )
      .returning();
    return result[0] ?? null;
  } catch (error) {
    console.error('Database error in deleteSavedComparison:', error);
    throw new Error('Unable to delete saved comparison right now.', {
      cause: error,
    });
  }
}

export async function listChapterProgress(userId: number) {
  try {
    return await db
      .select()
      .from(chapterProgress)
      .where(eq(chapterProgress.userId, userId));
  } catch (error) {
    console.error('Database error in listChapterProgress:', error);
    throw new Error('Unable to load chapter progress right now.', {
      cause: error,
    });
  }
}

export async function upsertChapterProgress(input: {
  userId: number;
  topicId: string;
  subjectName: string;
  topicTitle: string;
  status: string;
}) {
  try {
    const result = await db
      .insert(chapterProgress)
      .values({
        userId: input.userId,
        topicId: input.topicId,
        subjectName: input.subjectName,
        topicTitle: input.topicTitle,
        status: input.status,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [chapterProgress.userId, chapterProgress.topicId],
        set: {
          status: input.status,
          subjectName: input.subjectName,
          topicTitle: input.topicTitle,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database error in upsertChapterProgress:', error);
    throw new Error('Unable to save chapter progress right now.', {
      cause: error,
    });
  }
}

export async function removeChapterProgress(userId: number, topicId: string) {
  try {
    const result = await db
      .delete(chapterProgress)
      .where(
        and(
          eq(chapterProgress.userId, userId),
          eq(chapterProgress.topicId, topicId)
        )
      )
      .returning();
    return result[0] ?? null;
  } catch (error) {
    console.error('Database error in removeChapterProgress:', error);
    throw new Error('Unable to update chapter progress right now.', {
      cause: error,
    });
  }
}

export async function createFeedback(input: {
  userId?: number | null;
  userEmail?: string | null;
  category: string;
  rating?: number | null;
  message: string;
}) {
  try {
    const result = await db
      .insert(feedback)
      .values({
        userId: input.userId ?? null,
        userEmail: input.userEmail ?? null,
        category: input.category,
        rating: input.rating ?? null,
        message: input.message,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database error in createFeedback:', error);
    throw new Error('Unable to submit feedback right now.', { cause: error });
  }
}

export async function getAdminOverview() {
  try {
    const [allUsers, allComparisons, allProgress, allFeedback] =
      await Promise.all([
        db
          .select({
            id: users.id,
            email: users.email,
            displayName: users.displayName,
            role: users.role,
            studentClass: users.studentClass,
            createdAt: users.createdAt,
          })
          .from(users)
          .orderBy(desc(users.createdAt)),
        db
          .select({
            id: savedComparisons.id,
            userId: savedComparisons.userId,
            studentClass: savedComparisons.studentClass,
            examNames: savedComparisons.examNames,
            overlapPercent: savedComparisons.overlapPercent,
            commonCount: savedComparisons.commonCount,
            totalCount: savedComparisons.totalCount,
            createdAt: savedComparisons.createdAt,
          })
          .from(savedComparisons)
          .orderBy(desc(savedComparisons.createdAt))
          .limit(50),
        db
          .select({
            id: chapterProgress.id,
            userId: chapterProgress.userId,
            status: chapterProgress.status,
          })
          .from(chapterProgress),
        db
          .select({
            id: feedback.id,
            userId: feedback.userId,
            userEmail: feedback.userEmail,
            category: feedback.category,
            rating: feedback.rating,
            message: feedback.message,
            createdAt: feedback.createdAt,
          })
          .from(feedback)
          .orderBy(desc(feedback.createdAt))
          .limit(50),
      ]);

    const userEmailMap = new Map<number, string>();
    const comparisonsCountMap = new Map<number, number>();
    const progressCountMap = new Map<number, number>();

    allUsers.forEach((u) => {
      userEmailMap.set(u.id, u.email);
    });

    allComparisons.forEach((c) => {
      comparisonsCountMap.set(
        c.userId,
        (comparisonsCountMap.get(c.userId) ?? 0) + 1
      );
    });

    allProgress.forEach((p) => {
      if (p.status === 'completed') {
        progressCountMap.set(
          p.userId,
          (progressCountMap.get(p.userId) ?? 0) + 1
        );
      }
    });

    return {
      totals: {
        usersCount: allUsers.length,
        comparisonsCount: allComparisons.length,
        completedChaptersCount: allProgress.filter(
          (p) => p.status === 'completed'
        ).length,
        feedbackCount: allFeedback.length,
      },
      users: allUsers.map((u) => ({
        ...u,
        comparisonsCount: comparisonsCountMap.get(u.id) ?? 0,
        chaptersDoneCount: progressCountMap.get(u.id) ?? 0,
      })),
      recentComparisons: allComparisons.map((c) => ({
        ...c,
        userEmail: userEmailMap.get(c.userId) ?? 'Student',
      })),
      recentFeedback: allFeedback.map((f) => ({
        ...f,
        userEmail:
          f.userEmail || (f.userId ? userEmailMap.get(f.userId) : null) || 'Guest',
      })),
    };
  } catch (error) {
    console.error('Database error in getAdminOverview:', error);
    throw new Error('Unable to load admin overview right now.', {
      cause: error,
    });
  }
}
