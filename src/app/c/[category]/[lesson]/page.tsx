import { notFound } from 'next/navigation';
import { categories, getLesson } from '@/data/content';
import CategoryBanner from '@/components/CategoryBanner';
import { lessonCover } from '@/data/assets';

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
      <CategoryBanner
        category={category}
        backHref={`/c/${category.id}/`}
        title={lesson.title}
        subtitle={`${lesson.vi} · ${category.title}`}
        image={lessonCover(lesson)}
        actions={[
          { href: `${base}/learn/`, icon: '📖', label: 'Learn vocabulary', sub: 'Học từ vựng', variant: 'learn' },
          { href: `${base}/quiz/`, icon: '📝', label: 'Vocabulary quiz', sub: 'Câu đố từ vựng', variant: 'quiz' },
        ]}
      />
    </>
  );
}
