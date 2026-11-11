'use client';

import { useEffect, useRef, useState } from 'react';

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Cross-fading slideshow of a topic's photos in random order.
 * Only the current and next image are loaded, so the home page stays light.
 */
export default function CategorySlideshow({ images, offset = 0 }: { images: string[]; offset?: number }) {
  const [cur, setCur] = useState(images[0]);
  const [prev, setPrev] = useState<string | null>(null);
  const queue = useRef<string[]>([]);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    queue.current = shuffle(images.slice(1));
    let timer: ReturnType<typeof setTimeout>;
    let fade: ReturnType<typeof setTimeout>;
    let shown = images[0];

    const next = () => {
      if (queue.current.length === 0) queue.current = shuffle(images.filter((i) => i !== shown));
      const n = queue.current.shift() as string;
      const pre = new Image();
      pre.onload = pre.onerror = () => {
        setPrev(shown);
        setCur(n);
        shown = n;
        fade = setTimeout(() => setPrev(null), 1000);
        timer = setTimeout(next, 4200);
      };
      pre.src = n;
    };

    timer = setTimeout(next, 3000 + offset);
    return () => {
      clearTimeout(timer);
      clearTimeout(fade);
    };
  }, [images, offset]);

  return (
    <div className="cat-slides" aria-hidden="true">
      {prev && prev !== cur && (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={`p-${prev}`} className="slide-img" src={prev} alt="" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={cur} className={`slide-img${prev ? ' slide-in' : ''}`} src={cur} alt="" decoding="async" />
    </div>
  );
}
