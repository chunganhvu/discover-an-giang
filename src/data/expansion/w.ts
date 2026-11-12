import type { Word } from '@/lib/types';

/** Compact word builder for the expansion lessons. */
export const w = (en: string, ipa: string, vi: string, emoji: string, example: string, exampleVi: string, say?: string): Word =>
  say ? { en, ipa, vi, emoji, example, exampleVi, say } : { en, ipa, vi, emoji, example, exampleVi };
