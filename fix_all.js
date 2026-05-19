const fs = require('fs');

const files = ['index.html', 'about.html', 'contact.html', 'playlists.html', 'schedule.html', 'underwriting.html', 'playlistContent.html'];

// 1. Un-modularize (put header and player back)
const headerHtml = fs.readFileSync('header.html', 'utf-8');
const playerHtml = fs.readFileSync('player.html', 'utf-8');

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace header placeholder with actual header wrapped in boundary comments
    const headerRegex = /<!-- COMPONENT: header\.html -->\s*<div id="header-placeholder"><\/div>/g;
    if (headerRegex.test(content)) {
        content = content.replace(headerRegex, `<!-- COMPONENT: HEADER -->\n${headerHtml}\n<!-- END COMPONENT: HEADER -->`);
    } else {
        content = content.replace(/<div id="header-placeholder"><\/div>/g, `<!-- COMPONENT: HEADER -->\n${headerHtml}\n<!-- END COMPONENT: HEADER -->`);
    }
    
    // Replace player placeholder
    const playerRegex = /<!-- COMPONENT: player\.html -->\s*<div id="player-placeholder"><\/div>/g;
    if (playerRegex.test(content)) {
        content = content.replace(playerRegex, `<!-- COMPONENT: PLAYER -->\n${playerHtml}\n<!-- END COMPONENT: PLAYER -->`);
    } else {
        content = content.replace(/<div id="player-placeholder"><\/div>/g, `<!-- COMPONENT: PLAYER -->\n${playerHtml}\n<!-- END COMPONENT: PLAYER -->`);
    }

    fs.writeFileSync(file, content);
});

console.log("Un-modularized HTML files.");
