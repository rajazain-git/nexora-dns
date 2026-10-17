import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Troubleshooting & Diagnostics — Fix Mobile DNS Errors',
  description: 'Solutions for common mobile DNS connection errors, Private DNS server connection failures on Android, and iOS profile installation issues for Free Fire.',
  alternates: {
    canonical: '/troubleshoot',
  },
  openGraph: {
    title: 'DNS Troubleshooting & Diagnostics | NEXORA DNS',
    description: 'Quick diagnosis and fixes for Private DNS connection issues on Android and iOS devices.',
    url: 'https://nexora-dns-p943.vercel.app/troubleshoot',
  },
};

export default function TroubleshootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
