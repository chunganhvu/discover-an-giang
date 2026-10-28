import Link from 'next/link';
import Hero from '@/components/Hero';
import { categories } from '@/data/content';
import CategoryArt from '@/components/CategoryArt';
import { categoryImage } from '@/data/assets';

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
          A community project to help officials, teachers, students and everyone in An Giang tell our story in English.{' '}
          <Link href="/credits/">Image credits</Link>
        </p>
      </main>
    </>
  );
}
