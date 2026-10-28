import ViToggle from './ViToggle';

/** Banner blending An Giang (mountains, cajuput forest, delta) and Kien Giang (sea, islands, boats). */
export default function Hero() {
  return (
    <header className="hero">
      <svg className="hero-art" viewBox="0 0 400 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe08a" />
            <stop offset="1" stopColor="#ffb86b" />
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4cc3d9" />
            <stop offset="1" stopColor="#1f8fb5" />
          </linearGradient>
        </defs>
        <rect width="400" height="190" fill="url(#sky)" />
        <circle cx="205" cy="58" r="30" fill="#fff6c9" opacity=".9" />
        <path d="M0 120 L45 62 L82 104 L118 48 L170 120Z" fill="#4c8f4a" />
        <path d="M0 120 L45 62 L62 86 L30 120Z" fill="#3f7d3f" opacity=".55" />
        <path d="M60 120 L118 48 L135 74 L110 120Z" fill="#3f7d3f" opacity=".55" />
        <path d="M150 124 L215 96 L290 124Z" fill="#5fa352" />
        <rect y="118" width="400" height="72" fill="url(#sea)" />
        <path d="M0 140 Q25 132 50 140 T100 140 T150 140 T200 140 T250 140 T300 140 T350 140 T400 140" stroke="#fff" strokeOpacity=".45" strokeWidth="2" fill="none" />
        <path d="M0 160 Q25 152 50 160 T100 160 T150 160 T200 160 T250 160 T300 160 T350 160 T400 160" stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none" />
        <path d="M0 118 Q40 108 90 118 Z" fill="#2f7a3a" />
        <g fill="#2f6b34">
          <rect x="18" y="92" width="3" height="28" />
          <circle cx="19.5" cy="88" r="10" />
          <rect x="40" y="98" width="3" height="22" />
          <circle cx="41.5" cy="95" r="8" />
        </g>
        <g transform="translate(318 100)">
          <path d="M0 22 L5 12 H45 L50 22Z" fill="#fff" />
          <rect x="22" y="0" width="3" height="12" fill="#fff" />
          <path d="M25 2 L44 12 H25Z" fill="#ffd66b" />
        </g>
        <g transform="translate(252 112)" stroke="#5b3a1a" strokeWidth="2" fill="#2f7a3a">
          <path d="M8 40 Q9 18 6 4" fill="none" />
          <path d="M6 4 Q-10 0 -12 10 M6 4 Q22 -2 26 8 M6 4 Q0 -8 -10 -6 M6 4 Q14 -8 22 -4" fill="none" stroke="#2f7a3a" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <ViToggle />
      <div className="hero-text">
        <h1>KHÁM PHÁ AN GIANG</h1>
        <p className="hero-sub">Discover An Giang · Learn English the local way</p>
        <p className="hero-tag">An Giang &amp; Kiên Giang · Núi rừng &amp; Biển đảo</p>
      </div>
    </header>
  );
}
