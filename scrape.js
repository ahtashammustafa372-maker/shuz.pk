const https = require('https');
const fs = require('fs');

https.get('https://jutay.co', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
    let match;
    const urls = [];
    while ((match = imgRegex.exec(data)) !== null) {
      urls.push(match[1]);
    }
    const sourceRegex = /<source[^>]+srcset="([^">]+)"[^>]*>/gi;
    while ((match = sourceRegex.exec(data)) !== null) {
      urls.push(match[1]);
    }
    fs.writeFileSync('d:\\jutay-clone\\urls.txt', urls.join('\n'));
    console.log('Saved to urls.txt');
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
