const fs = require('fs');
const html = fs.readFileSync('d:\\jutay-clone\\jutay.html', 'utf8');

const regex = /https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\s\\]+/gi;
let matches = [...new Set(html.match(regex))];

// remove trailing chars if any
matches = matches.map(url => url.split('?')[0]);
matches = [...new Set(matches)];

const aj1 = matches.filter(url => url.toLowerCase().includes('highs') || url.toLowerCase().includes('aj'));
const cloud = matches.filter(url => url.toLowerCase().includes('cloud') || url.toLowerCase().includes('on_'));
const newb = matches.filter(url => url.toLowerCase().includes('new_balance') || url.toLowerCase().includes('my_one'));
const banner = matches.filter(url => url.toLowerCase().includes('banner') || url.toLowerCase().includes('slide'));
const desk = matches.filter(url => url.toLowerCase().includes('desktop') || url.toLowerCase().includes('hero') || url.toLowerCase().includes('web'));

console.log('AJ1:', aj1.slice(0, 10));
console.log('Cloud:', cloud.slice(0, 10));
console.log('Newb:', newb.slice(0, 10));
console.log('Banner/Desk:', banner.slice(0, 5), desk.slice(0, 5));
