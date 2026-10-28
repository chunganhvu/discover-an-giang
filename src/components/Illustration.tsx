type Props = {
  emoji: string;
  from: string;
  to: string;
  image?: string;
  label?: string;
  className?: string;
};

/**
 * Placeholder illustration: a soft gradient scene with a large emoji.
 * When a real photo path is provided via `image`, it is shown instead.
 */
export default function Illustration({ emoji, from, to, image, label, className = '' }: Props) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`illus ${className}`} src={image} alt={label ?? ''} loading="lazy" />;
  }
  return (
    <div
      className={`illus ${className}`}
      role="img"
      aria-label={label ?? emoji}
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      <svg className="illus-bg" viewBox="0 0 200 150" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="160" cy="30" r="18" fill="#fff" opacity=".28" />
        <path d="M0 110 Q40 80 80 105 T160 100 T200 110 V150 H0Z" fill="#fff" opacity=".18" />
        <path d="M0 128 Q50 108 100 126 T200 122 V150 H0Z" fill="#fff" opacity=".22" />
      </svg>
      <span className="illus-emoji">{emoji}</span>
    </div>
  );
}
