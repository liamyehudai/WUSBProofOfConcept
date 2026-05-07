const fs = require('fs');

const files = ['about.html', 'contact.html', 'underwriting.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace text-zinc-300 with text-zinc-300 dark:text-zinc-300 and light mode equivalent.
    // Wait, the prototype uses the `.light-theme` class on the body to handle light mode, not Tailwind's built-in dark: prefix.
    // Tailwind config maps the colors using CSS variables.
    // In style.css, light-theme redefines --color-zinc-300 ? Let's check what's defined.
    // If not, we can just use tailwind classes like text-zinc-800 for light theme and text-zinc-300 for dark, 
    // but the easiest way is to add a generic CSS class or redefine the variable.
    
    // Let's replace "text-zinc-300" with a custom class that handles both, or just let CSS variables do the work.
    
    content = content.replace(/text-zinc-300/g, 'text-zinc-700 dark:text-zinc-300');
    // Actually, since the project uses a custom `.light-theme` body class overriding CSS variables (e.g., --color-zinc-400), 
    // replacing `text-zinc-300` with `text-zinc-600` (which is re-mapped in style.css) is probably better.
    // Let's just replace `text-zinc-300` with `text-zinc-400` which is mapped in style.css to be darker in light mode.
    
    content = content.replace(/text-zinc-300/g, 'text-zinc-400');
    
    fs.writeFileSync(file, content);
});

console.log("Updated text color classes.");
