const fs = require('fs');
['playlists.html', 'schedule.html'].forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const matches = content.match(/style="[^"]*"/g);
  if (matches) {
    console.log(f, Array.from(new Set(matches)).slice(0, 10));
  }
});
