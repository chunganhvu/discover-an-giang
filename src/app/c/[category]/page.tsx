import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getCategory } from '@/data/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  return (
    <>
      <header className="page-head" style={{ background: `linear-gradient(165deg, ${category.from}, ${category.to})` }}>
        <Link href="/" className="back" aria-label="Back to home">
          ←
        </Link>
        <span className="page-emoji" aria-hidden="true">
          {category.emoji}
        </span>
        <h1>{category.title}</h1>
        <p>
          {category.vi} · {category.blurb}
        </p>
      </header>
      <main className="list">
        <h2 className="section-title">
          Lessons <small>Bài học</small>
        </h2>
        <ul>
          {category.lessons.map((l, n) => (
            <li key={l.id}>
              <Link href={`/c/${category.id}/${l.id}/`} className="lesson-row">
                <span className="lesson-num" style={{ background: category.to }}>
                  {n + 1}
                </span>
                <span className="lesson-body">
                  <strong>{l.title}</strong>
                  <em>{l.vi}</em>
                  <small>
                    {l.words.length} words · {l.blurb}
                  </small>
                </span>
                <span className="lesson-emoji" aria-hidden="true">
                  {l.emoji}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
