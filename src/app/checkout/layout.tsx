import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout — NEXORA DNS',
  description: 'Complete your NEXORA DNS package order with instant local Easypaisa, JazzCash, or bank transfer.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/checkout',
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
