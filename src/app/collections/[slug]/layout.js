import dbConnect from '@/src/lib/mongoose';
import Setting from '@/src/models/Setting';
import Product from '@/src/models/Product';
import Page from '@/src/models/Page';

export async function generateMetadata({ params }) {
  const { slug: collectionSlug } = await params;
  let title = "Collections - Shuz.pk";
  let description = "Browse our amazing collections.";
  let ogImage = "/images/logo.png";
  
  if (collectionSlug !== 'all') {
    await dbConnect();
    const settingsDoc = await Setting.findOne({ type: 'collections' }).lean();
    const collections = settingsDoc ? settingsDoc.data : [];
    const target = collections.find(c => c.slug === collectionSlug);
    if (target) {
      // Collections don't currently have an seo object in DB, but we could add one later.
      // For now, fallback to collection title.
      const seo = target.seo || {};
      title = seo.title || `${target.name} Collection - Shuz.pk`;
      description = seo.description || `Shop our latest ${target.name} shoes online in Pakistan.`;
      ogImage = seo.ogImage || target.image || ogImage;
    }
  } else {
    title = "All Collections - Shuz.pk";
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
