'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Category, Lesson } from '@/lib/types';
import { blankSentence, buildQuiz, tierForScore, type Question } from '@/lib/quiz';
import { speak, speakWord, stopSpeaking } from '@/lib/speech';
import { usePrefs } from '@/lib/prefs';
import Illustration from './Illustration';
import BadgeCard from './BadgeCard';
import SpeechNotice from './SpeechNotice';

const MESSAGES = {
  gold: 'Outstanding! You know An Giang very well.',
  silver: 'Well done! A little more practice and you will reach gold.',
  bronze: 'Good start! Review the words and try again.',
} as const;

export default function QuizClient({ category, lesson }: { category: Category; lesson: Lesson }) {
  const { showVi } = usePrefs();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<Question[]>([]);
  const [round, setRound] = useState(0);
  const [silent, setSilent] = useState(false);

  // Built after mount so server HTML and client render never differ (questions are shuffled).
  useEffect(() => {
    setQuestions(buildQuiz(lesson, showVi));
    setI(0);
    setPicked(null);
    setScore(0);
    setMissed([]);
  }, [lesson, showVi, round]);

  useEffect(() => () => stopSpeaking(), []);

  const q = questions?.[i];

  useEffect(() => {
    if (q?.type === 'listen') speakWord(q.word).then((ok) => setSilent(!ok));
  }, [q]);

  if (!questions) return <p className="counter">Loading…</p>;

  const base = `/c/${category.id}/${lesson.id}`;

  if (i >= questions.length) {
    const tier = tierForScore(score, questions.length);
    return (
      <div className="finish">
        <p className="score">
          {score} / {questions.length}
        </p>
        <BadgeCard
          badge={lesson.badge}
          tier={tier}
          message={MESSAGES[tier === 'learner' ? 'bronze' : tier]}
          shareText={`I scored ${score}/${questions.length} in the "${lesson.title}" quiz and earned the "${lesson.badge.title}" badge!`}
        />
        {missed.length > 0 && (
          <section className="review">
            <h3>Words to review · Từ cần ôn</h3>
            <ul>
              {missed.map((m) => (
                <li key={m.word.en}>
                  <button type="button" onClick={() => speakWord(m.word)}>
                    🔊 <strong>{m.word.en}</strong>
                    {showVi && <span> — {m.word.vi}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="actions">
          <button className="btn" type="button" onClick={() => setRound(round + 1)}>
            Try again · Làm lại
          </button>
          <Link className="btn ghost" href={`${base}/learn/`}>
            Study the words · Học từ vựng
          </Link>
          <Link className="btn ghost" href={`/c/${category.id}/`}>
            Back to lessons · Về danh sách bài
          </Link>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const answered = picked !== null;

  const choose = (choice: string) => {
    if (answered) return;
    setPicked(choice);
    const ok = choice === q.answer;
    if (ok) setScore((s) => s + 1);
    else setMissed((m) => [...m, q]);
    speak(q.word.say ?? q.word.en, { audio: q.word.audio }).then((ok) => setSilent(!ok));
  };

  return (
    <div className="quiz">
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={i + 1}>
        <div style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="counter">
        Question {i + 1} / {questions.length}
      </p>

      <SpeechNotice hasRecordedAudio={lesson.words.every((w) => !!w.audio)} failed={silent} />
      <div className="prompt">
        {q.type === 'image' && (
          <>
            <Illustration className="quiz-img" emoji={q.word.emoji} from={category.from} to={category.to} image={q.word.image} label="Picture to guess" />
            <h2>What is this?</h2>
          </>
        )}
        {q.type === 'listen' && (
          <>
            <button type="button" className="listen" onClick={() => speakWord(q.word).then((ok) => setSilent(!ok))} aria-label="Play the word again">
              🔊
            </button>
            <h2>Listen and choose the word</h2>
          </>
        )}
        {q.type === 'fill' && (
          <>
            <h2 className="sentence">“{blankSentence(q.word)}”</h2>
            <p className="sub">Choose the missing word</p>
          </>
        )}
        {q.type === 'meaning' && (
          <>
            <h2>{q.word.en}</h2>
            <p className="ipa">{q.word.ipa}</p>
            <p className="sub">What does it mean? · Nghĩa là gì?</p>
          </>
        )}
        {q.type === 'vi2en' && (
          <>
            <h2>{q.word.vi}</h2>
            <p className="sub">Which English word? · Từ tiếng Anh nào?</p>
          </>
        )}
      </div>

      <div className="choices">
        {q.choices.map((c) => {
          const state = !answered ? '' : c === q.answer ? ' right' : c === picked ? ' wrong' : ' dim';
          return (
            <button key={c} type="button" className={`choice${state}`} onClick={() => choose(c)} disabled={answered}>
              {c}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`feedback ${picked === q.answer ? 'ok' : 'no'}`} role="status">
          {picked === q.answer ? '✅ Correct! · Chính xác!' : `❌ The answer is “${q.answer}”`}
          <button type="button" className="btn" onClick={() => { setPicked(null); setI(i + 1); }}>
            {i === questions.length - 1 ? 'See result · Xem kết quả' : 'Next · Tiếp tục'}
          </button>
        </div>
      )}
    </div>
  );
}
