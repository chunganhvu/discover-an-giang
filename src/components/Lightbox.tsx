'use client';

import { useEffect } from 'react';

type Props = {
  src: string;
  title: string;
  ipa: string;
  vi?: string;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeak: () => void;
};

/** Full-screen photo viewer opened by tapping a flashcard picture. */
export default function Lightbox({ src, title, ipa, vi, index, total, onClose, onPrev, onNext, onSpeak }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lightbox-img" src={src} alt={title} onClick={(e) => e.stopPropagation()} />
      <button type="button" className="lb-btn lb-close" aria-label="Close" onClick={onClose}>
        ✕
      </button>
      {index > 0 && (
        <button type="button" className="lb-btn lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
          ‹
        </button>
      )}
      {index < total - 1 && (
        <button type="button" className="lb-btn lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); onNext(); }}>
          ›
        </button>
      )}
      <div className="lightbox-cap" onClick={(e) => e.stopPropagation()}>
        <strong>{title}</strong>
        <span>
          {ipa}
          <button type="button" className="speaker-btn" aria-label="Play pronunciation" onClick={onSpeak}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9z" /><path d="M16 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
          </button>
        </span>
        {vi && <em>{vi}</em>}
      </div>
    </div>
  );
}
