import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getCategory } from '@/data/content';
import CategoryBanner from '@/components/CategoryBanner';

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
      <CategoryBanner category={category} backHref="/" title={category.title} subtitle={`(${category.vi}) · ${category.blurb}`} />
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
