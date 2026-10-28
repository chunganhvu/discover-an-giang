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
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" /><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" /></svg>
        Học từ vựng
        <small>Learn</small>
      </Link>
      <Link href={`${base}/quiz/`} className={active === 'quiz' ? 'on' : ''}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h12l4 4v12H4z" /><path d="M8 12h8M8 16h5" /></svg>
        Câu đố
        <small>Quiz</small>
      </Link>
    </nav>
  );
}
