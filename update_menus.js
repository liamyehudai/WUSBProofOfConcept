const fs = require('fs');

const files = ['index.html', 'about.html', 'contact.html', 'playlists.html', 'schedule.html', 'underwriting.html', 'wusbpublicfile.html', 'djs.html', 'player.html', 'programX.html', 'programs.html', 'djx.html', 'playlistX.html', 'articleX.html'];

// The links to update:
// 1. "WUSB Requests" -> https://www.wusbrequests.com/
// 2. "EEO Report" -> https://www.wusb.fm/files/WUSB%20EEO%20Report%202022.pdf
// 3. "WUSB Public File" -> wusbpublicfile.html
// 4. "Sports" -> https://sites.google.com/view/wusbsports/home
// 5. "Pledge" -> https://stonybrookuniversity.co1.qualtrics.com/jfe/form/SV_8lcy7jXUazUqsVE
// Remove "Stream Help" and "Create content"

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');

    // Logo to index
    content = content.replace(/<a href="[^"]*" class="flex items-end gap-3 cursor-pointer group">/g, '<a href="index.html" class="flex items-end gap-3 cursor-pointer group">');
    // Also if logo is not an anchor tag (in index.html it was a div)
    content = content.replace(/<div class="flex items-end gap-3 cursor-pointer">([\s\S]*?<h1[\s\S]*?WUSB\s*<\/h1>[\s\S]*?90\.1 FM\s*<\/span>\s*)<\/div>/g, '<a href="index.html" class="flex items-end gap-3 cursor-pointer group">$1</a>');

    // Update specific links using regex
    content = content.replace(/href="[^"]*">WUSB Requests<\/a>/g, 'href="https://www.wusbrequests.com/" target="_blank" rel="noopener noreferrer">WUSB Requests</a>');
    content = content.replace(/href="[^"]*">EEO Report<\/a>/g, 'href="https://www.wusb.fm/files/WUSB%20EEO%20Report%202022.pdf" target="_blank" rel="noopener noreferrer">EEO Report</a>');
    content = content.replace(/href="[^"]*underwriting\.html#wusb-public-file"([^>]*)>WUSB Public File<\/a>/g, 'href="wusbpublicfile.html"$1>WUSB Public File</a>');
    content = content.replace(/href="[^"]*underwriting\.html#wusb-public-file"([^>]*)>Public File<\/a>/g, 'href="wusbpublicfile.html"$1>Public File</a>');
    content = content.replace(/href="[^"]*"([^>]*)>Sports<\/a>/g, 'href="https://sites.google.com/view/wusbsports/home" target="_blank" rel="noopener noreferrer"$1>Sports</a>');
    
    // Inject DJs link in submenus if not already present
    // Desktop:
    if (!content.includes('href="djs.html" class="font-swiss text-sm font-medium tracking-wide')) {
        content = content.replace(/(<a href="underwriting\.html" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">Underwriting<\/a>)/g, 
            '$1\n                <a href="djs.html" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">DJs</a>');
    }
    // Mobile:
    if (!content.includes('href="djs.html" class="font-swiss text-sm tracking-wide')) {
        content = content.replace(/(<a href="underwriting\.html" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">Underwriting<\/a>)/g, 
            '$1\n                <a href="djs.html" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">DJs</a>');
    }

    // Inject Shows link in submenus if not already present
    // Desktop:
    if (!content.includes('href="programs.html" class="font-swiss text-sm font-medium tracking-wide')) {
        content = content.replace(/(<a href="djs\.html" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">DJs<\/a>)/g, 
            '$1\n                <a href="programs.html" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">Shows</a>');
    }
    // Mobile:
    if (!content.includes('href="programs.html" class="font-swiss text-sm tracking-wide')) {
        content = content.replace(/(<a href="djs\.html" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">DJs<\/a>)/g, 
            '$1\n                <a href="programs.html" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">Shows</a>');
    }

    // Pledge buttons (there are multiple, desktop and mobile)
    content = content.replace(/<button class="font-chuck text-3xl[^>]*>\s*PLEDGE\s*<\/button>/g, 
        '<a href="https://stonybrookuniversity.co1.qualtrics.com/jfe/form/SV_8lcy7jXUazUqsVE" target="_blank" rel="noopener noreferrer" class="font-chuck text-3xl px-8 py-3 rounded text-[#000] pledge-gradient transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,250,0,0.4)] transition-all duration-200 inline-block text-center">\n                        PLEDGE\n                    </a>');
    
    content = content.replace(/<button class="font-chuck text-2xl px-6 py-2[^>]*>\s*PLEDGE\s*<\/button>/g, 
        '<a href="https://stonybrookuniversity.co1.qualtrics.com/jfe/form/SV_8lcy7jXUazUqsVE" target="_blank" rel="noopener noreferrer" class="font-chuck text-2xl px-6 py-2 rounded text-[#000] pledge-gradient transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,250,0,0.4)] transition-all duration-200 inline-block text-center">\n                        PLEDGE\n                    </a>');

    content = content.replace(/<button class="font-chuck text-2xl px-6 py-3 mt-2[^>]*>\s*PLEDGE\s*<\/button>/g, 
        '<a href="https://stonybrookuniversity.co1.qualtrics.com/jfe/form/SV_8lcy7jXUazUqsVE" target="_blank" rel="noopener noreferrer" class="font-chuck text-2xl px-6 py-3 mt-2 rounded text-[#000] pledge-gradient w-full text-center inline-block">\n                    PLEDGE\n                </a>');

    // Remove Create Content and Stream Help
    content = content.replace(/<a href="[^"]*"[^>]*>Create content<\/a>\s*/g, '');
    content = content.replace(/<a href="[^"]*"[^>]*>Stream Help<\/a>\s*/g, '');

    fs.writeFileSync(file, content);
});

console.log("Links updated in all HTML files.");
