// Writes content/image-prompts.csv: one row per word with the target file path,
// photo-search keywords and a ready-to-paste AI prompt in one consistent style.
import fs from 'node:fs';
import { categories } from '../src/data/content.ts';
import { wordSlug } from '../src/lib/slug.ts';

const STYLE =
  'Warm hand-painted storybook illustration, soft flat colors, gentle light, tropical Mekong Delta palette (greens, teals, golden yellow), clean simple shapes, no text, no watermark, 4:3 landscape';

const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
const rows = [['category', 'lesson', 'word', 'vietnamese', 'save_as', 'photo_search', 'ai_prompt'].join(',')];

for (const c of categories) {
  for (const l of c.lessons) {
    for (const w of l.words) {
      const slug = wordSlug(w.en);
      const search = `${w.en} ${w.vi} An Giang Kien Giang Vietnam`;
      const prompt = `${STYLE}. Subject: ${w.en} (${w.vi}), as seen in ${l.title}, An Giang / Kien Giang, Vietnam. Base the scene faithfully on the attached reference photo.`;
      rows.push([c.id, l.id, w.en, w.vi, `public/images/${l.id}/${slug}.webp`, search, prompt].map(q).join(','));
    }
  }
}
fs.mkdirSync('content', { recursive: true });
fs.writeFileSync('content/image-prompts.csv', rows.join('\n') + '\n');
console.log(`Wrote ${rows.length - 1} rows to content/image-prompts.csv`);
