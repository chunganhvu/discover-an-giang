import Link from 'next/link';
import Hero from '@/components/Hero';
import { categories } from '@/data/content';

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
              <Link
                href={`/c/${c.id}/`}
                className="cat-card"
                style={{ background: `linear-gradient(165deg, ${c.from}, ${c.to})` }}
              >
                <span className="cat-emoji" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="cat-title">{c.title}</span>
                <span className="cat-vi">({c.vi})</span>
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
