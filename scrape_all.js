const cheerio = require('cheerio');
const fs = require('fs');

const slugsToScrape = [
  'aj1-high', 'converse', 'aj-iv', 'under-armour', 'aj-i-lows', 
  'puma', 'samba', 'airforce', 'sneakers-lacoste', 'dunk', 
  'on-cloud', 'new-balance', 'onit-tiger', 'bad-bunny'
];

async function scrapeCategory(slug) {
  try {
    const res = await fetch(`https://jutay.co/collections/${slug}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let products = [];
    
    $('.m-product-card').each((i, el) => {
      const title = $(el).find('.m-product-card__title a').text().trim() || $(el).find('h3 a').text().trim() || $(el).find('h3').text().trim();
      
      let image = '';
      const imgEl = $(el).find('img').first();
      if (imgEl.length) {
         image = imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('srcset');
         if (image && image.includes(',')) {
            image = image.split(',')[0].split(' ')[0];
         }
         if (image && image.startsWith('//')) {
            image = 'https:' + image;
         }
      }

      let priceText = $(el).find('.m-price-item--regular').text().trim() || $(el).find('.m-price-item--sale').text().trim();
      let price = 15000;
      if (priceText) {
        let numStr = priceText.replace(/[^0-9]/g, '');
        if (numStr) price = parseInt(numStr);
      }

      if (title && image) {
        products.push({
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: `Premium replica of ${title}. Perfect for casual wear.`,
          price: price,
          compare_at_price: price + 4000,
          category_slug: slug,
          images: [image],
          colors: ["Standard"],
          sizes: [40, 41, 42, 43, 44],
          stock: 10,
          featured: true,
          new_arrival: true,
          flash_sale: false,
          vendor: slug.toUpperCase(),
          created_at: new Date().toISOString()
        });
      }
    });

    return products;
  } catch (err) {
    console.error(`Error scraping ${slug}:`, err);
    return [];
  }
}

async function scrapeAll() {
  const dbPath = 'src/lib/db.json';
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // Remove existing dummy products for these slugs
  dbData.products = dbData.products.filter(p => !slugsToScrape.includes(p.category_slug));
  let maxId = dbData.products.reduce((max, p) => Math.max(max, p.id), 0);

  for (const slug of slugsToScrape) {
    console.log(`Scraping ${slug}...`);
    const products = await scrapeCategory(slug);
    console.log(`Found ${products.length} products for ${slug}`);
    
    products.forEach(p => {
      maxId++;
      p.id = maxId;
      dbData.products.push(p);
    });
    
    // Add delay to prevent rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
  console.log('Successfully updated db.json with all real products.');
}

scrapeAll();
