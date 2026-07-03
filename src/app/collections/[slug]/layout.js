import db from '../../../lib/db';

export async function generateMetadata({ params }) {
  const collectionSlug = params.slug;
  let title = "Collections - Jutay.co";
  let description = "Browse our amazing collections.";
  let ogImage = "/images/logo.png";
  
  if (collectionSlug !== 'all') {
    const collections = db.getCollections();
    const target = collections.find(c => c.slug === collectionSlug);
    if (target) {
      // Collections don't currently have an seo object in DB, but we could add one later.
      // For now, fallback to collection title.
      const seo = target.seo || {};
      title = seo.title || `${target.name} Collection - Jutay.co`;
      description = seo.description || `Shop our latest ${target.name} shoes online in Pakistan.`;
      ogImage = seo.ogImage || target.image || ogImage;
    }
  } else {
    title = "All Collections - Jutay.co";
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage]
    }
  };
}

export default function CollectionLayout({ children }) {
  return children;
}
