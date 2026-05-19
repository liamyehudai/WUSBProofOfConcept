const fs = require('fs');
const content = fs.readFileSync('playlists.html', 'utf-8');
const lines = content.split('\n');
for (let i = 100; i < 150; i++) console.log(lines[i]);
