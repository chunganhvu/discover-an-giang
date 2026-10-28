import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';

type Credit = { file: string; word: string; title: string; source: string; author: string; license: string; licenseUrl: string };

export const metadata = { title: 'Image credits – Discover An Giang' };

export default function Credits() {
  const file = path.join(process.cwd(), 'content', 'image-credits.json');
  const credits: Credit[] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];

  return (
    <main className="home credits">
      <Link href="/" className="btn ghost" style={{ maxWidth: 220 }}>
        ← Home · Trang chủ
      </Link>
      <h2 className="section-title" style={{ marginTop: 18 }}>
        Image credits <small>Nguồn hình ảnh</small>
      </h2>
      <p>
        Illustrations in this app are created with AI. Where an illustration was based on a real photograph, the original
        photographer and license are listed below. Thank you to everyone who shares their photos.
      </p>
      {credits.length === 0 ? (
        <p>No photo-based illustrations yet.</p>
      ) : (
        <ul>
          {credits.map((c) => (
            <li key={c.file}>
              <strong>{c.word}</strong> – based on{' '}
              <a href={c.source} target="_blank" rel="noopener noreferrer">
                {c.title}
              </a>{' '}
              by {c.author} (
              {c.licenseUrl ? (
                <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">
                  {c.license}
                </a>
              ) : (
                c.license
              )}
              ), via Wikimedia Commons.
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
