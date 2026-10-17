import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy — 24-Hour Network Resolution Guarantee',
  description: 'Understand the NEXORA DNS 24-hour refund policy. We guarantee resolution performance on all verified compatible Android and iOS devices.',
  alternates: {
    canonical: '/refund-policy',
  },
  openGraph: {
    title: 'Refund Policy | NEXORA DNS',
    description: 'Our 24-hour network resolution guarantee and refund guidelines.',
    url: 'https://nexora-dns-p943.vercel.app/refund-policy',
  },
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
