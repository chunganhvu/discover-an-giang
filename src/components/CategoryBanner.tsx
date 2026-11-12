import Link from 'next/link';
import type { Category } from '@/lib/types';
import { categoryImage } from '@/data/assets';
import CategoryArt from './CategoryArt';

/** Same artwork as the topic card on the home page, shown large with the title underneath. */
export default function CategoryBanner({
  category,
  backHref,
  title,
  subtitle,
  image,
  actions,
  fullscreen = false,
}: {
  category: Category;
  backHref: string;
  title: string;
  subtitle: string;
  /** Overrides the topic artwork, e.g. with the lesson's own cover photo. */
  image?: string;
  /** Buttons shown on top of the picture (e.g. Learn / Quiz on a lesson page). */
  actions?: { href: string; icon: string; label: string; aria?: string; variant?: 'learn' | 'quiz' }[];
  /** Fill the whole screen (used on lesson pages). */
  fullscreen?: boolean;
}) {
  const hasActions = !!actions && actions.length > 0;
  const src = image ?? categoryImage(category.id);
  return (
    <header className={`cat-banner${fullscreen ? ' full' : ''}`}>
      <div className="cat-banner-art" style={src ? ({ '--bg': `url(${src})` } as React.CSSProperties) : undefined}>
        <CategoryArt id={category.id} image={src} />
        <Link href={backHref} className="back" aria-label="Back">
          ←
        </Link>
      </div>
      <div
        className={`cat-banner-label${hasActions ? ' has-actions' : ''}`}
        style={{ background: `linear-gradient(180deg, ${category.from}, ${category.to})` }}
      >
        <div className="cat-banner-text">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {hasActions && (
          <div className="banner-actions">
            {actions!.map((a) => (
              <Link key={a.href} href={a.href} className={`banner-btn ${a.variant ?? 'learn'}`} aria-label={a.aria ?? a.label}>
                <span className="banner-btn-icon" aria-hidden="true">
                  {a.icon}
                </span>
                <span className="banner-btn-label">{a.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
