const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeCategory(url, slug) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let products = [];
    
    // Shopify product cards typically have specific classes
    $('.m-product-card').each((i, el) => {
      const title = $(el).find('.m-product-card__title a').text().trim() || $(el).find('h3 a').text().trim() || $(el).find('h3').text().trim();
      
      // Look for the image
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

      // Look for the price
      let priceText = $(el).find('.m-price-item--regular').text().trim() || $(el).find('.m-price-item--sale').text().trim();
      let price = 15000; // default
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
          vendor: "Puma",
          created_at: new Date().toISOString()
        });
      }
    });

    console.log(`Found ${products.length} products for ${slug}`);
    
    if (products.length > 0) {
      const dbPath = 'src/lib/db.json';
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      
      // Remove the dummy products for this category
      dbData.products = dbData.products.filter(p => p.category_slug !== slug);
      
      // Find max ID
      let maxId = dbData.products.reduce((max, p) => Math.max(max, p.id), 0);
      
      // Add new products
      products.forEach(p => {
        maxId++;
        p.id = maxId;
        dbData.products.push(p);
      });
      
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      console.log('Saved to db.json');
    }

  } catch (err) {
    console.error(err);
  }
}

scrapeCategory('https://jutay.co/collections/puma', 'puma');
