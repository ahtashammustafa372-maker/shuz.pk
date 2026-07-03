const fs = require('fs');
const html = fs.readFileSync('d:\\jutay-clone\\jutay.html', 'utf8');

const regex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
let match;
const imgs = [];
while ((match = regex.exec(html)) !== null) {
  let src = match[1];
  if(src.startsWith('//')) src = 'https:' + src;
  imgs.push(src);
}

const uniqueImgs = [...new Set(imgs)].filter(src => src.includes('cdn.shopify.com'));

fs.writeFileSync('d:\\jutay-clone\\all_imgs.json', JSON.stringify(uniqueImgs, null, 2));
console.log('Saved ' + uniqueImgs.length + ' images');
