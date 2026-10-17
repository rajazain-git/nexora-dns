import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Network Route Benchmark & DNS Ping Tool',
  description: 'Test your carrier DNS latency, handshake stability, and lookup speed against NEXORA Anycast gaming nodes across Pakistan and South Asia.',
  alternates: {
    canonical: '/ping-test',
  },
  openGraph: {
    title: 'NEXORA DNS Route Benchmarker & Ping Test',
    description: 'Measure real-time DNS resolution times across local network providers.',
    url: 'https://nexora-dns-p943.vercel.app/ping-test',
  },
};

export default function PingTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
