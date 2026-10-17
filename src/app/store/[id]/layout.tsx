import type { Metadata } from 'next';
import { INITIAL_PRODUCTS } from '@/lib/products';

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = INITIAL_PRODUCTS.find((p) => p.id === params.id || p.slug === params.id);
  
  if (!product) {
    return {
      title: 'Package Details | NEXORA DNS',
      description: 'View Free Fire DNS package details, specifications, and instant setup options.',
      alternates: {
        canonical: `/store/${params.id}`,
      },
    };
  }

  return {
    title: `${product.name} — Free Fire DNS`,
    description: product.description,
    alternates: {
      canonical: `/store/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | NEXORA DNS`,
      description: product.shortDescription,
      url: `https://nexora-dns-p943.vercel.app/store/${product.id}`,
    },
  };
}

export default function ProductLayout({
  children,
  params,
}: Props) {
  const product = INITIAL_PRODUCTS.find((p) => p.id === params.id || p.slug === params.id);

  const productJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: product.pricePKR.toString(),
      availability: 'https://schema.org/InStock',
      url: `https://nexora-dns-p943.vercel.app/store/${product.id}`,
    },
  } : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
