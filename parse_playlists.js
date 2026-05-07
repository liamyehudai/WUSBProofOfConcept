const fs = require('fs');

const text = fs.readFileSync('playlistContent.html', 'utf-8');
const lines = text.split('\n');

const playlists = [];
let currentPlaylist = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === 'Playlists' || line === '123456789…next ›last »') continue;
    
    // Check if line looks like a title
    if (line.includes('playlist for')) {
        if (currentPlaylist) {
            playlists.push(currentPlaylist);
        }
        currentPlaylist = { title: line, authorDate: '', content: [] };
        
        // Next line should be author/date
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith('By')) {
            currentPlaylist.authorDate = lines[i + 1].trim();
            i++; // skip next line
        }
    } else if (line.includes('View program')) {
        // End of a playlist item
        if (currentPlaylist) {
            playlists.push(currentPlaylist);
            currentPlaylist = null;
        }
    } else if (line !== '' && currentPlaylist) {
        currentPlaylist.content.push(line);
    }
}
if (currentPlaylist) playlists.push(currentPlaylist);

// Colors for styling
const colors = ["#df0781", "#8bfa00", "#52a1fc", "#f8e700", "#9800e0", "#df2331", "#eebc00", "#8febfe", "#af04ab", "#3b00fc", "#a91b00"];

let htmlContent = `        <div class="flex flex-col gap-8">\n`;

playlists.forEach((p, index) => {
    const color = colors[index % colors.length];
    
    // Match "By author on date"
    let author = "";
    let date = "";
    const match = p.authorDate.match(/By (.+) on (.*)/);
    if (match) {
        author = match[1];
        date = match[2];
    } else {
        author = "Unknown";
        date = p.authorDate;
    }
    
    htmlContent += `            
            <!-- Playlist Node ${index + 1} -->
            <article class="bg-zinc-900/40 border border-zinc-800 p-6 md:p-8 flex flex-col gap-4">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
                    <h3 class="font-swiss font-bold text-2xl md:text-3xl tracking-tight leading-tight wusb-gradient inline-block">
                        <a href="#" class="hover:underline decoration-2 underline-offset-4" style="text-decoration-color: ${color};">${p.title}</a>
                    </h3>
                    <div class="font-swiss text-xs text-zinc-500 font-bold tracking-wider uppercase">
                        By <a href="#" class="text-[#8febfe] hover:text-white transition-colors">${author}</a> on ${date}
                    </div>
                </div>

                <div class="prose prose-invert max-w-none font-swiss text-zinc-400 leading-relaxed text-sm md:text-base">
`;
    
    p.content.forEach(paragraph => {
        htmlContent += `                    <p>${paragraph}</p>\n`;
    });
    
    htmlContent += `                </div>

                <div class="pt-4 mt-2 flex justify-end">
                    <a href="#" class="font-swiss text-sm font-bold uppercase tracking-widest text-[${color}] hover:text-white transition-colors flex items-center gap-2" style="color: ${color};">
                        View program <span class="text-xl leading-none">&rarr;</span>
                    </a>
                </div>
            </article>
`;
});

htmlContent += `        </div>`;

// Read playlists.html and replace the content block
let htmlFile = fs.readFileSync('playlists.html', 'utf-8');
// The block to replace starts with: <div class="flex flex-col gap-8">
// and ends right before </main>

const startTag = '<!-- DRUPAL MAPPING: Views - Station Schedule Playlists -->';
const endTag = '</main>';

const startIndex = htmlFile.indexOf(startTag) + startTag.length;
const endIndex = htmlFile.indexOf(endTag);

const newHtmlFile = htmlFile.substring(0, startIndex) + '\n' + htmlContent + '\n    ' + htmlFile.substring(endIndex);

fs.writeFileSync('playlists.html', newHtmlFile);
console.log('Updated playlists.html with ' + playlists.length + ' items.');

