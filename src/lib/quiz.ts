import type { Lesson, Word } from './types';

export type QuestionType = 'image' | 'listen' | 'fill' | 'meaning' | 'vi2en';

export type Question = {
  type: QuestionType;
  word: Word;
  choices: string[];
  answer: string;
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function blankPattern(word: Word) {
  return new RegExp(`${escapeRegExp(word.en)}\\w*`, 'i');
}

export function canFill(word: Word) {
  return blankPattern(word).test(word.example);
}

export function blankSentence(word: Word) {
  return word.example.replace(blankPattern(word), '_____');
}

/** One question per word; types rotate so a lesson mixes seeing, hearing and reading. */
export function buildQuiz(lesson: Lesson, showVi: boolean): Question[] {
  const types: QuestionType[] = showVi
    ? ['image', 'meaning', 'listen', 'fill', 'vi2en']
    : ['image', 'listen', 'fill'];
  const words = shuffle(lesson.words);
  const offset = Math.floor(Math.random() * types.length);

  return words.map((word, i) => {
    let type = types[(i + offset) % types.length];
    if (type === 'fill' && !canFill(word)) type = 'image';

    const others = shuffle(lesson.words.filter((w) => w.en !== word.en)).slice(0, 3);
    const useVi = type === 'meaning';
    const answer = useVi ? word.vi : word.en;
    const choices = shuffle([answer, ...others.map((w) => (useVi ? w.vi : w.en))]);
    return { type, word, choices, answer };
  });
}

export type Tier = 'learner' | 'bronze' | 'silver' | 'gold';

export function tierForScore(score: number, total: number): Tier {
  const pct = total === 0 ? 0 : score / total;
  if (pct >= 0.9) return 'gold';
  if (pct >= 0.7) return 'silver';
  return 'bronze';
}
