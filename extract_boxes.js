const fs = require('fs');
const html = fs.readFileSync('jutay_source.html', 'utf-8');

// The boxes probably have links like <a href="/collections/..."> and an image.
// Let's find some known strings from the image: "AJ IV", "AJ - 1 Lows", "Samba", "sneaker"
const searchTerms = ['AJ IV', 'AJ - 1 Lows', 'Samba', 'sneaker', 'On Cloud', 'Puma', 'Airforce', 'Dunk', 'Bad Bunny', 'Onitsuga Tiger'];

searchTerms.forEach(term => {
    const idx = html.indexOf(term);
    if (idx !== -1) {
        // extract around this term
        const snippet = html.substring(Math.max(0, idx - 800), Math.min(html.length, idx + 800));
        console.log(`\n--- FOUND TERM: ${term} ---`);
        // Let's try to extract image URLs in this snippet
        const imgMatch = snippet.match(/src="([^"]+)"/g);
        if (imgMatch) {
            console.log("Images nearby:", imgMatch.slice(0, 3));
        }
        // Let's also print a portion to see classes
        console.log(snippet.substring(800 - 100, 800 + 100));
    }
});
