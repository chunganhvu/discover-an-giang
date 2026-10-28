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
}: {
  category: Category;
  backHref: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="cat-banner">
      <div className="cat-banner-art">
        <CategoryArt id={category.id} image={categoryImage(category.id)} />
        <Link href={backHref} className="back" aria-label="Back">
          ←
        </Link>
      </div>
      <div className="cat-banner-label" style={{ background: `linear-gradient(180deg, ${category.from}, ${category.to})` }}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}
