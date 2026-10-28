import ViToggle from './ViToggle';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Banner artwork: An Giang (mountains, Khmer pagoda, delta) meets Kien Giang (sea, islets, Phu Quoc). */
export default function Hero() {
  return (
    <header className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-art"
        src={`${base}/images/banner.webp`}
        alt="Discover An Giang – The Land of Mountains & Seas"
        width={1600}
        height={528}
        fetchPriority="high"
      />
      <h1 className="sr-only">Khám phá An Giang – Discover An Giang</h1>
      <ViToggle />
      <p className="hero-tag">Khám phá An Giang · Núi rừng &amp; Biển đảo</p>
    </header>
  );
}
