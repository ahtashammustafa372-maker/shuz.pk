const fs = require('fs');
const path = require('path');

const collections = [
  { name: 'Basketball', slug: 'basketball' },
  { name: 'Sneakers', slug: 'sneakers' },
  { name: '7a Premium', slug: '7a-premium' },
  { name: 'Slides', slug: 'flip-flops' },
  { name: 'Caps', slug: 'caps' },
  { name: 'Women', slug: 'women' },
  { name: 'New Arrival', slug: 'new-arrival' },
  { name: 'Major Loafers', slug: 'major-loafers' },
  { name: 'On Cloud', slug: 'oncloud' },
  { name: 'Runners', slug: 'runners' },
  { name: 'Air Jordan', slug: 'aj-iv' },
  { name: 'T-Shirts', slug: 't-shirts' },
  { name: 'Flash Sale', slug: '12-12-sale' }
];

async function fetchProducts() {
  console.log('Starting product extraction from Jutay.co...');
  let allProducts = [];
  let productId = 1;
  const existingSlugs = new Set();

  for (const collection of collections) {
    try {
      console.log(`Fetching ${collection.name}...`);
      const res = await fetch(`https://jutay.co/collections/${collection.slug}/products.json?limit=250`);
      if (!res.ok) {
        console.warn(`Failed to fetch ${collection.slug}: ${res.status}`);
        continue;
      }
      
      const data = await res.json();
      if (!data.products || data.products.length === 0) {
        console.log(`No products found for ${collection.slug}`);
        continue;
      }

      for (const prod of data.products) {
        const images = prod.images.map(img => img.src);
        
        let price = 0;
        let compareAtPrice = null;
        if (prod.variants && prod.variants.length > 0) {
          price = parseFloat(prod.variants[0].price);
          if (prod.variants[0].compare_at_price) {
            compareAtPrice = parseFloat(prod.variants[0].compare_at_price);
          }
        }

        allProducts.push({
          id: productId++,
          title: prod.title,
          slug: prod.handle,
          description: prod.body_html ? prod.body_html.replace(/<[^>]+>/g, '').trim().substring(0, 200) + '...' : '',
          price: price,
          compare_at_price: compareAtPrice,
          category_slug: collection.slug,
          images: images.length > 0 ? images : ["/images/sneaker_black.jpg"],
          colors: ["Black", "White"], // Default mockup colors
          sizes: [39, 40, 41, 42, 43, 44, 45],
          stock: 15,
          vendor: prod.vendor,
          featured: true,
          new_arrival: collection.slug === 'new-arrival',
          flash_sale: collection.slug === '12-12-sale',
          created_at: prod.created_at || new Date().toISOString()
        });
      }
      console.log(`Added products for ${collection.name}. Total so far: ${allProducts.length}`);
    } catch (err) {
      console.error(`Error fetching ${collection.slug}:`, err.message);
    }
  }

  // Ensure DB path exists
  const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');
  
  // Read existing settings
  let settings = { slider: [] };
  let existingOrders = [];
  try {
    if (fs.existsSync(dbPath)) {
      const existingDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (existingDb.settings) settings = existingDb.settings;
      if (existingDb.orders) existingOrders = existingDb.orders;
    } else {
      // Fallback slider settings if fresh db.json
      settings = {
        slider: [
          { id: "1", image: "https://jutay.co/cdn/shop/files/new1_1.webp?v=1781527977", subtitle: "", title: "", description: "", linkText: "", link: "/collections/sneakers" },
          { id: "2", image: "https://jutay.co/cdn/shop/files/Shoes_Banner_f01545a0-435e-4dba-b58e-63e09c18ed63.webp?v=1775473103", subtitle: "", title: "", description: "", linkText: "", link: "/collections/mens-shoes" },
          { id: "3", image: "https://jutay.co/cdn/shop/files/1_copy_5_326273d6-1833-449b-8cbd-efeef43d9fa8.webp?v=1744279321", subtitle: "", title: "", description: "", linkText: "", link: "/collections/womens-shoes" }
        ]
      };
    }
  } catch (e) {
    console.error('Error reading existing DB:', e);
  }

  const dbData = {
    products: allProducts,
    collections: collections.map(c => ({ name: c.name, slug: c.slug, image: "/images/sneaker_black.jpg" })),
    orders: existingOrders,
    settings: settings
  };

  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log(`Successfully wrote ${allProducts.length} products to db.json!`);
}

fetchProducts();
