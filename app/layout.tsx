import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Kids Zoological Safari',
  description: 'An interactive high-definition animal exploration app for kids featuring crisp HD photos, animal sounds, spoken pronunciations, and sea wildlife.',
  openGraph: {
    title: 'Kids Zoological Safari',
    description: 'An interactive high-definition animal exploration app for kids featuring crisp HD photos, animal sounds, spoken pronunciations, and sea wildlife.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kids Zoological Safari',
    description: 'An interactive high-definition animal exploration app for kids featuring crisp HD photos, animal sounds, spoken pronunciations, and sea wildlife.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="touch-manipulation select-none">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body suppressHydrationWarning className="touch-manipulation select-none overscroll-none">
        {children}
      </body>
    </html>
  );
}
