import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getLesson } from '@/data/content';
import QuizClient from '@/components/QuizClient';
import LessonTabs from '@/components/LessonTabs';
import ViToggle from '@/components/ViToggle';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap((c) => c.lessons.map((l) => ({ category: c.id, lesson: l.id })));
}

export default async function QuizPage({ params }: { params: Promise<{ category: string; lesson: string }> }) {
  const { category: cid, lesson: lid } = await params;
  const found = getLesson(cid, lid);
  if (!found) notFound();
  const { category, lesson } = found;

  return (
    <div className="lesson-shell">
      <header className="lesson-top">
        <Link href={`/c/${category.id}/${lesson.id}/`} className="back dark" aria-label="Back">
          ←
        </Link>
        <span className="lesson-title">
          {category.title} • {category.vi}
        </span>
        <ViToggle />
      </header>
      <main className="lesson-main">
        <QuizClient category={category} lesson={lesson} />
      </main>
      <LessonTabs category={category.id} lesson={lesson.id} active="quiz" />
    </div>
  );
}
