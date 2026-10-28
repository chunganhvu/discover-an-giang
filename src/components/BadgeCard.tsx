'use client';

import { useEffect, useState } from 'react';
import type { Badge } from '@/lib/types';
import type { Tier } from '@/lib/quiz';
import { usePrefs } from '@/lib/prefs';

const TIER_LABEL: Record<Tier, [string, string]> = {
  learner: ['Lesson complete', 'Hoàn thành bài học'],
  bronze: ['Bronze', 'Đồng'],
  silver: ['Silver', 'Bạc'],
  gold: ['Gold', 'Vàng'],
};

export default function BadgeCard({
  badge,
  tier,
  message,
  shareText,
}: {
  badge: Badge;
  tier: Tier;
  message: string;
  shareText: string;
}) {
  const { showVi } = usePrefs();
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(typeof navigator !== 'undefined' && !!navigator.share), []);

  const [label, labelVi] = TIER_LABEL[tier];

  return (
    <div className={`badge-card tier-${tier}`}>
      <div className="confetti" aria-hidden="true">
        {['🎉', '✨', '🎊', '⭐', '✨', '🎉'].map((c, i) => (
          <span key={i} style={{ left: `${8 + i * 16}%`, animationDelay: `${i * 0.15}s` }}>
            {c}
          </span>
        ))}
      </div>
      <div className="badge-medal" aria-hidden="true">
        {badge.emoji}
      </div>
      <p className="badge-tier">
        {label}
        {showVi && <small> · {labelVi}</small>}
      </p>
      <h2>{badge.title}</h2>
      {showVi && <p className="badge-vi">{badge.vi}</p>}
      <p className="badge-msg">{message}</p>
      {canShare && (
        <button
          type="button"
          className="btn ghost"
          onClick={() => navigator.share({ title: 'Discover An Giang', text: shareText, url: location.origin + location.pathname.replace(/(learn|quiz)\/?$/, '') }).catch(() => {})}
        >
          Share · Chia sẻ
        </button>
      )}
    </div>
  );
}
