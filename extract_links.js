const fs = require('fs');
const html = fs.readFileSync('jutay_source.html', 'utf-8');

const regex = /<a href="([^"]+)"><img src="([^"]+)"[^>]*><\/a>/g;
let match;
while ((match = regex.exec(html)) !== null) {
    if (match[2].includes('cdn.shopify.com') && match[2].includes('_copy')) {
        console.log(`{ link: "${match[1]}", image: "${match[2]}" },`);
    }
}
