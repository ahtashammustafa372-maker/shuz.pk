import "./globals.css";
import LayoutWrapper from '../components/LayoutWrapper';
import { ThemeProvider } from '../context/ThemeContext';

import db from '../lib/db';

export async function generateMetadata() {
  const settings = db.getSettings();
  const seo = settings?.seo || {};

  const keywordsStr = [seo.keywords, seo.tags].filter(Boolean).join(', ');

  return {
    title: seo.title || "Shop Best Sneakers & Premium Shoes - Jutay.co",
    description: seo.description || "Bringing the best global sneaker culture to Pakistan.",
    keywords: keywordsStr || "sneakers, shoes, pakistan",
    openGraph: {
      title: seo.title || "Shop Best Sneakers & Premium Shoes - Jutay.co",
      description: seo.description || "Bringing the best global sneaker culture to Pakistan.",
      images: [seo.ogImage || '/images/logo.png'],
    },
    robots: {
      index: seo.noIndex !== true,
      follow: seo.noFollow !== true,
    },
    ...(seo.canonicalUrl && {
      alternates: {
        canonical: seo.canonicalUrl,
      }
    }),
    icons: {
      icon: "/favicon.ico",
    }
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

