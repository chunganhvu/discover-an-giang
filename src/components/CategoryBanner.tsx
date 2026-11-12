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
}: {
  category: Category;
  backHref: string;
  title: string;
  subtitle: string;
  /** Overrides the topic artwork, e.g. with the lesson's own cover photo. */
  image?: string;
  /** Buttons shown on top of the picture (e.g. Learn / Quiz on a lesson page). */
  actions?: { href: string; icon: string; label: string; sub: string; variant?: 'learn' | 'quiz' }[];
}) {
  return (
    <header className="cat-banner">
      <div className="cat-banner-art">
        <CategoryArt id={category.id} image={image ?? categoryImage(category.id)} />
        <Link href={backHref} className="back" aria-label="Back">
          ←
        </Link>
        {actions && actions.length > 0 && (
          <div className="banner-actions">
            {actions.map((a) => (
              <Link key={a.href} href={a.href} className={`banner-btn ${a.variant ?? 'learn'}`}>
                <span className="banner-btn-icon" aria-hidden="true">
                  {a.icon}
                </span>
                <span className="banner-btn-text">
                  <strong>{a.label}</strong>
                  <small>{a.sub}</small>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="cat-banner-label" style={{ background: `linear-gradient(180deg, ${category.from}, ${category.to})` }}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}
