'use client';

import { usePrefs } from '@/lib/prefs';

export default function ViToggle() {
  const { showVi, toggleVi } = usePrefs();
  return (
    <button
      type="button"
      className="vi-toggle"
      onClick={toggleVi}
      aria-pressed={showVi}
      title="Show Vietnamese meanings"
    >
      <span aria-hidden="true">🇻🇳</span> {showVi ? 'Tiếng Việt: Bật' : 'Tiếng Việt: Tắt'}
    </button>
  );
}
