const fs = require('fs');

async function scrapePuma() {
  try {
    const res = await fetch('https://jutay.co/collections/puma');
    const html = await res.text();
    // try to extract product titles
    const titleRegex = /<a[^>]*class="[^"]*product-item__title[^"]*"[^>]*>(.*?)<\/a>/gi;
    let match;
    let products = [];
    while ((match = titleRegex.exec(html)) !== null) {
      products.push(match[1].trim());
    }
    console.log("Found products:");
    console.log(products);
    
    // Check if maybe it's another class
    if (products.length === 0) {
       const titleRegex2 = /<h3[^>]*class="[^"]*card__heading[^"]*"[^>]*>.*?<a[^>]*>(.*?)<\/a>/gi;
       while ((match = titleRegex2.exec(html)) !== null) {
         products.push(match[1].trim());
       }
       console.log("Alternative regex products:");
       console.log(products);
    }

  } catch (err) {
    console.error(err);
  }
}

scrapePuma();
