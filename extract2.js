const fs = require('fs');
const html = fs.readFileSync('jutay_source.html', 'utf-8');

const regex = /<a href="([^"]+)">\s*<img src="([^"]+)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
    const link = match[1];
    const img = match[2];
    if (link.includes('collections') && link !== '/collections/all') {
        console.log(`link: ${link}, img: ${img}`);
    }
}
