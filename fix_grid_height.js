const fs = require('fs');

let code = fs.readFileSync('generate_grid_schedule.js', 'utf-8');

// We need to make sure the heights map correctly to 1px tricks.
// A common trick is height: 1px on the TD, and h-full on the inner div.
// But we have gaps. Let's remove the flex-1 from show-item if we want them to fill the cell exactly, 
// or keep flex-1 but ensure the parent td really acts as a boundary.
// Actually, if a td has rowspan=N, we want the inner container to take 100% of that N*height.
// Setting height: 1px on the td often works, but sometimes padding on the td messes with h-full.
// Let's remove padding from the td and put it on the inner container, or use absolute positioning.

code = code.replace(/padding: 0\.25rem;/g, 'padding: 0;');
code = code.replace(/height: 1px;/g, 'height: 1px; padding: 0;');
code = code.replace(/class="border-r border-zinc-800 border-b border-zinc-800 p-1 \${bgClass}"/g, 'class="border-r border-zinc-800 border-b border-zinc-800 ${bgClass} p-0"');
code = code.replace(/<div class="flex flex-col h-full gap-1">/g, '<div class="flex flex-col h-full w-full p-1 gap-1">');

fs.writeFileSync('generate_grid_schedule.js', code);
console.log("Fixed padding and height issues.");
