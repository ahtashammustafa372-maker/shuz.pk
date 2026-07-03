const cheerio = require('cheerio');
const fs = require('fs');

async function getCategoryLinks() {
  const res = await fetch('https://jutay.co');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  let links = new Set();
  
  // Try to find the category boxes
  $('a[href^="/collections/"]').each((i, el) => {
    links.add($(el).attr('href'));
  });
  
  console.log("Collection links found on homepage:");
  console.log(Array.from(links));
}

getCategoryLinks();
