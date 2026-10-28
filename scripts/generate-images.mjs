// Creates one illustration per word with the Gemini image API, based on a real photo when available.
//
// Usage (GEMINI_API_KEY from https://aistudio.google.com/apikey):
//   GEMINI_API_KEY=... node scripts/generate-images.mjs --lesson seven-mountains
//   options: --lesson <id|all>  --word <slug>  --force  --refs auto|none  --model <name>
//
// Reference photo, in order of priority:
//   1. reference/<lesson-id>/<word-slug>.jpg|png|webp   (your own photo; best quality)
//   2. an openly licensed photo found on Wikimedia Commons (only for place/proper-noun words, --refs auto)
//   3. none: the illustration is drawn from the text alone
// Output: public/images/<lesson-id>/<word-slug>.webp, credits in content/image-credits.json.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { categories } from '../src/data/content.ts';
import { wordSlug } from '../src/lib/slug.ts';

const args = process.argv.slice(2);
const opt = (name, def) => (args.includes(name) ? args[args.indexOf(name) + 1] : def);
const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('Set GEMINI_API_KEY first.');
  process.exit(1);
}
const lessonArg = opt('--lesson', 'all');
const wordArg = opt('--word', '');
const force = args.includes('--force');
const refsMode = opt('--refs', 'auto');
const model = opt('--model', 'gemini-2.5-flash-image');

const UA = 'DiscoverAnGiang/1.0 (https://github.com/chunganhvu/discover-an-giang)';
const STYLE =
  'Warm hand-painted storybook illustration, soft flat colors with gentle shading, clean simple shapes, bright tropical Mekong Delta palette (greens, teals, golden yellow), friendly and educational, centered main subject, no text, no letters, no watermark, 4:3 landscape';

const creditsFile = 'content/image-credits.json';
const credits = fs.existsSync(creditsFile) ? JSON.parse(fs.readFileSync(creditsFile, 'utf8')) : [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function localReference(lessonId, slug) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const f = path.join('reference', lessonId, `${slug}.${ext}`);
    if (fs.existsSync(f)) return { buf: fs.readFileSync(f), mime: ext === 'jpg' ? 'image/jpeg' : `image/${ext}`, credit: null };
  }
  return null;
}

// Place names and other proper nouns (a capital letter after the first character) benefit from a real photo.
const wantsPhoto = (en) => /[A-Z]/.test(en.slice(1));

async function commonsReference(word) {
  const q = `${word.en} Vietnam`;
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query', generator: 'search', gsrnamespace: '6', gsrlimit: '8', gsrsearch: q,
      prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata', iiurlwidth: '1024', format: 'json', origin: '*',
    });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const pages = Object.values((await res.json()).query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    const meta = ii?.extmetadata ?? {};
    const license = meta.LicenseShortName?.value ?? '';
    if (!ii || ii.mime !== 'image/jpeg' || ii.width < 800 || !/^(CC BY|CC0|Public domain|PD)/i.test(license)) continue;
    const img = await fetch(ii.thumburl ?? ii.url, { headers: { 'User-Agent': UA } });
    if (!img.ok) continue;
    return {
      buf: Buffer.from(await img.arrayBuffer()),
      mime: 'image/jpeg',
      credit: {
        title: p.title.replace(/^File:/, ''),
        source: ii.descriptionurl,
        author: (meta.Artist?.value ?? 'Unknown').replace(/<[^>]+>/g, '').trim(),
        license,
        licenseUrl: meta.LicenseUrl?.value ?? '',
      },
    };
  }
  return null;
}

async function generate(prompt, ref) {
  const parts = [{ text: prompt }];
  if (ref) parts.push({ inline_data: { mime_type: ref.mime, data: ref.buf.toString('base64') } });
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseModalities: ['IMAGE'] } }),
    });
    if (res.status === 429 || res.status >= 500) {
      await sleep(attempt * 8000);
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const json = await res.json();
    const out = json.candidates?.[0]?.content?.parts?.find((p) => (p.inlineData ?? p.inline_data)?.data);
    if (!out) throw new Error('No image in response: ' + JSON.stringify(json).slice(0, 300));
    return Buffer.from((out.inlineData ?? out.inline_data).data, 'base64');
  }
  throw new Error('Rate limited or server error after 4 attempts');
}

let ok = 0;
let failed = 0;
for (const c of categories) {
  for (const l of c.lessons) {
    if (lessonArg !== 'all' && l.id !== lessonArg) continue;
    for (const w of l.words) {
      const slug = wordSlug(w.en);
      if (wordArg && slug !== wordArg) continue;
      const file = path.join('public', 'images', l.id, `${slug}.webp`);
      if (!force && fs.existsSync(file)) continue;
      try {
        let ref = localReference(l.id, slug);
        if (!ref && refsMode === 'auto' && wantsPhoto(w.en)) ref = await commonsReference(w);
        const subject = `${w.en} (${w.vi}) in ${l.title}, An Giang / Kien Giang, Vietnam`;
        const prompt = ref
          ? `${STYLE}. Redraw the attached real photo as an illustration of: ${subject}. Keep the real place or object recognizable: same main shapes, composition and colors, simplify small details.`
          : `${STYLE}. Subject: ${subject}. Show it clearly and accurately the way it looks in southern Vietnam.`;
        const png = await generate(prompt, ref);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        await sharp(png).resize(800, 600, { fit: 'cover' }).webp({ quality: 82 }).toFile(file);
        if (ref?.credit) {
          const i = credits.findIndex((x) => x.file === file);
          const entry = { file, word: w.en, lesson: l.id, ...ref.credit };
          if (i >= 0) credits[i] = entry;
          else credits.push(entry);
        }
        ok++;
        console.log('✓', file, ref ? (ref.credit ? '(Commons photo)' : '(your photo)') : '(text only)');
      } catch (e) {
        failed++;
        console.error('✗', w.en, String(e.message ?? e).slice(0, 300));
      }
      await sleep(1500);
    }
  }
}
fs.mkdirSync('content', { recursive: true });
fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2) + '\n');
console.log(`Done: ${ok} created, ${failed} failed.`);
if (failed && !ok) process.exit(1);
