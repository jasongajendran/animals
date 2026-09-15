import type {Metadata} from 'next';
import './globals.css'; // Global styles

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
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
