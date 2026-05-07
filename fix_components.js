const fs = require('fs');

const files = ['index.html', 'about.html', 'contact.html', 'playlists.html', 'schedule.html', 'underwriting.html'];

// Make sure tailwind script is removed from head if we move it to script.js
// Wait, Tailwind CDN logic needs to be in head or before body loads generally, 
// let's create tailwind.js component or just add it to script.js

const tailwindConfig = `
tailwind.config = {
    theme: {
        extend: {
        colors: {
            black: 'var(--color-black, #000000)',
            white: 'var(--color-white, #ffffff)',
            zinc: {
            400: 'var(--color-zinc-400, #a1a1aa)',
            500: 'var(--color-zinc-500, #71717a)',
            600: 'var(--color-zinc-600, #52525b)',
            700: 'var(--color-zinc-700, #3f3f46)',
            800: 'var(--color-zinc-800, #27272a)',
            900: 'var(--color-zinc-900, #18181b)',
            950: 'var(--color-zinc-950, #09090b)',
            }
        }
        }
    }
};
`;

let scriptContent = fs.readFileSync('script.js', 'utf-8');
if (!scriptContent.includes('tailwind.config =')) {
    fs.writeFileSync('script.js', tailwindConfig + '\n' + scriptContent);
}

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Remove the inline script for tailwind config
    content = content.replace(/<script>\s*tailwind\.config[\s\S]*?<\/script>/, '');

    fs.writeFileSync(file, content);
});

console.log("Tailwind config moved to script.js");
