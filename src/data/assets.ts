import fs from 'node:fs';
import path from 'node:path';
import type { Lesson } from '@/lib/types';
import { wordSlug } from '@/lib/slug';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const pub = (...p: string[]) => path.join(process.cwd(), 'public', ...p);

/**
 * Picks up media by convention at build time, no code edits needed:
 *   public/images/<lesson-id>/<word-slug>.webp   (or .jpg / .png)
 *   public/audio/<lesson-id>/<word-slug>.mp3
 * An explicit `image` / `audio` on a word still wins.
 */
export function withAssets(lesson: Lesson): Lesson {
  return {
    ...lesson,
    words: lesson.words.map((w) => {
      const slug = wordSlug(w.en);
      const img = ['webp', 'jpg', 'jpeg', 'png'].find((ext) => fs.existsSync(pub('images', lesson.id, `${slug}.${ext}`)));
      const hasAudio = fs.existsSync(pub('audio', lesson.id, `${slug}.mp3`));
      return {
        ...w,
        image: w.image ? base + w.image : img ? `${base}/images/${lesson.id}/${slug}.${img}` : undefined,
        audio: w.audio ? base + w.audio : hasAudio ? `${base}/audio/${lesson.id}/${slug}.mp3` : undefined,
      };
    }),
  };
}

/** public/images/categories/<id>.webp when present, with basePath applied. */
export function categoryImage(id: string) {
  return fs.existsSync(pub('images', 'categories', `${id}.webp`)) ? `${base}/images/categories/${id}.webp` : undefined;
}
