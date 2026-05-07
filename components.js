// Script to generate component files from index.html to be used dynamically.
const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf-8');

// Extract Header
const headerStart = indexHtml.indexOf('<!-- HEADER SECTION -->');
const headerEnd = indexHtml.indexOf('</header>') + '</header>'.length;
const headerContent = indexHtml.substring(headerStart, headerEnd);
fs.writeFileSync('header.html', headerContent);

// Extract Player
const playerStart = indexHtml.indexOf('<!-- STICKY BOTTOM RADIO PLAYER -->');
// Find end of player (up to the Neon strip)
const playerEnd = indexHtml.indexOf('<!-- JAVASCRIPT LOGIC -->');
const playerContent = indexHtml.substring(playerStart, playerEnd);
fs.writeFileSync('player.html', playerContent);

console.log("Components extracted.");
