const fs = require('fs');

const files = ['index.html', 'about.html', 'contact.html', 'playlists.html', 'schedule.html', 'underwriting.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Some files might still have the raw header instead of the placeholder
    // Let's replace raw headers with the placeholder if they exist
    const headerStart = content.indexOf('<header class="border-b-4 border-zinc-900 sticky top-0 z-50 bg-black/95 backdrop-blur-sm">');
    if (headerStart !== -1) {
        const headerEnd = content.indexOf('</header>') + '</header>'.length;
        content = content.substring(0, headerStart) + 
                  '<!-- COMPONENT: header.html -->\n    <div id="header-placeholder"></div>' + 
                  content.substring(headerEnd);
    }
    
    // Player
    const playerStart = content.indexOf('<div class="fixed bottom-0 left-0 w-full z-50">');
    if (playerStart !== -1) {
        // Find the matching end div for the player... it's right before <!-- JAVASCRIPT LOGIC -->
        const playerEnd = content.indexOf('<!-- JAVASCRIPT LOGIC -->');
        if (playerEnd !== -1) {
            content = content.substring(0, playerStart) + 
                      '<!-- COMPONENT: player.html -->\n    <div id="player-placeholder"></div>\n\n    ' + 
                      content.substring(playerEnd);
        }
    }
    
    fs.writeFileSync(file, content);
});

console.log("Forced components in all files.");
