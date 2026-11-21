import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Users table stores only email, hashed password, display name, role, and academic class.
// Sensitive PII such as phone numbers or physical addresses are intentionally excluded.
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    uid: text('uid').notNull().unique(),
    email: text('email').notNull(),
    passwordHash: text('password_hash'),
    displayName: text('display_name'),
    role: text('role').notNull().default('student'),
    studentClass: text('student_class').notNull().default('12'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('users_email_idx').on(table.email)]
);

// Saved exam syllabus comparisons per student
export const savedComparisons = pgTable('saved_comparisons', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  studentClass: text('student_class').notNull(),
  examIdsJson: text('exam_ids_json').notNull(),
  examNames: text('exam_names').notNull(),
  overlapPercent: integer('overlap_percent').notNull(),
  commonCount: integer('common_count').notNull(),
  totalCount: integer('total_count').notNull(),
  strategyJson: text('strategy_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chapter study progress per student (tracks completed/in-progress chapters)
export const chapterProgress = pgTable(
  'chapter_progress',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    topicId: text('topic_id').notNull(),
    subjectName: text('subject_name').notNull(),
    topicTitle: text('topic_title').notNull(),
    status: text('status').notNull().default('completed'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('chapter_progress_user_topic_idx').on(
      table.userId,
      table.topicId
    ),
  ]
);

// Student & visitor feedback (exam requests, syllabus corrections, general notes)
export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  userEmail: text('user_email'),
  category: text('category').notNull().default('general'),
  rating: integer('rating'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  savedComparisons: many(savedComparisons),
  chapterProgress: many(chapterProgress),
  feedback: many(feedback),
}));

export const savedComparisonsRelations = relations(
  savedComparisons,
  ({ one }) => ({
    user: one(users, {
      fields: [savedComparisons.userId],
      references: [users.id],
    }),
  })
);

export const chapterProgressRelations = relations(
  chapterProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [chapterProgress.userId],
      references: [users.id],
    }),
  })
);

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(users, {
    fields: [feedback.userId],
    references: [users.id],
  }),
}));
