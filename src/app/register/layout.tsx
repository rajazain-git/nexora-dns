import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Account — NEXORA Gaming DNS',
  description: 'Create a NEXORA account to secure Free Fire mobile DNS subscriptions, view setup credentials, and track latency metrics.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/register',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
