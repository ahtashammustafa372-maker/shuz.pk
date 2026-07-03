const html = require('fs').readFileSync('oncloud.html', 'utf8');
const urls = html.match(/https:\/\/jutay\.co\/cdn\/shop\/files\/[^\"\'\?]+\.webp/g) || [];
console.log([...new Set(urls)].join('\n'));
