import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getLesson } from '@/data/content';
import { withAssets } from '@/data/assets';
import LearnClient from '@/components/LearnClient';
import ViToggle from '@/components/ViToggle';
import FullscreenButton from '@/components/FullscreenButton';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap((c) => c.lessons.map((l) => ({ category: c.id, lesson: l.id })));
}

export default async function LearnPage({ params }: { params: Promise<{ category: string; lesson: string }> }) {
  const { category: cid, lesson: lid } = await params;
  const found = getLesson(cid, lid);
  if (!found) notFound();
  const { category, lesson } = found;

  return (
    <div className="lesson-shell learn-shell">
      <header className="lesson-top">
        <Link href={`/c/${category.id}/${lesson.id}/`} className="back dark" aria-label="Back">
          ←
        </Link>
        <Link href="/" className="back dark home-btn" aria-label="Home · Trang chủ" title="Home">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5.5 10v9.5h5v-6h3v6h5V10" />
          </svg>
        </Link>
        <span className="lesson-title">
          {category.title} • {category.vi}
        </span>
        <ViToggle />
        <FullscreenButton />
      </header>
      <main className="lesson-main">
        <LearnClient category={category} lesson={withAssets(lesson)} />
      </main>
    </div>
  );
}
