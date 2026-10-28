/** "Father and Son Islet" -> "father-and-son-islet" (used for image/audio file names). */
export function wordSlug(en: string) {
  return en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
