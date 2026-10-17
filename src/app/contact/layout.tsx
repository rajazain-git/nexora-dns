import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support — 24/7 Free Fire DNS Assistance',
  description: 'Need help with your NEXORA DNS configuration or order? Reach our esports engineering support team via WhatsApp, Telegram, Discord, or direct ticket.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact NEXORA DNS Support',
    description: '24/7 esports engineering support for Free Fire DNS setup, orders, and inquiries.',
    url: 'https://nexora-dns-p943.vercel.app/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
