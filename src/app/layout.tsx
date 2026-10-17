import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { SITE_METADATA } from '@/lib/config';

import { SiteConfigProvider } from '@/context/SiteConfigContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexora-dns-p943.vercel.app'),
  alternates: {
    canonical: './',
  },
  title: {
    template: '%s | NEXORA DNS',
    default: SITE_METADATA.title,
  },
  description: SITE_METADATA.description,
  keywords: SITE_METADATA.keywords,
  authors: [{ name: 'NEXORA Network Technologies' }],
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexora-dns-p943.vercel.app',
    siteName: 'NEXORA DNS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#080D1A',
  width: 'device-width',
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NEXORA DNS',
  url: 'https://nexora-dns-p943.vercel.app',
  logo: 'https://nexora-dns-p943.vercel.app/images/og-nexora.png',
  description: 'High-performance mobile DNS network configurations optimized for competitive Free Fire players.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English', 'Urdu'],
  },
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NEXORA DNS',
  url: 'https://nexora-dns-p943.vercel.app',
  description: 'Explore dedicated Free Fire DNS configuration packages for compatible Android and iOS devices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#080D1A] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#00E5FF] selection:text-[#080D1A] relative overflow-x-hidden">
        {/* Subtle Ambient Lighting Aura Backdrops */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#00E5FF]/[0.045] rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-1/4 right-10 w-[650px] h-[650px] bg-[#8B5CF6]/[0.045] rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="fixed top-1/2 right-1/3 w-[500px] h-[500px] bg-[#00E5FF]/[0.025] rounded-full blur-[160px] pointer-events-none -z-10" />

        <ToastProvider>
          <AuthProvider>
            <SiteConfigProvider>
              <CartProvider>
                <Navbar />
                <CartDrawer />
                <main className="flex-1 flex flex-col relative z-0">
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </SiteConfigProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
