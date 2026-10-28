'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category, Lesson } from '@/lib/types';
import { speakWord, stopSpeaking } from '@/lib/speech';
import { usePrefs } from '@/lib/prefs';
import Illustration from './Illustration';
import BadgeCard from './BadgeCard';

const SWIPE_PX = 50;

export default function LearnClient({ category, lesson }: { category: Category; lesson: Lesson }) {
  const { showVi } = usePrefs();
  const words = lesson.words;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [done, setDone] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [playing, setPlaying] = useState(false);
  const token = useRef(0);
  const startX = useRef<number | null>(null);

  const go = useCallback(
    (delta: 1 | -1) => {
      token.current++;
      stopSpeaking();
      setPlaying(false);
      if (delta === 1) {
        if (index >= words.length - 1) {
          setDone(true);
          return;
        }
        setDir('next');
        setIndex(index + 1);
      } else if (index > 0) {
        setDir('prev');
        setIndex(index - 1);
      }
    },
    [index, words.length],
  );

  const play = useCallback(async () => {
    const mine = ++token.current;
    setPlaying(true);
    await speakWord(words[index]);
    if (mine !== token.current) return;
    setPlaying(false);
    if (autoNext) {
      await new Promise((r) => setTimeout(r, 450));
      if (mine === token.current) go(1);
    }
  }, [words, index, autoNext, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ' || e.key === 'Enter') {
        if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'A') return;
        e.preventDefault();
        play();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, play, done]);

  useEffect(() => () => stopSpeaking(), []);

  const base = `/c/${category.id}/${lesson.id}`;

  if (done) {
    return (
      <div className="finish">
        <BadgeCard
          badge={lesson.badge}
          tier="learner"
          message={`You learned all ${words.length} words. Great job!`}
          shareText={`I just learned ${words.length} English words about ${lesson.title} and earned the "${lesson.badge.title}" badge!`}
        />
        <div className="actions">
          <Link className="btn" href={`${base}/quiz/`}>
            Take the quiz · Làm câu đố
          </Link>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setDone(false);
              setIndex(0);
              setDir('prev');
            }}
          >
            Review again · Học lại
          </button>
          <Link className="btn ghost" href={`/c/${category.id}/`}>
            Back to lessons · Về danh sách bài
          </Link>
        </div>
      </div>
    );
  }

  const word = words[index];

  return (
    <div className="learn">
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={words.length} aria-valuenow={index + 1}>
        <div style={{ width: `${((index + 1) / words.length) * 100}%` }} />
      </div>
      <p className="counter">
        {index + 1} / {words.length}
      </p>

      <div
        className="card-wrap"
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (dx <= -SWIPE_PX) go(1);
          else if (dx >= SWIPE_PX) go(-1);
          else play();
        }}
        onPointerCancel={() => {
          startX.current = null;
        }}
      >
        <article key={index} className={`flashcard slide-${dir}${playing ? ' speaking' : ''}`} aria-live="polite">
          <Illustration
            className="flash-img"
            emoji={word.emoji}
            from={category.from}
            to={category.to}
            image={word.image}
            label={word.en}
          />
          <div className="flash-text">
            <h2>{word.en}</h2>
            <p className="ipa">
              {word.ipa} <span className="speaker" aria-hidden="true">🔊</span>
            </p>
            {showVi && <p className="vi">({word.vi})</p>}
            <p className="example">“{word.example}”</p>
            {showVi && <p className="example-vi">{word.exampleVi}</p>}
          </div>
        </article>
      </div>
      <p className="hint">Tap the card to hear it · Swipe to continue</p>

      <label className="auto">
        <input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)} />
        Auto-next after audio · Tự động qua từ tiếp
      </label>

      <div className="nav-row">
        <button type="button" className="btn ghost small" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous word">
          ←
        </button>
        <button type="button" className="btn grow" onClick={() => go(1)}>
          {index === words.length - 1 ? 'FINISH (Hoàn thành)' : 'NEXT (Tiếp tục)'}
        </button>
      </div>
    </div>
  );
}
