// Generates public/audio/<lesson-id>/<word-slug>.mp3 with Google Cloud Text-to-Speech.
// Usage: GOOGLE_TTS_API_KEY=... node scripts/generate-audio.mjs [--voice en-US-Neural2-F] [--force]
// Free tier covers this project many times over (~80 short words).
import fs from 'node:fs';
import path from 'node:path';
import { categories } from '../src/data/content.ts';
import { wordSlug } from '../src/lib/slug.ts';

const key = process.env.GOOGLE_TTS_API_KEY;
if (!key) {
  console.error('Set GOOGLE_TTS_API_KEY first.');
  process.exit(1);
}
const args = process.argv.slice(2);
const voice = args.includes('--voice') ? args[args.indexOf('--voice') + 1] : 'en-US-Neural2-F';
const force = args.includes('--force');

let made = 0;
for (const c of categories) {
  for (const l of c.lessons) {
    for (const w of l.words) {
      const file = path.join('public', 'audio', l.id, `${wordSlug(w.en)}.mp3`);
      if (!force && fs.existsSync(file)) continue;
      const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: w.say ?? w.en },
          voice: { languageCode: voice.slice(0, 5), name: voice },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.85 },
        }),
      });
      if (!res.ok) {
        console.error(`FAILED ${w.en}: ${res.status} ${await res.text()}`);
        process.exit(1);
      }
      const { audioContent } = await res.json();
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(audioContent, 'base64'));
      made++;
      console.log('✓', file);
    }
  }
}
console.log(`Done, ${made} new files.`);
