import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Fire DNS Store & Packages — Android & iOS',
  description: 'Buy dedicated Free Fire DNS access for Android and iOS devices. Sub-5ms regional Anycast cache hits, TLS 1.3 encrypted DoH/DoT tunnels, and instant PKR checkout via Easypaisa & JazzCash.',
  alternates: {
    canonical: '/store',
  },
  openGraph: {
    title: 'Free Fire DNS Store & Packages | NEXORA DNS',
    description: 'Buy dedicated Free Fire DNS access for Android and iOS with instant local checkout.',
    url: 'https://nexora-dns-p943.vercel.app/store',
  },
};

const productCatalogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'NEXORA DNS Mobile Gaming Packages',
  itemListElement: [
    {
      '@type': 'Product',
      name: 'Android Private DNS Package',
      description: 'Native Android 9+ Private DNS (DoT) configuration optimized for Free Fire and Free Fire MAX mobile players.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        price: '499',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'Product',
      name: 'iOS Signed Profile Package',
      description: 'Apple iOS encrypted DNS over HTTPS (DoH) mobileconfig profile for iPhone and iPad Free Fire gaming.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        price: '499',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'Product',
      name: 'Dual Platform Esports Bundle',
      description: 'Full multi-device package for competitive Free Fire squads covering both Android Private DNS and iOS profiles.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        price: '799',
        availability: 'https://schema.org/InStock',
      },
    },
  ],
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogJsonLd) }}
      />
      {children}
    </>
  );
}
