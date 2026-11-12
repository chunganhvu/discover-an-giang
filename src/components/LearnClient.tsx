'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category, Lesson } from '@/lib/types';
import { speakWord, stopSpeaking } from '@/lib/speech';
import { usePrefs } from '@/lib/prefs';
import Illustration from './Illustration';
import SpeechNotice from './SpeechNotice';
import Lightbox from './Lightbox';
import QuizClient from './QuizClient';

const SWIPE_PX = 50;

/**
 * Flashcards: swipe right for the next word, swipe left for the previous one.
 * After the last word the quiz starts on the same page, and the quiz ends with the badge.
 */
export default function LearnClient({ category, lesson }: { category: Category; lesson: Lesson }) {
  const { showVi } = usePrefs();
  const words = lesson.words;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [phase, setPhase] = useState<'learn' | 'quiz'>('learn');
  const [playing, setPlaying] = useState(false);
  const [silent, setSilent] = useState(false);
  const [zoom, setZoom] = useState(false);
  const token = useRef(0);
  const startX = useRef<number | null>(null);

  const go = useCallback(
    (delta: 1 | -1) => {
      token.current++;
      stopSpeaking();
      setPlaying(false);
      if (delta === 1) {
        if (index >= words.length - 1) {
          setZoom(false);
          setPhase('quiz');
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
    const ok = await speakWord(words[index]);
    if (mine !== token.current) return;
    setSilent(!ok);
    setPlaying(false);
  }, [words, index]);

  useEffect(() => {
    if (phase !== 'learn') return;
    const onKey = (e: KeyboardEvent) => {
      if (zoom) return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ' || e.key === 'Enter') {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'BUTTON' || tag === 'A') return;
        e.preventDefault();
        play();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, play, phase, zoom]);

  useEffect(() => () => stopSpeaking(), []);

  if (phase === 'quiz') return <QuizClient category={category} lesson={lesson} embedded />;

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
        // Swipe right = next word, so the "next" peek sits on the left and the "previous" peek on the right.
        className={`card-wrap has-prev${index > 0 ? ' has-next' : ''}`}
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (dx >= SWIPE_PX) go(1);
          else if (dx <= -SWIPE_PX) go(-1);
          else if ((e.target as HTMLElement).closest('[data-zoom]')) {
            setZoom(true);
            play();
          } else play();
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
            zoomable={!!word.image}
          />
          <div className="flash-text">
            <h2>{word.en}</h2>
            <p className="ipa">
              {word.ipa}
              <button type="button" className="speaker-btn" aria-label="Play pronunciation" onPointerUp={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); play(); }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9z" /><path d="M16 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
              </button>
            </p>
            {showVi && <p className="vi">({word.vi})</p>}
            <p className="example">“{word.example}”</p>
            {showVi && <p className="example-vi">{word.exampleVi}</p>}
          </div>
        </article>
      </div>
      {zoom && word.image && (
        <Lightbox
          src={word.image}
          title={word.en}
          ipa={word.ipa}
          vi={showVi ? word.vi : undefined}
          index={index}
          total={words.length}
          onClose={() => setZoom(false)}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          onSpeak={() => play()}
        />
      )}
      <SpeechNotice hasRecordedAudio={words.every((w) => !!w.audio)} failed={silent} />
    </div>
  );
}
