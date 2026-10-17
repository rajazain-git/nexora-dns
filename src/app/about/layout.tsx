import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Gaming DNS Infrastructure & Mission',
  description: 'Learn about NEXORA DNS mission, BGP Anycast routing architecture, and competitive Free Fire network optimization with transparent, zero-bullshit engineering.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About NEXORA DNS — Mobile Gaming Infrastructure',
    description: 'Learn about NEXORA DNS mission, BGP Anycast routing, and competitive Free Fire network optimization.',
    url: 'https://nexora-dns-p943.vercel.app/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
