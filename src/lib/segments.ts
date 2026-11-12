import type { Word } from './types';

export type SpeechSegment = { lang: 'vi' | 'en'; text: string };

const strip = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

// Brand names that appear in the Vietnamese gloss unchanged but are read as English.
// Vietnamese names written without accents in the English title (nothing to compare against).
const PLAIN_VIETNAMESE = new Set(['hoa', 'sam', 'sao', 'sim', 'linh', 'hang', 'nam', 'du']);

const ENGLISH_BRANDS = new Set(['vinpearl', 'vinwonders', 'vin', 'wonders', 'safari', 'pearl', 'grand', 'world', 'ocop']);

/**
 * Splits the text spoken for a word into Vietnamese and English parts, so Vietnamese names
 * ("Phu Quoc" → "Phú Quốc") use a Vietnamese voice and the rest ("Island") an English one.
 * A capitalised English token counts as Vietnamese when the Vietnamese meaning contains the
 * same word (ignoring accents); the accented spelling from the meaning is what gets spoken.
 */
export function splitLanguages(word: Pick<Word, 'en' | 'vi' | 'say'>): SpeechSegment[] {
  const text = word.say ?? word.en;
  const viTokens = new Map<string, string>();
  for (const t of word.vi.match(/\p{L}+/gu) ?? []) {
    const k = strip(t);
    if (!viTokens.has(k)) viTokens.set(k, t);
  }
  const words = text.split(/\s+/).filter(Boolean);
  // A token whose accented spelling differs ("Phu" vs "Phú") proves the title names a Vietnamese place or person.
  const accented = (raw: string) => {
    const c = viTokens.get(strip(raw.replace(/[^\p{L}]/gu, '')));
    return !!c && c.toLowerCase() !== raw.replace(/[^\p{L}]/gu, '').toLowerCase();
  };
  const vietnameseName = words.some(accented);
  const out: SpeechSegment[] = [];
  let prevVi = false;
  for (const raw of words) {
    const k = strip(raw.replace(/[^\p{L}]/gu, ''));
    const cand = viTokens.get(k);
    const allowed = accented(raw) || vietnameseName || PLAIN_VIETNAMESE.has(k);
    const isVi: boolean = !!cand && allowed && !ENGLISH_BRANDS.has(k) && (/^\p{Lu}/u.test(raw) || prevVi);
    const piece: SpeechSegment = isVi ? { lang: 'vi', text: cand! } : { lang: 'en', text: raw };
    const last = out[out.length - 1];
    if (last && last.lang === piece.lang) last.text += ' ' + piece.text;
    else out.push(piece);
    prevVi = isVi;
  }
  return out;
}
