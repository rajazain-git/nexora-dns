import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Login — Access Your DNS Dashboard',
  description: 'Sign in to your NEXORA DNS account to view active hostnames, renew subscriptions, and manage device setup profiles.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
