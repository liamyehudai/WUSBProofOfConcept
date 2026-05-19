const fs = require('fs');

let indexContent = fs.readFileSync('index.html', 'utf-8');

// Match the article block
const articleRegex = /<article class="group cursor-pointer flex flex-col bg-zinc-900\/40 hover:bg-zinc-900 transition-colors duration-300">([\s\S]*?)<\/article>/g;

indexContent = indexContent.replace(articleRegex, (match, inner) => {
    // Extract the color
    const colorMatch = inner.match(/bg-\[(#[a-fA-F0-9]{6})\]/);
    if (!colorMatch) return match; // fallback
    const color = colorMatch[1];

    // Replace inner colors with var(--card-color)
    let newInner = inner.replace(/class="h-3 w-full bg-\[#[a-fA-F0-9]{6}\]"/g, 'class="h-3 w-full" style="background-color: var(--card-color);"');
    newInner = newInner.replace(/style="color: #[a-fA-F0-9]{6};"/g, 'style="color: var(--card-color);"');
    newInner = newInner.replace(/style="text-decoration-color: #[a-fA-F0-9]{6};"/g, 'style="text-decoration-color: var(--card-color);"');
    
    return `<article class="group cursor-pointer flex flex-col bg-zinc-900/40 hover:bg-zinc-900 transition-colors duration-300" style="--card-color: ${color};">${newInner}</article>`;
});

fs.writeFileSync('index.html', indexContent);

console.log("index.html fixed.");
