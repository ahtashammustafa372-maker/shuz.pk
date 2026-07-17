import dbConnect from '@/src/lib/mongoose';
import Setting from '@/src/models/Setting';
import Product from '@/src/models/Product';
import PageModel from '@/src/models/Page';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const page = await PageModel.findOne({ slug }).lean();
  
  if (!page) {
    return {
      title: 'Policy Not Found - Shuz.pk'
    };
  }

  const seo = page.seo || {};
  const title = seo.title || `${page.title} - Shuz.pk`;
  // strip html tags for description fallback
  const contentFallback = page.content ? page.content.replace(/<[^>]+>/g, '').substring(0, 160) : '';
  const description = seo.description || contentFallback;
  const keywordsStr = [seo.keywords || `${page.title}, shuz`, seo.tags].filter(Boolean).join(', ');
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
