import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getLesson } from '@/data/content';
import CategoryBanner from '@/components/CategoryBanner';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap((c) => c.lessons.map((l) => ({ category: c.id, lesson: l.id })));
}

export default async function LessonPage({ params }: { params: Promise<{ category: string; lesson: string }> }) {
  const { category: cid, lesson: lid } = await params;
  const found = getLesson(cid, lid);
  if (!found) notFound();
  const { category, lesson } = found;
  const base = `/c/${category.id}/${lesson.id}`;

  return (
    <>
      <CategoryBanner category={category} backHref={`/c/${category.id}/`} title={lesson.title} subtitle={`${lesson.vi} · ${category.title}`} />
      <main className="modes">
        <h2 className="section-title">
          What would you like to do? <small>Bạn muốn làm gì?</small>
        </h2>
        <Link href={`${base}/learn/`} className="mode-card">
          <span className="mode-icon" aria-hidden="true">📖</span>
          <span>
            <strong>Learn vocabulary</strong>
            <em>Học từ vựng · {lesson.words.length} flashcards</em>
          </span>
        </Link>
        <Link href={`${base}/quiz/`} className="mode-card quiz">
          <span className="mode-icon" aria-hidden="true">📝</span>
          <span>
            <strong>Vocabulary quiz</strong>
            <em>Câu đố từ vựng · earn the “{lesson.badge.title}” badge</em>
          </span>
        </Link>
      </main>
    </>
  );
}
