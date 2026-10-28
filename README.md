# Discover An Giang · Khám phá An Giang

A free, offline-capable **PWA** that teaches English vocabulary through the places, food and culture of **An Giang (merged with Kiên Giang)**. Built for officials, teachers, students and everyone in the community.

- 9 topics: Landscapes, Heritage, Cuisine, Crafts, Festivals, Seas & Islands, OCOP Products, Nature & Wildlife, Spiritual Sites
- Each lesson has **Learn** (tap-to-hear flashcards with IPA, Vietnamese meaning, example sentence; swipe or press Next) and **Quiz** (picture, listening, fill-in-the-blank, meaning questions)
- Finishing a lesson shows a local **badge** (e.g. *Thất Sơn Ambassador*, *Tra Su Forest Ranger*). Nothing is saved – badges are just for fun
- Vietnamese meanings can be switched on/off
- No backend, no login; installable on phones and works offline after the first visit

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Add or edit content

Everything is in [`src/data/content.ts`](src/data/content.ts): categories → lessons → words. Copy an existing word/lesson object and edit it. Each word has `en`, `ipa`, `vi`, `example`, `exampleVi`, and a placeholder `emoji`.

- **Real photos:** put a WebP in `public/images/` and set `image: '/images/xxx.webp'` on the word. Prefer real photos with credit (e.g. Wikimedia Commons / community contributions) for landmarks.
- **Recorded audio:** put an mp3 in `public/audio/` and set `audio: '/audio/xxx.mp3'`. Without it the device's text-to-speech reads the word (`say` can override the spoken text).
- Quiz questions are generated automatically from each lesson's words.

## Deploy

The site is a static export (`output: 'export'`), so any static host works (Cloudflare Pages, Netlify, Vercel, AZDIGI, GitHub Pages). For a sub-path such as GitHub Pages, build with `NEXT_PUBLIC_BASE_PATH=/discover-an-giang`. A ready workflow is in `.github/workflows/pages.yml`.

## Content review needed

Vocabulary, facts and Vietnamese translations were drafted by AI and should be reviewed by local experts (history, place names, dishes, crafts) before public release.
