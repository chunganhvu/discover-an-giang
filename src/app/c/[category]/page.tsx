import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getCategory } from '@/data/content';
import CategoryBanner from '@/components/CategoryBanner';
import { lessonCover } from '@/data/assets';

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
        <ul className="lesson-grid">
          {category.lessons.map((l, n) => {
            const cover = lessonCover(l);
            return (
              <li key={l.id}>
                <Link href={`/c/${category.id}/${l.id}/`} className="lesson-card">
                  <span className="lesson-thumb" style={{ background: `linear-gradient(160deg, ${category.from}, ${category.to})` }}>
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="lesson-thumb-emoji" aria-hidden="true">
                        {l.emoji}
                      </span>
                    )}
                    <span className="lesson-badge" style={{ background: category.to }}>
                      {n + 1}
                    </span>
                  </span>
                  <span className="lesson-info">
                    <strong>{l.title}</strong>
                    <em>{l.vi}</em>
                    <small>{l.words.length} words</small>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
