// Generates public/audio/<lesson-id>/<word-slug>.mp3 with Google Cloud Text-to-Speech.
// Usage: GOOGLE_TTS_API_KEY=... node scripts/generate-audio.mjs [--voice en-US-Neural2-F] [--vi-voice vi-VN-Neural2-A] [--force] [--vietnamese]
// Vietnamese names inside a title ("Phu Quoc" in "Phu Quoc Island") are read with the Vietnamese voice,
// the English part with the English voice; the pieces are joined into one mp3.
// --vietnamese regenerates only the words that contain Vietnamese names.
// Free tier covers this project many times over (~80 short words).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { categories } from '../src/data/content.ts';
import { wordSlug } from '../src/lib/slug.ts';
import { splitLanguages } from '../src/lib/segments.ts';

const key = process.env.GOOGLE_TTS_API_KEY;
if (!key) {
  console.error('Set GOOGLE_TTS_API_KEY first.');
  process.exit(1);
}
const args = process.argv.slice(2);
const voice = args.includes('--voice') ? args[args.indexOf('--voice') + 1] : 'en-US-Neural2-F';
const viVoice = args.includes('--vi-voice') ? args[args.indexOf('--vi-voice') + 1] : 'vi-VN-Neural2-A';
const onlyVietnamese = args.includes('--vietnamese');
const force = args.includes('--force') || onlyVietnamese;

async function synth(text, name) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: name.slice(0, 5), name },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.85, sampleRateHertz: 24000 },
    }),
  });
  if (!res.ok) {
    console.error(`FAILED ${text} (${name}): ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  return Buffer.from((await res.json()).audioContent, 'base64');
}

/** Joins mp3 pieces cleanly with ffmpeg (falls back to plain concatenation without it). */
function join(parts, file) {
  if (parts.length === 1) return fs.writeFileSync(file, parts[0]);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tts-'));
  const inputs = parts.map((buf, i) => {
    const f = path.join(dir, `${i}.mp3`);
    fs.writeFileSync(f, buf);
    return f;
  });
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs.flatMap((f) => ['-i', f]),
    '-filter_complex', `concat=n=${inputs.length}:v=0:a=1`, '-ar', '24000', '-ac', '1', '-b:a', '48k', file]);
  fs.rmSync(dir, { recursive: true, force: true });
  if (r.status !== 0) fs.writeFileSync(file, Buffer.concat(parts));
}

let made = 0;
for (const c of categories) {
  for (const l of c.lessons) {
    for (const w of l.words) {
      const file = path.join('public', 'audio', l.id, `${wordSlug(w.en)}.mp3`);
      if (!force && fs.existsSync(file)) continue;
      const segments = splitLanguages(w);
      if (onlyVietnamese && !segments.some((x) => x.lang === 'vi')) continue;
      const parts = [];
      for (const seg of segments) parts.push(await synth(seg.text, seg.lang === 'vi' ? viVoice : voice));
      fs.mkdirSync(path.dirname(file), { recursive: true });
      join(parts, file);
      made++;
      console.log('✓', file);
    }
  }
}
console.log(`Done, ${made} new files.`);
