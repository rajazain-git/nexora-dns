import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Console DNS Setup Guide — PlayStation & Xbox Gaming Configuration',
  description: 'Step-by-step instructions for entering custom DNS primary and secondary IP addresses on PS4, PS5, Xbox One, and Xbox Series X/S.',
  alternates: {
    canonical: '/setup-guides/console',
  },
  openGraph: {
    title: 'Console DNS Setup Guide | NEXORA DNS',
    description: 'Optimize console network settings for low-latency gaming with NEXORA DNS.',
    url: 'https://nexora-dns-p943.vercel.app/setup-guides/console',
  },
};

export default function ConsoleGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
