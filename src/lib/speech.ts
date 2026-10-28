import type { Word } from './types';

let currentAudio: HTMLAudioElement | null = null;
// Chrome can garbage-collect an utterance before it ends and never fire `onend`; keep a reference.
let currentUtterance: SpeechSynthesisUtterance | null = null;

export type SpeechStatus = 'ok' | 'no-english-voice' | 'unsupported';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

/** Voices load asynchronously on Chrome/Android; wait briefly for them. */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const s = synth();
  if (!s) return Promise.resolve([]);
  const now = s.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => resolve(s.getVoices());
    s.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, 800);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: string) {
  return voices.find((v) => v.lang.replace('_', '-') === lang) ?? voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2))) ?? null;
}

export async function getSpeechStatus(): Promise<SpeechStatus> {
  if (!synth()) return 'unsupported';
  const voices = await loadVoices();
  return voices.some((v) => v.lang.toLowerCase().startsWith('en')) ? 'ok' : 'no-english-voice';
}

export function stopSpeaking() {
  synth()?.cancel();
  currentAudio?.pause();
  currentAudio = null;
}

/**
 * Plays a recorded mp3 when `audio` is given (most reliable), otherwise reads the
 * text with the device voice. Always resolves when playback ends, fails or is unsupported.
 */
export async function speak(
  text: string,
  opts: { lang?: string; rate?: number; audio?: string } = {},
): Promise<void> {
  if (typeof window === 'undefined') return;
  const wasSpeaking = !!synth()?.speaking || !!synth()?.pending;
  stopSpeaking();

  if (opts.audio) {
    const played = await new Promise<boolean>((resolve) => {
      const el = new Audio(opts.audio);
      currentAudio = el;
      el.onended = () => resolve(true);
      el.onerror = () => resolve(false);
      el.play().catch(() => resolve(false));
    });
    if (played) return;
  }

  const s = synth();
  if (!s) {
    await sleep(600);
    return;
  }

  // Calling speak() right after cancel() is silently dropped by some browsers.
  if (wasSpeaking) await sleep(80);
  const voices = await loadVoices();
  const lang = opts.lang ?? 'en-US';

  await new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    currentUtterance = u;
    u.lang = lang;
    u.rate = opts.rate ?? 0.85;
    const voice = pickVoice(voices, lang);
    if (voice) u.voice = voice;
    const guard = setTimeout(resolve, text.length * 160 + 2500);
    const done = () => {
      clearTimeout(guard);
      resolve();
    };
    u.onend = done;
    u.onerror = done;
    s.resume();
    s.speak(u);
  });
}

export function speakWord(word: Word, rate?: number) {
  return speak(word.say ?? word.en, { audio: word.audio, rate });
}
