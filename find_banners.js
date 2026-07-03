const fs = require('fs');

const collections = [
  'basketball', 'sneakers', '7a-premium', 'flip-flops', 'caps',
  'women', 'new-arrival', 'major-loafers', 'on-cloud-men', 'runners', 'aj-iv', 't-shirts', '12-12-sale'
];

async function findBanners() {
  for (const c of collections) {
    try {
      const res = await fetch(`https://jutay.co/collections/${c}`);
      const text = await res.text();
      // Look for typical banner images in shopify collections
      const match = text.match(/<img[^>]+class="[^"]*collection-hero__image[^"]*"[^>]+src="([^"]+)"/i) || 
                    text.match(/<img[^>]+src="([^"]+)"[^>]*alt="[^"]*banner[^"]*"/i) ||
                    text.match(/<div[^>]+class="[^"]*collection-banner[^"]*"[^>]*>\s*<img[^>]+src="([^"]+)"/i) ||
                    text.match(/<img[^>]+src="([^"]+)"[^>]*collection/i);
      
      if (match) {
        console.log(`Banner for ${c}:`, match[1]);
      } else {
        console.log(`No banner for ${c}`);
      }
    } catch(e) {}
  }
}
findBanners();
