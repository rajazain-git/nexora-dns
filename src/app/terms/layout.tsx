import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Transparent Usage & Network Policies',
  description: 'Terms of service and fair use agreement for NEXORA DNS hostname resolution services. Zero-cheating policy and customer purchase terms.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | NEXORA DNS',
    description: 'Usage policies and terms for NEXORA mobile DNS services.',
    url: 'https://nexora-dns-p943.vercel.app/terms',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
