import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="home">
      <h2 className="section-title">Page not found</h2>
      <Link className="btn" href="/">
        Back home · Về trang chủ
      </Link>
    </main>
  );
}
