const fs = require('fs');

let content = fs.readFileSync('generate_grid_schedule.js', 'utf-8');

// Replace Header
const headerStart = content.indexOf('<!-- HEADER SECTION -->');
const headerEnd = content.indexOf('</header>') + '</header>'.length;

if (headerStart !== -1 && headerEnd > headerStart) {
    content = content.substring(0, headerStart) + 
                '<!-- COMPONENT: header.html -->\\n    <div id="header-placeholder"></div>\\n    ' + 
                content.substring(headerEnd);
}

// Replace Player
const playerStart = content.indexOf('<!-- STICKY BOTTOM RADIO PLAYER -->');
const playerEnd = content.indexOf('<!-- JAVASCRIPT LOGIC -->');

if (playerStart !== -1 && playerEnd > playerStart) {
    content = content.substring(0, playerStart) + 
                '<!-- COMPONENT: player.html -->\\n    <div id="player-placeholder"></div>\\n\\n    ' + 
                content.substring(playerEnd);
}

fs.writeFileSync('generate_grid_schedule.js', content);
console.log("generate_grid_schedule.js updated with modular layout.");
