import type { Metadata } from 'next';
import './globals.css';
import { LoadingProvider } from '@/components/loading-provider';

export const metadata: Metadata = {
  title: 'Propstack',
  description: 'Build Faster, Ship with Confidence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
