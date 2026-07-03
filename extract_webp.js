const fs = require('fs');
const html = fs.readFileSync('jutay_source.html', 'utf-8');

const imgMatch = html.match(/src="([^"]+\.webp[^"]*)"/g);
if (imgMatch) {
    const unique = [...new Set(imgMatch)];
    unique.forEach(u => console.log(u));
}
