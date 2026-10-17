import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Android Private DNS Setup Guide — Free Fire DoT Configuration',
  description: 'Detailed instructions on how to configure NEXORA Private DNS on Android 9, 10, 11, 12, 13, and 14 for low-latency Free Fire gaming.',
  alternates: {
    canonical: '/setup-guides/android',
  },
  openGraph: {
    title: 'Android Private DNS Setup Guide | NEXORA DNS',
    description: 'Configure encrypted Private DNS on Android for optimized Free Fire matchmaking.',
    url: 'https://nexora-dns-p943.vercel.app/setup-guides/android',
  },
};

export default function AndroidGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
