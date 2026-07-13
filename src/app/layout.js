import "./globals.css";
import LayoutWrapper from '../components/LayoutWrapper';
import { ThemeProvider } from '../context/ThemeContext';

import dbConnect from '@/src/lib/mongoose';
import Setting from '@/src/models/Setting';
import Product from '@/src/models/Product';
import Page from '@/src/models/Page';

export async function generateMetadata() {
  await dbConnect();
  const settingsDoc = await Setting.findOne({ type: 'seo' }).lean();
  const settings = { seo: settingsDoc ? settingsDoc.data : {} };
  const seo = settings?.seo || {};

  const keywordsStr = [seo.keywords, seo.tags].filter(Boolean).join(', ');

  return {
    title: seo.title || "Shop Best Sneakers & Premium Shoes - Shuz.pk",
    description: seo.description || "Bringing the best global sneaker culture to Pakistan.",
    keywords: keywordsStr || "sneakers, shoes, pakistan",
    openGraph: {
      title: seo.title || "Shop Best Sneakers & Premium Shoes - Shuz.pk",
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

