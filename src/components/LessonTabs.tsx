import Link from 'next/link';

export default function LessonTabs({
  category,
  lesson,
  active,
}: {
  category: string;
  lesson: string;
  active: 'learn' | 'quiz';
}) {
  const base = `/c/${category}/${lesson}`;
  return (
    <nav className="tabs" aria-label="Lesson mode">
      <Link href={`${base}/learn/`} className={active === 'learn' ? 'on' : ''}>
        <span aria-hidden="true">📖</span>
        Học từ vựng
        <small>Learn</small>
      </Link>
      <Link href={`${base}/quiz/`} className={active === 'quiz' ? 'on' : ''}>
        <span aria-hidden="true">📝</span>
        Câu đố
        <small>Quiz</small>
      </Link>
    </nav>
  );
}
