/** Small flat-style scene per category, used at the top of each topic card. */
const scenes: Record<string, React.ReactNode> = {
  landscapes: (
    <>
      <rect width="160" height="100" fill="#cfeec0" />
      <circle cx="122" cy="26" r="13" fill="#fff3b0" />
      <path d="M0 78 L38 30 L62 62 L90 22 L132 78Z" fill="#5f9b43" />
      <path d="M90 22 L106 46 L92 50 L84 40Z" fill="#fff" opacity=".6" />
      <path d="M0 76 Q50 62 100 78 T160 72 V100 H0Z" fill="#3f8a3a" />
      <g fill="#2a6b2f"><rect x="18" y="62" width="3" height="16" /><circle cx="19.5" cy="58" r="9" /><rect x="136" y="64" width="3" height="14" /><circle cx="137.5" cy="60" r="8" /></g>
    </>
  ),
  heritage: (
    <>
      <rect width="160" height="100" fill="#f6e3c2" />
      <rect y="78" width="160" height="22" fill="#b98550" />
      <g fill="#b9753a"><path d="M52 78 V52 L80 30 L108 52 V78Z" /><path d="M64 52 L80 36 L96 52Z" fill="#8f5527" /><rect x="72" y="58" width="16" height="20" fill="#5c3516" /><path d="M76 30 L80 16 L84 30Z" /></g>
      <g fill="#8f5527"><rect x="30" y="58" width="14" height="20" /><rect x="116" y="58" width="14" height="20" /></g>
    </>
  ),
  cuisine: (
    <>
      <rect width="160" height="100" fill="#ffe2b8" />
      <g stroke="#c9602a" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7"><path d="M62 36 q-6 -8 0 -14 q6 -6 0 -12" /><path d="M82 38 q-6 -8 0 -14 q6 -6 0 -12" /><path d="M102 36 q-6 -8 0 -14 q6 -6 0 -12" /></g>
      <path d="M30 56 H130 A50 40 0 0 1 30 56Z" fill="#fff" stroke="#d9782a" strokeWidth="3" />
      <path d="M44 56 q10 -12 22 0 t22 0 t22 0 t10 0" fill="#f7c35f" />
      <circle cx="70" cy="52" r="6" fill="#ffeab0" /><circle cx="96" cy="53" r="5" fill="#7ec56a" />
      <path d="M96 20 L128 54 M104 18 L134 48" stroke="#7a4a20" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  crafts: (
    <>
      <rect width="160" height="100" fill="#fbd5c6" />
      <rect y="82" width="160" height="18" fill="#c4604a" opacity=".5" />
      <g><rect x="38" y="28" width="26" height="46" rx="4" fill="#3b7cc4" /><rect x="34" y="24" width="34" height="8" rx="3" fill="#e8c27a" /><rect x="34" y="70" width="34" height="8" rx="3" fill="#e8c27a" /><path d="M64 50 Q100 52 112 74" stroke="#3b7cc4" strokeWidth="3" fill="none" /></g>
      <path d="M96 78 q-14 -4 -10 -22 q2 -8 12 -8 h18 q10 0 12 8 q4 18 -10 22Z" fill="#d17a4a" />
      <rect x="94" y="42" width="26" height="6" rx="3" fill="#b86036" />
    </>
  ),
  festivals: (
    <>
      <rect width="160" height="100" fill="#ffd6e2" />
      <path d="M0 14 Q40 34 80 14 T160 14" stroke="#c9526f" strokeWidth="2" fill="none" />
      <g><path d="M20 24 l8 14 h-16Z" fill="#ffd34d" /><path d="M52 30 l8 14 h-16Z" fill="#4cc3d9" /><path d="M100 30 l8 14 h-16Z" fill="#ffd34d" /><path d="M132 24 l8 14 h-16Z" fill="#7ec56a" /></g>
      <g fill="#e04a4a"><ellipse cx="42" cy="68" rx="14" ry="17" /><ellipse cx="80" cy="64" rx="14" ry="17" fill="#ffb02e" /><ellipse cx="118" cy="68" rx="14" ry="17" /></g>
      <g stroke="#a33" strokeWidth="2"><path d="M42 50 v-6 M80 46 v-6 M118 50 v-6" /><path d="M42 85 v10 M80 81 v14 M118 85 v10" /></g>
    </>
  ),
  'seas-islands': (
    <>
      <rect width="160" height="100" fill="#bfe9f5" />
      <circle cx="126" cy="24" r="12" fill="#fff3b0" />
      <rect y="56" width="160" height="44" fill="#3aa0c4" />
      <path d="M0 70 Q20 62 40 70 T80 70 T120 70 T160 70" stroke="#fff" strokeOpacity=".5" strokeWidth="2" fill="none" />
      <path d="M36 58 Q60 40 84 58Z" fill="#e8c27a" />
      <path d="M62 52 Q60 34 64 24" stroke="#6b4423" strokeWidth="3" fill="none" /><path d="M64 24 q-14 -4 -16 6 M64 24 q14 -6 18 4 M64 24 q-6 -10 -16 -8" stroke="#2f7a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g transform="translate(104 60)"><path d="M0 14 L4 6 H34 L38 14Z" fill="#fff" /><path d="M18 -8 V6 M18 -6 L32 6 H18Z" stroke="#fff" fill="#ffd66b" /></g>
    </>
  ),
  ocop: (
    <>
      <rect width="160" height="100" fill="#f7e8b0" />
      <path d="M62 14 L80 46 L98 14Z" fill="#2f6fb5" />
      <circle cx="80" cy="56" r="26" fill="#f2b81c" stroke="#c18a00" strokeWidth="4" />
      <path d="M80 40 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1Z" fill="#fff6c9" />
      <g fill="#d9a441"><rect x="16" y="64" width="22" height="22" rx="5" /><rect x="20" y="58" width="14" height="8" rx="2" fill="#a56a1f" /></g>
      <g fill="#fff" stroke="#8b4a2a" strokeWidth="2"><path d="M128 86 v-24 q0 -6 6 -6 q6 0 6 6 v24Z" /></g>
    </>
  ),
  wildlife: (
    <>
      <rect width="160" height="100" fill="#c9f0e2" />
      <rect y="70" width="160" height="30" fill="#4bb89c" />
      <g stroke="#237d68" strokeWidth="3" strokeLinecap="round"><path d="M18 80 V52 M28 80 V46 M138 80 V54 M148 80 V48" /></g>
      <g fill="#fff"><ellipse cx="84" cy="54" rx="22" ry="12" /><path d="M100 50 Q118 28 108 12 L112 10 Q128 30 108 54Z" /><circle cx="110" cy="12" r="5" /></g>
      <path d="M113 11 L128 14 L114 16Z" fill="#f2a53a" />
      <g stroke="#f2a53a" strokeWidth="3"><path d="M78 66 v14 M90 66 v14" /></g>
    </>
  ),
  spiritual: (
    <>
      <rect width="160" height="100" fill="#e6dbf5" />
      <circle cx="124" cy="24" r="14" fill="#fff6d8" />
      <rect y="84" width="160" height="16" fill="#8d6bb8" opacity=".5" />
      <g fill="#8d4fa3"><path d="M50 84 V66 H110 V84Z" /><path d="M42 66 H118 L80 52Z" fill="#6a4a96" /><path d="M54 52 H106 L80 38Z" /><path d="M62 38 H98 L80 24Z" fill="#6a4a96" /><rect x="76" y="14" width="8" height="12" /></g>
      <rect x="72" y="70" width="16" height="14" fill="#ffd66b" />
    </>
  ),
};

export default function CategoryArt({ id, image }: { id: string; image?: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="cat-art" src={image} alt="" loading="lazy" decoding="async" />;
  }
  return (
    <svg className="cat-art" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {scenes[id]}
    </svg>
  );
}
