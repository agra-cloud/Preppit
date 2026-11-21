import {
  ComparisonSummary,
  ExamData,
  StudentClass,
  SubjectComparison,
  getTopicDifficulty,
} from '../data/exams';

export function formatComparisonShareText(
  summary: ComparisonSummary,
  studentClass: StudentClass
): string {
  const examNames = summary.exams.map((e) => e.shortName).join(' + ');
  const lines: string[] = [
    `Preppit Syllabus Overlap: ${examNames} (Class ${studentClass})`,
    `Overall Overlap: ${summary.overallOverlapPercent}% (${summary.commonTopicsCount} shared out of ${summary.totalUnionTopics} chapters)`,
    `Verdict: ${summary.verdictTitle}`,
    '',
    'Subject-by-Subject Breakdown:',
  ];

  summary.subjectComparisons.forEach((sub) => {
    const extraParts = summary.exams
      .map((ex) => {
        const count = sub.uniqueCountsByExam[ex.id] ?? 0;
        return count > 0 ? `${count} only in ${ex.shortName}` : null;
      })
      .filter(Boolean);

    const details = [
      `${sub.commonCount} shared`,
      sub.partialCount > 0 ? `${sub.partialCount} in 2 exams` : null,
      ...extraParts,
    ]
      .filter(Boolean)
      .join(', ');

    lines.push(`- ${sub.subject}: ${sub.overlapPercent}% (${details})`);
  });

  // List extra (unique) topics per exam so students see exactly what extra chapters to study
  summary.exams.forEach((exam) => {
    const extraBySubject: string[] = [];
    summary.subjectComparisons.forEach((sub) => {
      const uniqueTopics = sub.items.filter(
        (item) =>
          item.status === 'unique' && item.uniqueToExamId === exam.id
      );
      if (uniqueTopics.length > 0) {
        extraBySubject.push(
          `  * ${sub.subject}: ${uniqueTopics.map((u) => u.topic.title).join(', ')}`
        );
      }
    });

    if (extraBySubject.length > 0) {
      lines.push('');
      lines.push(`Extra Topics Only in ${exam.shortName}:`);
      lines.push(...extraBySubject);
    }
  });

  // List shared chapters across all compared exams
  const sharedBySubject: string[] = [];
  summary.subjectComparisons.forEach((sub) => {
    const commonTopics = sub.items.filter((item) => item.status === 'common');
    if (commonTopics.length > 0) {
      sharedBySubject.push(
        `  * ${sub.subject}: ${commonTopics.map((c) => c.topic.title).join(', ')}`
      );
    }
  });

  if (sharedBySubject.length > 0) {
    lines.push('');
    lines.push(`Shared Chapters (${summary.commonTopicsCount}):`);
    lines.push(...sharedBySubject);
  }

  return lines.join('\n');
}

export function formatSubjectShareText(
  subject: SubjectComparison,
  exams: ExamData[],
  completedTopicIds?: Set<string>
): string {
  const examNames = exams.map((e) => e.shortName).join(' + ');
  const lines: string[] = [
    `${subject.subject} Syllabus Comparison (${examNames})`,
    `Overlap: ${subject.overlapPercent}% (${subject.commonCount} shared / ${subject.totalUnionTopics} chapters)`,
    '',
  ];

  const getShortName = (id?: string) =>
    exams.find((e) => e.id === id)?.shortName ?? 'Exam';

  subject.items.forEach((item) => {
    const doneMark = completedTopicIds?.has(item.topic.id) ? '[x]' : '[ ]';
    const diff = getTopicDifficulty(item.topic);
    const statusLabel =
      item.status === 'common'
        ? 'Shared in all'
        : item.status === 'partial'
          ? `In ${item.presentInExamIds.map((id) => getShortName(id)).join(' + ')}`
          : `Only in ${getShortName(item.uniqueToExamId)}`;

    lines.push(
      `${doneMark} ${item.topic.title} (${diff}) — ${statusLabel}`
    );
  });

  return lines.join('\n');
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand fallback
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export async function shareSyllabusText(params: {
  title: string;
  text: string;
}): Promise<'shared' | 'copied' | 'cancelled' | 'failed'> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: params.title,
        text: params.text,
      });
      return 'shared';
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'cancelled';
      }
      // Fall back to clipboard copy if Web Share is blocked in iframe/desktop
    }
  }

  const copied = await copyTextToClipboard(params.text);
  return copied ? 'copied' : 'failed';
}
