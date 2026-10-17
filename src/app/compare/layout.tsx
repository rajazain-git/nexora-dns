import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DNS vs VPN vs Default ISP — Free Fire Network Comparison',
  description: 'Detailed technical comparison between NEXORA Gaming DNS, commercial VPNs, and default mobile ISPs. Understand how DNS avoids VPN routing penalties and zero-battery drain.',
  alternates: {
    canonical: '/compare',
  },
  openGraph: {
    title: 'DNS vs VPN vs Default ISP | NEXORA DNS',
    description: 'Compare Free Fire latency, ping stability, and battery consumption across DNS, VPNs, and mobile ISPs.',
    url: 'https://nexora-dns-p943.vercel.app/compare',
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
