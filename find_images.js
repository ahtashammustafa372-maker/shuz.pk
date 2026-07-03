const fs = require('fs');
const html = fs.readFileSync('d:\\jutay-clone\\jutay.html', 'utf8');

// Find all matches for cdn.shopify.com.../files/...
const regex = /https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\s]+/gi;
let matches = [...new Set(html.match(regex))];

// Filter out thumbnails (e.g., width parameters like _300x)
matches = matches.filter(url => url.includes('.webp') || url.includes('.jpg') || url.includes('.png'));

const aj1 = matches.filter(url => url.toLowerCase().includes('highs'));
const cloud = matches.filter(url => url.toLowerCase().includes('cloud') || url.toLowerCase().includes('on_'));
const newArrivals = matches.filter(url => url.toLowerCase().includes('new') || url.toLowerCase().includes('arrival') || url.toLowerCase().includes('my_one'));
const allBanners = matches.filter(url => url.toLowerCase().includes('banner') || url.toLowerCase().includes('slider'));

console.log('AJ1 Links:', aj1.slice(0, 5));
console.log('Cloud Links:', cloud.slice(0, 5));
console.log('New Arrivals Links:', newArrivals.slice(0, 5));
console.log('Banner Links:', allBanners.slice(0, 5));
