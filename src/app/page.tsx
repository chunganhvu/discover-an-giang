import Link from 'next/link';
import Hero from '@/components/Hero';
import { categories } from '@/data/content';
import CategoryArt from '@/components/CategoryArt';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** public/images/categories/<id>.webp is used when present; otherwise the built-in SVG scene. */
function categoryImage(id: string) {
  return fs.existsSync(path.join(process.cwd(), 'public', 'images', 'categories', `${id}.webp`))
    ? `${base}/images/categories/${id}.webp`
    : undefined;
}

export default function Home() {
  return (
    <>
      <Hero />
      <main className="home">
        <h2 className="section-title">
          Choose a topic <small>Chọn chuyên mục</small>
        </h2>
        <ul className="grid">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/c/${c.id}/`} className="cat-card">
                <CategoryArt id={c.id} image={categoryImage(c.id)} />
                <span className="cat-label" style={{ background: `linear-gradient(180deg, ${c.from}, ${c.to})` }}>
                  <span className="cat-title">{c.title}</span>
                  <span className="cat-vi">({c.vi})</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="foot">
          A community project to help officials, teachers, students and everyone in An Giang tell our story in English.
        </p>
      </main>
    </>
  );
}
