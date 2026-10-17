import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Strict Zero-Query Logging Architecture',
  description: 'NEXORA DNS enforces a strict zero-query logging policy. We do not inspect, log, or monetize your DNS lookup telemetry on any gaming Anycast node.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Zero-Log Privacy Policy | NEXORA DNS',
    description: 'Learn about our strict zero-logging commitment for mobile gaming DNS queries.',
    url: 'https://nexora-dns-p943.vercel.app/privacy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
