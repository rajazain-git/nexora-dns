import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — Free Fire Gaming DNS',
  description: 'Answers to frequently asked questions about NEXORA DNS, ping stability, Free Fire bans, payment methods (Easypaisa/JazzCash), and device compatibility.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'NEXORA DNS FAQ — Common Questions Answered',
    description: 'Everything you need to know about Free Fire mobile DNS configuration, ping stability, and anti-cheat safety.',
    url: 'https://nexora-dns-p943.vercel.app/faq',
  },
};

const faqPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can using NEXORA DNS get my Free Fire account banned?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. NEXORA DNS operates strictly at the OS network transport layer using standard Android Private DNS (DoT) and Apple iOS configuration profiles. It does not modify game memory, inject APK files, or alter in-game UDP combat packets.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will NEXORA DNS guarantee 0 ping in Free Fire?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No DNS service can guarantee 0 ping or alter physical fiber-optic latency. NEXORA eliminates recursive ISP DNS lookup stalls, reduces jitter during matchmaking handshakes, and routes queries via regional low-latency edge caches.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods are supported in Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support instant local payments via Easypaisa, JazzCash, Nayapay, Sadapay, and local bank transfers with automated invoice generation.',
      },
    },
  ],
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      {children}
    </>
  );
}
