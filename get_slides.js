const fs = require('fs');
const html = fs.readFileSync('jutay_source.html', 'utf-8');
const start = html.indexOf('Easy Wear');
const end = html.indexOf('View All', start);
const snippet = html.substring(start, end);

const titles = [...snippet.matchAll(/aria-label="([^"]+)"/g)].map(m => m[1]);
const images = [...snippet.matchAll(/<img src="([^"]+)"/g)].map(m => m[1]);

console.log("Titles:", [...new Set(titles)].filter(t => t.includes('LOUI') || t.includes('IZMIR')));
console.log("Images:", [...new Set(images)].filter(i => !i.includes('hover') && !i.includes('icons8') && !i.includes('logo')));
