import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Windows DNS Setup Guide — Free Fire Emulator Network Configuration',
  description: 'Configure NEXORA DNS on Windows 10 and 11 for BlueStacks, LDPlayer, and MSI App Player Free Fire gameplay.',
  alternates: {
    canonical: '/setup-guides/windows',
  },
  openGraph: {
    title: 'Windows DNS Setup Guide | NEXORA DNS',
    description: 'Set up gaming DNS on Windows for Free Fire PC emulators.',
    url: 'https://nexora-dns-p943.vercel.app/setup-guides/windows',
  },
};

export default function WindowsGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
