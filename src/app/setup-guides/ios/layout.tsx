import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'iOS Profile Setup Guide — iPhone & iPad Free Fire DNS Configuration',
  description: 'Download and install custom signed .mobileconfig DNS profiles on Apple iPhone and iPad devices for lag-free Free Fire gaming.',
  alternates: {
    canonical: '/setup-guides/ios',
  },
  openGraph: {
    title: 'iOS Profile Setup Guide | NEXORA DNS',
    description: 'Install encrypted DNS configuration profiles on iOS devices for Free Fire.',
    url: 'https://nexora-dns-p943.vercel.app/setup-guides/ios',
  },
};

export default function IosGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
