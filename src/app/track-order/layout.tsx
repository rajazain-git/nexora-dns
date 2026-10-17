import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order & Profile Download — Instant DNS Access',
  description: 'Lookup your NEXORA DNS package order status using your Order ID or phone number. Download assigned Android hostnames and signed iOS profiles.',
  alternates: {
    canonical: '/track-order',
  },
  openGraph: {
    title: 'Track Order & Retrieve DNS Profile | NEXORA DNS',
    description: 'Instant lookup and configuration retrieval for NEXORA DNS orders.',
    url: 'https://nexora-dns-p943.vercel.app/track-order',
  },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
