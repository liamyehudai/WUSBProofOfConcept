const fs = require('fs');

const files = ['index.html', 'about.html', 'contact.html', 'playlists.html', 'schedule.html', 'underwriting.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace Header
    const headerStart = content.indexOf('<!-- HEADER SECTION -->');
    const headerEnd = content.indexOf('</header>') + '</header>'.length;
    
    if (headerStart !== -1 && headerEnd > headerStart) {
        content = content.substring(0, headerStart) + 
                  '<!-- COMPONENT: header.html -->\n    <div id="header-placeholder"></div>\n    ' + 
                  content.substring(headerEnd);
    }
    
    // Replace Player
    const playerStart = content.indexOf('<!-- STICKY BOTTOM RADIO PLAYER -->');
    const playerEnd = content.indexOf('<!-- JAVASCRIPT LOGIC -->');
    
    if (playerStart !== -1 && playerEnd > playerStart) {
        content = content.substring(0, playerStart) + 
                  '<!-- COMPONENT: player.html -->\n    <div id="player-placeholder"></div>\n\n    ' + 
                  content.substring(playerEnd);
    }
    
    fs.writeFileSync(file, content);
});

// Update script.js to load these components
let scriptContent = fs.readFileSync('script.js', 'utf-8');

const loaderLogic = `
/**
 * COMPONENT LOADER
 * Simulates Drupal block/region inclusion for the static prototype.
 */
async function loadComponents() {
    try {
        const headerRes = await fetch('header.html');
        const headerHtml = await headerRes.text();
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.outerHTML = headerHtml;
        }

        const playerRes = await fetch('player.html');
        const playerHtml = await playerRes.text();
        const playerPlaceholder = document.getElementById('player-placeholder');
        if (playerPlaceholder) {
            playerPlaceholder.outerHTML = playerHtml;
        }

        // Re-initialize logic after DOM update
        initLogic();
    } catch (e) {
        console.error('Error loading components (Are you running via file://? Need a local server like Live Server):', e);
        // Fallback for file:// execution: show a message
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder && window.location.protocol === 'file:') {
            headerPlaceholder.innerHTML = '<div style="background: red; color: white; padding: 10px;">Please run this prototype using a local web server (like VSCode Live Server) to load modular components.</div>';
        }
    }
}

// Wrap existing logic in an init function so it binds after dynamic load
function initLogic() {
    lucide.createIcons();

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconMenu = document.getElementById('icon-menu');
    const iconX = document.getElementById('icon-x');
    let isMenuOpen = false;

    if (mobileMenuBtn) {
        // Remove old listeners to prevent duplicates if called twice
        const newBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
        
        newBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                iconMenu.classList.add('hidden');
                iconX.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
                iconMenu.classList.remove('hidden');
                iconX.classList.add('hidden');
            }
        });
    }

    // Play/Pause Logic
    const playPauseBtn = document.getElementById('play-pause-btn');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const livePing = document.getElementById('live-ping');
    const liveDot = document.getElementById('live-dot');
    let isPlaying = false;

    if (playPauseBtn) {
        const newPlayBtn = playPauseBtn.cloneNode(true);
        playPauseBtn.parentNode.replaceChild(newPlayBtn, playPauseBtn);

        newPlayBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                document.getElementById('icon-play').classList.add('hidden');
                document.getElementById('icon-pause').classList.remove('hidden');
                document.getElementById('live-ping').classList.remove('hidden');
                document.getElementById('live-dot').classList.remove('bg-zinc-600');
                document.getElementById('live-dot').classList.add('bg-[#df2331]');
            } else {
                document.getElementById('icon-play').classList.remove('hidden');
                document.getElementById('icon-pause').classList.add('hidden');
                document.getElementById('live-ping').classList.add('hidden');
                document.getElementById('live-dot').classList.remove('bg-[#df2331]');
                document.getElementById('live-dot').classList.add('bg-zinc-600');
            }
        });
    }

    // Theme Toggle Logic
    const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('mobile-theme-toggle')];
    
    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        const iconsSun = [document.getElementById('icon-sun'), document.getElementById('mobile-icon-sun')];
        const iconsMoon = [document.getElementById('icon-moon'), document.getElementById('mobile-icon-moon')];
        
        iconsSun.forEach(icon => {
            if (icon) {
                if (isLight) icon.classList.add('hidden');
                else icon.classList.remove('hidden');
            }
        });
        iconsMoon.forEach(icon => {
            if (icon) {
                if (isLight) icon.classList.remove('hidden');
                else icon.classList.add('hidden');
            }
        });
        
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    themeToggles.forEach(btn => {
        if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', toggleTheme);
        }
    });

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        // sync icons
        const iconsSun = [document.getElementById('icon-sun'), document.getElementById('mobile-icon-sun')];
        const iconsMoon = [document.getElementById('icon-moon'), document.getElementById('mobile-icon-moon')];
        iconsSun.forEach(i => i && i.classList.add('hidden'));
        iconsMoon.forEach(i => i && i.classList.remove('hidden'));
    }
}

// Start sequence
document.addEventListener('DOMContentLoaded', loadComponents);
`;

// Overwrite script.js with new modular logic
fs.writeFileSync('script.js', loaderLogic);

console.log("Modularization complete.");
