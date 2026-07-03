const https = require('https');
const url = 'https://cdn.shopify.com/s/files/1/0609/8416/4583/files/AJ_-_I_Highs_copy_19875fa3-e323-4358-a125-953bf68f0e8e.webp';

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});
