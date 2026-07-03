const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'src', 'lib', 'db.json');

if (!fs.existsSync(dbPath)) {
  console.log('db.json does not exist. Will be created on first load.');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const categoriesToAdd = [
  { slug: 'aj1-high', name: 'AJ 1 High' },
  { slug: 'converse', name: 'Converse All Star' },
  { slug: 'aj-iv', name: 'Air Jordan IV' },
  { slug: 'under-armour', name: 'Under Armour Sport' },
  { slug: 'aj-i-lows', name: 'AJ 1 Low' },
  { slug: 'puma', name: 'Puma Classic' },
  { slug: 'samba', name: 'Adidas Samba' },
  { slug: 'airforce', name: 'Nike Air Force 1' },
  { slug: 'sneakers-lacoste', name: 'Lacoste Sneaker' },
  { slug: 'dunk', name: 'Nike Dunk Low' },
  { slug: 'on-cloud', name: 'On Cloud Runner' },
  { slug: 'new-balance', name: 'New Balance 550' },
  { slug: 'onit-tiger', name: 'Onitsuka Tiger Mexico 66' },
  { slug: 'bad-bunny', name: 'Adidas Bad Bunny' }
];

let maxId = data.products.reduce((max, p) => Math.max(max, p.id), 0);

categoriesToAdd.forEach(cat => {
  // check if product for this category already exists
  if (!data.products.some(p => p.category_slug === cat.slug)) {
    maxId++;
    data.products.push({
      id: maxId,
      title: `${cat.name} - Premium Quality`,
      slug: `${cat.slug}-premium-quality`,
      description: `Premium quality ${cat.name} sneaker. Lightweight and comfortable for daily wear.`,
      price: 15000,
      compare_at_price: 20000,
      category_slug: cat.slug,
      images: ["/images/sneaker_white.jpg"],
      colors: ["White", "Black"],
      sizes: [40, 41, 42, 43, 44],
      stock: 10,
      featured: true,
      new_arrival: true,
      flash_sale: false,
      vendor: "Premium Brands",
      created_at: new Date().toISOString()
    });
  }
});

if (!data.settings.categoryBoxes) {
  data.settings.categoryBoxes = [
    { id: 1, name: "AJ - 1 Highs", link: "/collections/aj1-high", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/AJ_-_I_Highs_copy_19875fa3-e323-4358-a125-953bf68f0e8e.webp?v=1749627856" },
    { id: 2, name: "CONVERSE", link: "/collections/converse", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/5_8.webp?v=1750143824" },
    { id: 3, name: "AJ IV", link: "/collections/aj-iv", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/2_47.webp?v=1749628047" },
    { id: 4, name: "Under Armour", link: "/collections/under-armour", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/Under_Armour_copy_4753fbd2-415f-4b48-b45b-7cba710287d7.webp?v=1749627857" },
    { id: 5, name: "AJ - 1 Lows", link: "/collections/aj-i-lows", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/AJ_-_I_Low_copy_7bbdb01b-dd82-4f9e-8532-e12bb3b79d8f.webp?v=1749627856" },
    { id: 6, name: "Puma", link: "/collections/puma", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/Puma_copy_fd6a6236-9c72-461c-8643-d12e511dc050.webp?v=1749627856" },
    { id: 7, name: "Samba", link: "/collections/samba", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/4_16.webp?v=1750143824" },
    { id: 8, name: "Airforce", link: "/collections/airforce", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/AirForce_copy_ff32dae0-9c3f-43ba-9f05-13e55f66c5fe.webp?v=1749627857" },
    { id: 9, name: "sneaker", link: "/collections/sneakers-lacoste", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/1_51.webp?v=1750139716" },
    { id: 10, name: "Dunk", link: "/collections/dunk", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/1_47.webp?v=1749628047" },
    { id: 11, name: "On Cloud", link: "/collections/on-cloud", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/my_one_copy_1.webp?v=1763730523" },
    { id: 12, name: "New Balance", link: "/collections/new-balance", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/New_Balance_copy_9684db7c-bbac-4d03-9580-3d7a5dd64292.webp?v=1749627856" },
    { id: 13, name: "Onitsuga Tiger", link: "/collections/onit-tiger", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/Onitsuga_copy_9c0a2036-940c-4e0e-a78a-7521289f1ddd.webp?v=1749627857" },
    { id: 14, name: "Bad Bunny", link: "/collections/bad-bunny", image: "https://cdn.shopify.com/s/files/1/0609/8416/4583/files/3_22.webp?v=1749628047" }
  ];
}

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
console.log('Successfully updated db.json with new products and settings.');
