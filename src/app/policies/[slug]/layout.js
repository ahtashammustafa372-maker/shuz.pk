import db from '../../../lib/db';

export async function generateMetadata({ params }) {
  const page = db.getPageBySlug(params.slug);
  
  if (!page) {
    return {
      title: 'Policy Not Found - Jutay.co'
    };
  }

  const seo = page.seo || {};
  const title = seo.title || `${page.title} - Jutay.co`;
  // strip html tags for description fallback
  const contentFallback = page.content ? page.content.replace(/<[^>]+>/g, '').substring(0, 160) : '';
  const description = seo.description || contentFallback;
  const keywordsStr = [seo.keywords || `${page.title}, jutay`, seo.tags].filter(Boolean).join(', ');
  const ogImage = seo.ogImage || '/images/logo.png';

  return {
    title,
    description,
    keywords: keywordsStr,
    openGraph: {
      title,
      description,
      images: [ogImage]
    },
    robots: {
      index: seo.noIndex !== true,
      follow: seo.noFollow !== true,
    },
    ...(seo.canonicalUrl && {
      alternates: {
        canonical: seo.canonicalUrl,
      }
    })
  };
}

export default function PolicyLayout({ children }) {
  return children;
}
