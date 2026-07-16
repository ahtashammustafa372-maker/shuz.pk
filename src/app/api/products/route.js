import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Product from '../../../models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const collection = searchParams.get('collection');
    const size = searchParams.get('size');
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort');
    const status = searchParams.get('status');

    let query = {};

    if (status) {
      if (status !== 'all') {
        query.status = status;
      }
    } else {
      query.status = { $nin: ['draft', 'trash'] }; // Default for client views
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { vendor: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (collection && collection !== 'all') {
      if (collection === 'new-arrival' || collection === 'new-arrivals') {
        query.$or = [{ new_arrival: true }, { category_slug: 'new-arrival' }, { category_slug: 'new-arrivals' }];
      } else if (collection === 'best-sellers') {
        query.$or = [{ featured: true }, { category_slug: 'best-sellers' }];
      } else if (collection === 'flash-sale') {
        query.$or = [{ flash_sale: true }, { category_slug: 'flash-sale' }];
      } else if (collection === 'men') {
        // Return all
      } else if (collection === 'on-cloud-men' || collection === 'on-cloud' || collection === 'oncloud') {
        query.category_slug = 'runners';
      } else {
        query.category_slug = collection;
      }
    }

    if (size) {
      query.sizes = parseInt(size);
    }

    if (brand) {
      query.vendor = { $regex: `^${brand}$`, $options: 'i' };
    }

    let sortObj = { created_at: -1 };
    if (sort === 'price-ascending') sortObj = { price: 1 };
    else if (sort === 'price-descending') sortObj = { price: -1 };
    else if (sort === 'date-descending') sortObj = { created_at: -1 };

    const products = await Product.find(query).sort(sortObj).lean();
    return NextResponse.json(products);
  } catch (err) {
    console.error("API Products GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.title || !body.price || !body.category_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const defaultImages = ["/images/sneaker_black.jpg"];
    
    // Auto-generate a unique slug if duplicate
    let slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let existing = await Product.findOne({ slug }).lean();
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProduct = new Product({
      ...body,
      slug,
      images: body.images && body.images.length > 0 ? body.images : defaultImages,
      new_arrival: true
    });

    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("API Products POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { ids } = body;
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Missing or invalid ids array' }, { status: 400 });
    }

    const products = await Product.find({ _id: { $in: ids } });
    const toSoftDelete = products.filter(p => p.status !== 'trash').map(p => p._id);
    const toHardDelete = products.filter(p => p.status === 'trash').map(p => p._id);

    if (toSoftDelete.length > 0) {
      await Product.updateMany({ _id: { $in: toSoftDelete } }, { status: 'trash' });
    }
    if (toHardDelete.length > 0) {
      await Product.deleteMany({ _id: { $in: toHardDelete } });
    }
    
    return NextResponse.json({ message: 'Products processed successfully' }, { status: 200 });
  } catch (err) {
    console.error("API Products DELETE Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export { POST as PUT };
