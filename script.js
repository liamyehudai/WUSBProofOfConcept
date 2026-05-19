
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
document.addEventListener('DOMContentLoaded', initLogic);
