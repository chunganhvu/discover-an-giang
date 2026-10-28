import type { Word } from './types';

let current: HTMLAudioElement | null = null;

function pickVoice(lang: string) {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === lang) ??
    voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) ??
    null
  );
}

export function stopSpeaking() {
  if (typeof window === 'undefined') return;
  window.speechSynthesis?.cancel();
  current?.pause();
  current = null;
}

/**
 * Speaks a string (or plays a recorded mp3 when given). Always resolves when
 * playback ends, fails, or is unsupported, so callers can chain on it.
 */
export function speak(
  text: string,
  opts: { lang?: string; rate?: number; audio?: string } = {},
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  stopSpeaking();

  if (opts.audio) {
    return new Promise((resolve) => {
      const el = new Audio(opts.audio);
      current = el;
      el.onended = () => resolve();
      el.onerror = () => resolve();
      el.play().catch(() => resolve());
    });
  }

  const synth = window.speechSynthesis;
  if (!synth) return new Promise((resolve) => setTimeout(resolve, 600));

  return new Promise((resolve) => {
    const lang = opts.lang ?? 'en-US';
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = opts.rate ?? 0.85;
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    const guard = setTimeout(() => resolve(), text.length * 150 + 2500);
    const done = () => {
      clearTimeout(guard);
      resolve();
    };
    u.onend = done;
    u.onerror = done;
    synth.speak(u);
  });
}

export function speakWord(word: Word, rate?: number) {
  return speak(word.say ?? word.en, { audio: word.audio, rate });
}
