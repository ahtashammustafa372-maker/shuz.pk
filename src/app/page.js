import dbConnect from '@/src/lib/mongoose';
import Setting from '@/src/models/Setting';
import Product from '@/src/models/Product';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await dbConnect();

  let products = [];
  let slider = [];
  let categoryBoxes = [];
  let homepageSettings = null;

  try {
    const productsDocs = await Product.find({}).lean();
    products = productsDocs.map(p => ({
      ...p,
      _id: p._id ? p._id.toString() : p.id
    }));

    const settingsDocs = await Setting.find({}).lean();
    const settings = {};
    settingsDocs.forEach(doc => {
      settings[doc.type] = doc.data;
    });
    
    slider = settings.slider || [];
    categoryBoxes = settings.categoryBoxes || [];
    homepageSettings = settings.homepage || null;
  } catch (error) {
    console.error('Failed to fetch initial data for home page', error);
  }

  return (
    <HomeClient 
      initialProducts={products}
      initialSlider={slider}
      initialCategoryBoxes={categoryBoxes}
      initialHomepageSettings={homepageSettings}
    />
  );
}

