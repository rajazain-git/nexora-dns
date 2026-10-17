import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Anycast DNS Routing & Latency Optimization',
  description: 'Understand the network physics behind NEXORA DNS. Learn how BGP Anycast routing, DoT/DoH encryption, and ISP bypass optimize Free Fire matchmaking handshakes.',
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'How NEXORA DNS Works — Latency Architecture',
    description: 'Explore the mechanics of Anycast DNS routing and how it eliminates mobile ISP resolver delays.',
    url: 'https://nexora-dns-p943.vercel.app/how-it-works',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
