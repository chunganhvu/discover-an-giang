import type { Metadata, Viewport } from 'next';
import { PrefsProvider } from '@/lib/prefs';
import RegisterSW from '@/components/RegisterSW';
import './globals.css';

export const metadata: Metadata = {
  title: 'Discover An Giang – Learn English',
  description:
    'Learn English vocabulary about An Giang and Kien Giang: landscapes, heritage, cuisine, crafts, festivals, islands and OCOP products.',
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icons/icon-192.png` },
};

export const viewport: Viewport = {
  themeColor: '#0f6b3a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PrefsProvider>
          <div className="app">{children}</div>
        </PrefsProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
