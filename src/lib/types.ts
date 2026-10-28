export type Word = {
  en: string;
  ipa: string;
  vi: string;
  /** Placeholder illustration until a real photo is added to `image`. */
  emoji: string;
  example: string;
  exampleVi: string;
  /** Optional text spoken instead of `en` (e.g. to fix local names). */
  say?: string;
  /** Optional photo path under /public, e.g. "/images/sam-mountain.webp". */
  image?: string;
  /** Optional recorded audio path under /public, e.g. "/audio/sam-mountain.mp3". */
  audio?: string;
};

export type Badge = { title: string; vi: string; emoji: string };

export type Lesson = {
  id: string;
  title: string;
  vi: string;
  emoji: string;
  blurb: string;
  badge: Badge;
  words: Word[];
};

export type Category = {
  id: string;
  title: string;
  vi: string;
  emoji: string;
  /** Gradient colors for the card and illustrations. */
  from: string;
  to: string;
  blurb: string;
  lessons: Lesson[];
};
