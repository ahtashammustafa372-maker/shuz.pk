import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const db = require('../../../lib/db');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const collection = searchParams.get('collection');
    const size = searchParams.get('size');
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort');

    let products = db.getProducts();

    // 1. Text Search Query Filter
    if (q) {
      const query = q.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.vendor.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // 2. Collection Category Filter
    if (collection && collection !== 'all') {
      if (collection === 'new-arrival' || collection === 'new-arrivals') {
        products = products.filter(p => p.new_arrival || p.category_slug === 'new-arrival' || p.category_slug === 'new-arrivals');
      } else if (collection === 'best-sellers') {
        products = products.filter(p => p.featured || p.category_slug === 'best-sellers');
      } else if (collection === 'flash-sale') {
        products = products.filter(p => p.flash_sale || p.category_slug === 'flash-sale');
      } else if (collection === 'men') {
        // Return all products for men as a fallback since gender field doesn't exist
      } else if (collection === 'on-cloud-men' || collection === 'on-cloud' || collection === 'oncloud') {
        // Map to runners or return specific items since we don't have dedicated "On Cloud" items in mock db
        products = products.filter(p => p.category_slug === 'runners');
      } else {
        products = products.filter(p => p.category_slug === collection);
      }
    }

    // 3. Shoe Size Filter
    if (size) {
      const targetSize = parseInt(size);
      products = products.filter(p => p.sizes.includes(targetSize));
    }

    // 4. Brand/Vendor Filter
    if (brand) {
      const targetBrand = brand.toLowerCase();
      products = products.filter(p => p.vendor.toLowerCase() === targetBrand);
    }

    // 5. Sorting
    if (sort) {
      if (sort === 'price-ascending') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-descending') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'date-descending') {
        products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    } else {
      // Default to showing newest products first
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return NextResponse.json(products);
  } catch (err) {
    console.error("API Products GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.title || !body.price || !body.category_slug) {
      return NextResponse.json({ error: 'Missing required fields: title, price, category_slug' }, { status: 400 });
    }

    const defaultImages = ["/images/sneaker_black.jpg"];
    const productData = {
      title: body.title,
      description: body.description || "Premium quality athletic shoe designed for comfort and durability.",
      price: parseFloat(body.price),
      compare_at_price: body.compare_at_price ? parseFloat(body.compare_at_price) : null,
      category_slug: body.category_slug,
      images: body.images && body.images.length > 0 ? body.images : defaultImages,
      colors: body.colors || ["Black"],
      sizes: body.sizes || [40, 41, 42, 43, 44, 45],
      sizeStock: body.sizeStock || {},
      stock: body.stock !== undefined ? parseInt(body.stock) : 10,
      vendor: body.vendor || "Generic",
      featured: !!body.featured,
      new_arrival: true, // Always mark newly added products as new arrivals
      flash_sale: !!body.flash_sale,
      seo: body.seo || { title: '', description: '', keywords: '', ogImage: '' }
    };

    const newProduct = db.createProduct(productData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("API Products POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
