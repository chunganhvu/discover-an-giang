import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getLesson } from '@/data/content';

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
      <header className="page-head" style={{ background: `linear-gradient(165deg, ${category.from}, ${category.to})` }}>
        <Link href={`/c/${category.id}/`} className="back" aria-label={`Back to ${category.title}`}>
          ←
        </Link>
        <span className="page-emoji" aria-hidden="true">
          {lesson.emoji}
        </span>
        <h1>{lesson.title}</h1>
        <p>{lesson.vi}</p>
      </header>
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
