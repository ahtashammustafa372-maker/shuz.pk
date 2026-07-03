import db from '../../../lib/db';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = db.getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found - Jutay.co'
    };
  }

  // Use product SEO object or fallback to product details
  const seo = product.seo || {};
  const title = seo.title || `${product.title} - Jutay.co`;
  const description = seo.description || product.description;
  const keywordsStr = [seo.keywords || `${product.category_slug}, ${product.vendor}, sneakers`, seo.tags].filter(Boolean).join(', ');
  const ogImage = seo.ogImage || (product.images && product.images[0]) || '/images/logo.png';

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

export default function ProductLayout({ children }) {
  return children;
}
