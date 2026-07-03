const fs = require('fs');
const html = fs.readFileSync('jutay_source.html', 'utf-8');

const regex = /<div class="slide-item">\s*<a href="([^"]+)"><img src="([^"]+)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
    console.log(`{ link: "${match[1]}", image: "${match[2]}" },`);
}
