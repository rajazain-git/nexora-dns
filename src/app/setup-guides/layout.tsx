import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Setup Guides — Configure Android Private DNS & iOS Profiles',
  description: 'Step-by-step setup tutorials for configuring NEXORA Private DNS (DoT) on Android 9+ and installing signed DNS-over-HTTPS configuration profiles on iOS devices.',
  alternates: {
    canonical: '/setup-guides',
  },
  openGraph: {
    title: 'NEXORA DNS Setup Guides — Android & iOS',
    description: 'Easy step-by-step configuration guides for Android Private DNS and Apple iOS mobile profiles.',
    url: 'https://nexora-dns-p943.vercel.app/setup-guides',
  },
};

const setupFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I set up NEXORA Private DNS on Android?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to Settings > Network & Internet (or Connections) > More Connection Settings > Private DNS. Select Private DNS provider hostname, enter your assigned NEXORA hostname, and tap Save.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I install the NEXORA DNS profile on iPhone or iPad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Download the custom .mobileconfig profile from your order screen. Open iPhone Settings > Profile Downloaded > Install, enter your device passcode, and confirm installation.',
      },
    },
  ],
};

export default function SetupGuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(setupFaqJsonLd) }}
      />
      {children}
    </>
  );
}
