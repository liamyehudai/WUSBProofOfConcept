const fs = require('fs');

// 1. Fix index.html
let indexContent = fs.readFileSync('index.html', 'utf-8');

// Match the article block
const articleRegex = /<article class="group relative flex flex-col h-full bg-zinc-900 overflow-hidden cursor-pointer">([\s\S]*?)<\/article>/g;

indexContent = indexContent.replace(articleRegex, (match, inner) => {
    // Extract the color
    const colorMatch = inner.match(/bg-\[(#[a-fA-F0-9]{6})\]/);
    if (!colorMatch) return match; // fallback
    const color = colorMatch[1];

    // Replace inner colors with var(--card-color)
    let newInner = inner.replace(/class="h-3 w-full bg-\[#[a-fA-F0-9]{6}\]"/g, 'class="h-3 w-full" style="background-color: var(--card-color);"');
    newInner = newInner.replace(/style="color: #[a-fA-F0-9]{6};"/g, 'style="color: var(--card-color);"');
    newInner = newInner.replace(/style="text-decoration-color: #[a-fA-F0-9]{6};"/g, 'style="text-decoration-color: var(--card-color);"');
    
    return `<article class="group relative flex flex-col h-full bg-zinc-900 overflow-hidden cursor-pointer" style="--card-color: ${color};">${newInner}</article>`;
});
fs.writeFileSync('index.html', indexContent);

// 2. Fix playlists.html
let playlistsContent = fs.readFileSync('playlists.html', 'utf-8');
const playlistRegex = /<article class="bg-zinc-900\/40 border border-zinc-800 p-6 md:p-8 flex flex-col gap-4">([\s\S]*?)<\/article>/g;

playlistsContent = playlistsContent.replace(playlistRegex, (match, inner) => {
    const colorMatch = inner.match(/style="text-decoration-color: (#[a-fA-F0-9]{6});"/);
    if (!colorMatch) return match;
    const color = colorMatch[1];

    let newInner = inner.replace(/text-\[#[a-fA-F0-9]{6}\]/g, ''); // remove the text-[#xxx] class since we'll use inline style
    newInner = newInner.replace(/style="color: #[a-fA-F0-9]{6};"/g, 'style="color: var(--card-color);"');
    newInner = newInner.replace(/style="text-decoration-color: #[a-fA-F0-9]{6};"/g, 'style="text-decoration-color: var(--card-color);"');

    return `<article class="bg-zinc-900/40 border border-zinc-800 p-6 md:p-8 flex flex-col gap-4" style="--card-color: ${color};">${newInner}</article>`;
});
fs.writeFileSync('playlists.html', playlistsContent);

// 3. Fix schedule.html
let scheduleContent = fs.readFileSync('schedule.html', 'utf-8');
scheduleContent = scheduleContent.replace(/<div class="show-item" style="border-left-color: (#[a-fA-F0-9]{6});">/g, '<div class="show-item" style="--card-color: $1; border-left-color: var(--card-color);">');
fs.writeFileSync('schedule.html', scheduleContent);

console.log("CSS Variables applied.");
