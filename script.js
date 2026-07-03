
tailwind.config = {
    theme: {
        extend: {
        colors: {
            black: 'var(--color-black, #000000)',
            white: 'var(--color-white, #ffffff)',
            zinc: {
            400: 'var(--color-zinc-400, #a1a1aa)',
            450: '#7e7e86',
            500: 'var(--color-zinc-500, #71717a)',
            600: 'var(--color-zinc-600, #52525b)',
            700: 'var(--color-zinc-700, #3f3f46)',
            800: 'var(--color-zinc-800, #27272a)',
            900: 'var(--color-zinc-900, #18181b)',
            950: 'var(--color-zinc-950, #09090b)',
            }
        },
        fontFamily: {
            swiss: ['Inter', 'sans-serif'],
            chuck: ['"Chuck W01 Regular"', 'Impact', 'sans-serif'],
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

    // Play/Pause & Live Audio Stream Logic
    const playPauseBtn = document.getElementById('play-pause-btn');
    const listenLiveBtn = document.getElementById('listen-live-btn') || Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Listen Live');
    let isPlaying = false;
    let audio = null;
    const streamUrl = 'https://stream.wusb.stonybrook.edu:8092/listen.pl';

    // Volume Control Elements & State
    const volumeSliderContainer = document.querySelector('.fixed.bottom-0 .bg-zinc-800.rounded-full.overflow-hidden') || document.querySelector('.bg-zinc-800.rounded-full.overflow-hidden');
    let volumeSliderFill = null;
    let volumeIcon = null;
    let volume = 0.75;
    let isMuted = false;

    if (volumeSliderContainer) {
        volumeSliderFill = volumeSliderContainer.querySelector('div');
        volumeIcon = volumeSliderContainer.previousElementSibling;
        
        volumeSliderContainer.style.cursor = 'pointer';
        if (volumeIcon) {
            volumeIcon.style.cursor = 'pointer';
        }
    }

    function togglePlayback() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            if (!audio) {
                audio = new Audio();
            }
            audio.volume = volume;
            audio.muted = isMuted;
            audio.src = streamUrl;
            audio.load();
            audio.play().catch(err => {
                console.error("Audio playback failed:", err);
                isPlaying = false;
                updateUI(false);
            });
            updateUI(true);
        } else {
            if (audio) {
                audio.pause();
                audio.src = '';
                audio.load();
            }
            updateUI(false);
        }
    }

    function updateUI(playing) {
        const iconPlay = document.getElementById('icon-play');
        const iconPause = document.getElementById('icon-pause');
        const livePing = document.getElementById('live-ping');
        const liveDot = document.getElementById('live-dot');

        if (playing) {
            if (iconPlay) iconPlay.classList.add('hidden');
            if (iconPause) iconPause.classList.remove('hidden');
            if (livePing) livePing.classList.remove('hidden');
            if (liveDot) {
                liveDot.classList.remove('bg-zinc-600');
                liveDot.classList.add('bg-[#df2331]');
            }
        } else {
            if (iconPlay) iconPlay.classList.remove('hidden');
            if (iconPause) iconPause.classList.add('hidden');
            if (livePing) livePing.classList.add('hidden');
            if (liveDot) {
                liveDot.classList.remove('bg-[#df2331]');
                liveDot.classList.add('bg-zinc-600');
            }
        }
    }

    function setVolume(val) {
        volume = Math.max(0, Math.min(1, val));
        if (audio) {
            audio.volume = volume;
        }
        if (volumeSliderFill) {
            volumeSliderFill.style.width = `${volume * 100}%`;
        }
        updateVolumeIcon();
    }

    function updateVolumeIcon() {
        if (!volumeIcon) return;
        
        let iconName = 'volume-2';
        if (volume === 0 || isMuted) {
            iconName = 'volume-x';
        } else if (volume < 0.3) {
            iconName = 'volume';
        } else if (volume < 0.6) {
            iconName = 'volume-1';
        }
        
        volumeIcon.setAttribute('data-lucide', iconName);
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    if (volumeSliderContainer) {
        const updateVolumeFromEvent = (e) => {
            const rect = volumeSliderContainer.getBoundingClientRect();
            const posX = e.clientX - rect.left;
            const percentage = posX / rect.width;
            isMuted = false;
            if (audio) {
                audio.muted = false;
            }
            setVolume(percentage);
        };

        volumeSliderContainer.addEventListener('mousedown', (e) => {
            updateVolumeFromEvent(e);
            
            const onMouseMove = (moveEvent) => {
                updateVolumeFromEvent(moveEvent);
            };
            
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    if (volumeIcon) {
        const newVolumeIcon = volumeIcon.cloneNode(true);
        volumeIcon.parentNode.replaceChild(newVolumeIcon, volumeIcon);
        volumeIcon = newVolumeIcon; // Update reference to the new clone
        
        volumeIcon.addEventListener('click', () => {
            isMuted = !isMuted;
            if (audio) {
                audio.muted = isMuted;
            }
            if (isMuted) {
                if (volumeSliderFill) {
                    volumeSliderFill.style.width = '0%';
                }
                volumeIcon.setAttribute('data-lucide', 'volume-x');
            } else {
                if (volumeSliderFill) {
                    volumeSliderFill.style.width = `${volume * 100}%`;
                }
                updateVolumeIcon();
            }
            if (window.lucide) {
                lucide.createIcons();
            }
        });
    }

    if (playPauseBtn) {
        const newPlayBtn = playPauseBtn.cloneNode(true);
        playPauseBtn.parentNode.replaceChild(newPlayBtn, playPauseBtn);
        newPlayBtn.addEventListener('click', togglePlayback);
    }

    if (listenLiveBtn) {
        const newListenLiveBtn = listenLiveBtn.cloneNode(true);
        listenLiveBtn.parentNode.replaceChild(newListenLiveBtn, listenLiveBtn);
        newListenLiveBtn.addEventListener('click', togglePlayback);
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

function labelTableDays(table) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    // Label header elements
    const headers = table.querySelectorAll('thead th');
    // Header 0 is Time, headers 1 to 7 are Sunday to Saturday
    for (let i = 1; i <= 7; i++) {
        if (headers[i]) {
            headers[i].dataset.day = days[i - 1];
            headers[i].classList.add(`day-col-${days[i - 1]}`);
        }
    }
    
    // Keep track of active rowspans for each of the 7 days
    let activeRowspans = [0, 0, 0, 0, 0, 0, 0];
    
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const tdList = row.querySelectorAll('td');
        if (tdList.length === 0) return;
        
        // tdList[0] is the Time cell
        tdList[0].classList.add('time-cell');
        
        let nextTdIndex = 1;
        
        for (let colIndex = 0; colIndex < 7; colIndex++) {
            if (activeRowspans[colIndex] > 0) {
                activeRowspans[colIndex]--;
            } else {
                if (nextTdIndex < tdList.length) {
                    let td = tdList[nextTdIndex++];
                    td.dataset.day = days[colIndex];
                    td.classList.add(`day-col-${days[colIndex]}`);
                    
                    let rowspan = parseInt(td.getAttribute('rowspan')) || 1;
                    activeRowspans[colIndex] = rowspan - 1;
                }
            }
        }
    });
}

function initSchedule() {
    const table = document.querySelector('.schedule-table');
    if (!table) return; // Not on the schedule page
    
    labelTableDays(table);
    
    // State
    let selectedDate = new Date();
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let currentActiveTab = "Full Week";
    
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    const todayBtn = document.getElementById('today-btn');
    const dateInput = document.getElementById('date-lookup-input');
    const dateBtn = document.getElementById('date-lookup-btn');
    const tabsContainer = document.getElementById('day-tabs-container');
    
    function getSunday(d) {
        let date = new Date(d);
        let day = date.getDay();
        let diff = date.getDate() - day;
        return new Date(date.setDate(diff));
    }
    
    function formatWeekRange(sunday) {
        let saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        
        let options = { month: 'short', day: 'numeric', year: 'numeric' };
        return `Week of ${sunday.toLocaleDateString(undefined, options)} - ${saturday.toLocaleDateString(undefined, options)}`;
    }
    
    function parseLocalDate(dateStr) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        return new Date(dateStr);
    }
    
    function formatLocalDateToYYYYMMDD(d) {
        let year = d.getFullYear();
        let month = String(d.getMonth() + 1).padStart(2, '0');
        let day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function parseStartTime(timeStr) {
        timeStr = timeStr.toLowerCase().replace(/\s/g, '');
        let startPart = timeStr.split('-')[0];
        
        let isPM = startPart.includes('pm') || (timeStr.includes('pm') && !startPart.includes('am'));
        let isAM = startPart.includes('am') || (timeStr.includes('am') && !startPart.includes('pm'));
        
        if (!startPart.includes('am') && !startPart.includes('pm')) {
            let endPart = timeStr.split('-')[1];
            if (endPart) {
                if (endPart.includes('pm')) {
                    let startH = parseInt(startPart.split(':')[0]);
                    let endH = parseInt(endPart.split(':')[0]);
                    if (startH === 12) isPM = true;
                    else if (startH > endH && endH !== 12) isAM = true;
                    else isPM = true;
                } else if (endPart.includes('am')) {
                    isAM = true;
                }
            }
        }
        
        startPart = startPart.replace('am', '').replace('pm', '');
        let parts = startPart.split(':');
        let hours = parseInt(parts[0]);
        let minutes = parts[1] ? parseInt(parts[1]) : 0;
        
        if (isPM && hours !== 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
        
        let hh = String(hours).padStart(2, '0');
        let mm = String(minutes).padStart(2, '0');
        return `${hh}${mm}`;
    }
    
    function injectPlayButtons(table) {
        const items = table.querySelectorAll('.show-item');
        items.forEach(item => {
            if (item.querySelector('.archive-play-btn')) return;
            
            const playBtn = document.createElement('a');
            playBtn.className = "archive-play-btn absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-[#8bfa00] text-white hover:text-black hover:scale-105 hover:shadow-[0_0_10px_rgba(139,250,0,0.5)] transition-all duration-200 flex items-center justify-center cursor-pointer z-10";
            playBtn.title = "Listen to Archive";
            playBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i>';
            
            item.style.position = 'relative';
            item.style.paddingRight = '2.5rem';
            
            item.appendChild(playBtn);
        });
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    function updateArchiveLinks(table, sunday) {
        const dayNumbers = {
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6,
            "Sunday": 7
        };
        const dayAbbrs = {
            "Sunday": "Sun",
            "Monday": "Mon",
            "Tuesday": "Tue",
            "Wednesday": "Wed",
            "Thursday": "Thu",
            "Friday": "Fri",
            "Saturday": "Sat"
        };
        
        const items = table.querySelectorAll('.show-item');
        items.forEach(item => {
            const td = item.closest('td[data-day]');
            if (!td) return;
            
            const dayName = td.dataset.day;
            const timeEl = item.querySelector('.show-time');
            const titleEl = item.querySelector('.show-title');
            if (!timeEl || !titleEl) return;
            
            const timeText = timeEl.textContent;
            const timeStr = parseStartTime(timeText);
            const titleText = titleEl.textContent.trim();
            
            const dayNum = dayNumbers[dayName];
            const dayAbbr = dayAbbrs[dayName];
            
            const dayIndex = dayNames.indexOf(dayName);
            const showDate = new Date(sunday);
            showDate.setDate(sunday.getDate() + dayIndex);
            
            const dd = String(showDate.getDate()).padStart(2, '0');
            const mm = String(showDate.getMonth() + 1).padStart(2, '0');
            const yyyy = showDate.getFullYear();
            
            const archiveParam = `${dayNum}${dayAbbr}-${timeStr}`;
            const dateParam = `${timeStr}-${dd}-${mm}-${yyyy}`;
            
            const playBtn = item.querySelector('.archive-play-btn');
            if (playBtn) {
                playBtn.href = `player.html?archive=${archiveParam}&date=${dateParam}&title=${encodeURIComponent(titleText)}`;
            }
        });
    }
    
    function selectTab(tabName) {
        currentActiveTab = tabName;
        
        const tabs = document.querySelectorAll('#day-tabs-container button');
        tabs.forEach(btn => {
            const tabVal = btn.dataset.tab;
            if (tabVal === tabName) {
                btn.className = "px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest text-[#8bfa00] bg-zinc-800 rounded-sm cursor-pointer";
            } else {
                btn.className = "px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors rounded-sm cursor-pointer";
            }
        });
        
        table.setAttribute('data-active-day', tabName);
    }
    
    function updateScheduleForDate() {
        const sunday = getSunday(selectedDate);
        const weekDisplay = document.getElementById('current-week-display');
        if (weekDisplay) {
            weekDisplay.textContent = formatWeekRange(sunday);
        }
        
        // Update Today Highlight
        const today = new Date();
        const todaySunday = getSunday(today);
        const isCurrentWeek = sunday.toDateString() === todaySunday.toDateString();
        const todayDayName = dayNames[today.getDay()];
        
        // Reset all day headers and cells
        const headers = table.querySelectorAll('thead th[data-day]');
        headers.forEach(th => {
            th.classList.remove('current-day', 'bg-zinc-900/80');
        });
        const cells = table.querySelectorAll('tbody td[data-day]');
        cells.forEach(td => {
            td.classList.remove('current-day', 'bg-zinc-900/30');
        });
        
        if (isCurrentWeek) {
            // Highlight today's column
            const todayHeader = table.querySelector(`thead th[data-day="${todayDayName}"]`);
            if (todayHeader) {
                todayHeader.classList.add('current-day', 'bg-zinc-900/80');
            }
            const todayCells = table.querySelectorAll(`tbody td[data-day="${todayDayName}"]`);
            todayCells.forEach(td => {
                td.classList.add('current-day', 'bg-zinc-900/30');
            });
        }
        
        // Update play button archive links for the new week range
        updateArchiveLinks(table, sunday);
    }
    
    // Event listeners for week navigation
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', () => {
            selectedDate.setDate(selectedDate.getDate() - 7);
            if (dateInput) {
                dateInput.value = formatLocalDateToYYYYMMDD(selectedDate);
            }
            updateScheduleForDate();
        });
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', () => {
            selectedDate.setDate(selectedDate.getDate() + 7);
            if (dateInput) {
                dateInput.value = formatLocalDateToYYYYMMDD(selectedDate);
            }
            updateScheduleForDate();
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            selectedDate = new Date();
            const todayDayName = dayNames[selectedDate.getDay()];
            selectTab(todayDayName);
            if (dateInput) {
                dateInput.value = formatLocalDateToYYYYMMDD(selectedDate);
            }
            updateScheduleForDate();
        });
    }
    
    function triggerDateLookup() {
        if (dateInput && dateInput.value) {
            const parsed = parseLocalDate(dateInput.value);
            if (parsed && !isNaN(parsed.getTime())) {
                selectedDate = parsed;
                const dayName = dayNames[selectedDate.getDay()];
                selectTab(dayName);
                updateScheduleForDate();
            }
        }
    }
    
    if (dateBtn) {
        dateBtn.addEventListener('click', triggerDateLookup);
    }
    
    if (dateInput) {
        dateInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                triggerDateLookup();
            }
        });
    }
    
    // Day tabs
    if (tabsContainer) {
        const tabs = tabsContainer.querySelectorAll('button');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabVal = btn.dataset.tab;
                if (tabVal) {
                    selectTab(tabVal);
                }
            });
        });
    }
    
    // Initialize date input to today
    if (dateInput) {
        dateInput.value = formatLocalDateToYYYYMMDD(selectedDate);
    }
    
    // Inject play buttons and set up archive links
    injectPlayButtons(table);
    
    // Select today's tab by default and render
    const todayDayName = dayNames[selectedDate.getDay()];
    selectTab(todayDayName);
    updateScheduleForDate();
}

// SPA Navigation System to keep audio playing uninterrupted
function initSPANavigation() {
    // Intercept clicks on links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Only intercept internal links and exclude external links, anchors, downloads, and data URIs
        const isDownload = link.hasAttribute('download');
        const isDataUri = href.startsWith('data:');
        const isInternal = href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#') && !link.getAttribute('target') && !href.endsWith('.pdf') && !isDownload && !isDataUri;
        if (!isInternal) return;
        
        e.preventDefault();
        navigateToPage(href);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        loadPageContent(window.location.pathname + window.location.search, false);
    });
}

function navigateToPage(url) {
    loadPageContent(url, true);
}

async function loadPageContent(url, pushToHistory = true) {
    try {
        const currentMain = document.querySelector('main');
        const currentHero = document.querySelector('.hero-section');
        
        // Step 1: Fade out
        if (currentMain) {
            currentMain.style.transition = 'opacity 0.15s ease-in-out';
            currentMain.style.opacity = 0;
        }
        if (currentHero) {
            currentHero.style.transition = 'opacity 0.15s ease-in-out';
            currentHero.style.opacity = 0;
        }

        if (currentMain || currentHero) {
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load page");
        const html = await response.text();
        
        // Parse the fetched HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Clean up any old dynamic styles
        const oldStyles = document.querySelectorAll('.spa-dynamic-style');
        oldStyles.forEach(style => style.remove());

        // Extract and load new styles from the fetched document
        const newStyles = doc.querySelectorAll('style');
        newStyles.forEach(style => {
            const styleClone = style.cloneNode(true);
            styleClone.classList.add('spa-dynamic-style');
            document.head.appendChild(styleClone);
        });

        // Swap title
        document.title = doc.title;
        
        // Handle Hero Section
        const newHero = doc.querySelector('.hero-section');
        if (currentHero && !newHero) {
            currentHero.remove();
        } else if (!currentHero && newHero) {
            const mainEl = document.querySelector('main');
            if (mainEl) {
                newHero.style.opacity = 0;
                newHero.style.transition = 'opacity 0.15s ease-in-out';
                mainEl.parentNode.insertBefore(newHero, mainEl);
            }
        } else if (currentHero && newHero) {
            newHero.style.opacity = 0;
            newHero.style.transition = 'opacity 0.15s ease-in-out';
            currentHero.replaceWith(newHero);
        }

        // Swap main content
        const newMain = doc.querySelector('main');
        if (currentMain && newMain) {
            newMain.style.opacity = 0;
            newMain.style.transition = 'opacity 0.15s ease-in-out';
            currentMain.replaceWith(newMain);
            
            // Trigger reflow to start transition
            newMain.offsetHeight;
            newMain.style.opacity = 1;
            
            const activeHero = document.querySelector('.hero-section');
            if (activeHero) {
                activeHero.offsetHeight;
                activeHero.style.opacity = 1;
            }
        }
        
        // Update URL in history
        if (pushToHistory) {
            history.pushState(null, '', url);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Re-run general initializers for script.js first (decorates DOM)
        if (typeof initLogic === 'function') {
            initLogic();
        }
        if (typeof initSchedule === 'function') {
            initSchedule();
        }
        if (typeof initCarousels === 'function') {
            initCarousels();
        }
        
        // Execute inline scripts with temporary document.addEventListener override
        const originalAddEventListener = document.addEventListener;
        document.addEventListener = function(type, listener, options) {
            if (type === 'DOMContentLoaded') {
                listener(new Event('DOMContentLoaded'));
            } else {
                originalAddEventListener.call(this, type, listener, options);
            }
        };

        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            const src = script.getAttribute('src') || '';
            if (src.includes('script.js') || src.includes('tailwindcss') || src.includes('lucide')) {
                return;
            }
            
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
            newScript.remove();
        });

        // Restore original listener
        document.addEventListener = originalAddEventListener;
        
    } catch (err) {
        console.error("SPA loading error:", err);
        window.location.href = url;
    }
}

function initCarousels() {
    const djContainer = document.getElementById('dj-carousel-inner');
    const showContainer = document.getElementById('show-carousel-inner');
    if (!djContainer && !showContainer) return;

    const djs = [
        { name: "DJx", initials: "DX" },
        { name: "DJ Void", initials: "DV" },
        { name: "scottorourke", initials: "SO" },
        { name: "Steve-K", initials: "SK" },
        { name: "mr.ethanson", initials: "ME" },
        { name: "maacastro", initials: "MC" },
        { name: "Buddy Merriam", initials: "BM" },
        { name: "Sillyometer", initials: "SM" },
        { name: "DJ Ray Knives", initials: "RK" },
        { name: "Ahmad Ali", initials: "AA" },
        { name: "Joe V", initials: "JV" },
        { name: "Mario Staiano", initials: "MS" },
        { name: "Gavin", initials: "GV" },
        { name: "Ryanberger", initials: "RB" },
        { name: "DJ Spiney", initials: "DS" },
        { name: "Scott O", initials: "SO" }
    ];

    const shows = [
        { name: "Melting World", initials: "MW" },
        { name: "Ménage à trois", initials: "MT" },
        { name: "Sunday Street", initials: "SS" },
        { name: "Jazz On The Air", initials: "JA" },
        { name: "Purple Starlight", initials: "PS" },
        { name: "Omega", initials: "OM" },
        { name: "Underground Sound", initials: "US" },
        { name: "Radio Kaos", initials: "RK" },
        { name: "Stereo Sanctity", initials: "SS" },
        { name: "Close The Door", initials: "CD" },
        { name: "Wayback Wednesday", initials: "WW" },
        { name: "Suburban Hymns", initials: "SH" },
        { name: "Blues At Dawn", initials: "BD" },
        { name: "Blue Grass Time", initials: "BT" },
        { name: "Hot Wax", initials: "HW" },
        { name: "A Visual Sound", initials: "VS" },
        { name: "The Golden Ratio", initials: "GR" },
        { name: "Creature Central", initials: "CC" }
    ];

    const gradients = [
        'from-[#df0781] to-[#af04ab]',
        'from-[#9800e0] to-[#52a1fc]',
        'from-[#3b00fc] to-[#8febfe]',
        'from-[#8bfa00] to-[#eebc00]',
        'from-[#df2331] to-[#f8e700]',
        'from-[#af04ab] to-[#3b00fc]',
        'from-[#8febfe] to-[#8bfa00]',
        'from-[#eebc00] to-[#df0781]'
    ];

    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Populate DJs
    if (djContainer) {
        const shuffledDJs = shuffle(djs);
        const doubledDJs = [...shuffledDJs, ...shuffledDJs];
        
        djContainer.innerHTML = doubledDJs.map((dj, index) => {
            const isDJx = dj.name === 'DJx';
            const grad = gradients[(index + Math.floor(Math.random() * gradients.length)) % gradients.length];
            const linkHref = 'djx.html';
            
            return `
                <a href="${linkHref}" class="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer">
                    <div class="w-24 h-24 rounded-full bg-gradient-to-tr ${grad} flex items-center justify-center text-white font-bold text-2xl border-2 border-zinc-800 group-hover:border-white transition-all transform group-hover:scale-105 shadow-md overflow-hidden">
                        ${isDJx ? `<img src="dj.png" alt="DJx Avatar" class="w-full h-full object-cover">` : dj.initials}
                    </div>
                    <span class="text-xs font-swiss text-zinc-400 group-hover:text-white transition-colors truncate max-w-[100px] text-center">
                        ${dj.name}
                    </span>
                </a>
            `;
        }).join('');
    }

    // Populate Shows
    if (showContainer) {
        const shuffledShows = shuffle(shows);
        const doubledShows = [...shuffledShows, ...shuffledShows];
        
        showContainer.innerHTML = doubledShows.map((show, index) => {
            const grad = gradients[(index + Math.floor(Math.random() * gradients.length)) % gradients.length];
            return `
                <a href="programX.html" class="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer">
                    <div class="w-24 h-24 rounded-2xl bg-gradient-to-tr ${grad} flex items-center justify-center text-white font-bold text-2xl border-2 border-zinc-800 group-hover:border-white transition-all transform group-hover:scale-105 shadow-md">
                        ${show.initials}
                    </div>
                    <span class="text-xs font-swiss text-zinc-400 group-hover:text-white transition-colors truncate max-w-[100px] text-center">
                        ${show.name}
                    </span>
                </a>
            `;
        }).join('');
    }
}

// Dynamic On Air Show logic
let cachedSchedule = null;

async function updateOnAirShow() {
    const showTitleEl = document.querySelector('.fixed.bottom-0 .font-swiss.font-bold.text-lg.tracking-tight');
    if (!showTitleEl) return;

    try {
        if (!cachedSchedule) {
            const res = await fetch('schedule.json');
            if (!res.ok) throw new Error("Failed to fetch schedule");
            cachedSchedule = await res.json();
        }

        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const currentDay = days[now.getDay()];
        const currentHour = now.getHours() + now.getMinutes() / 60;

        const daySchedule = cachedSchedule[currentDay] || [];
        const activeShows = [];

        daySchedule.forEach(slot => {
            const range = parseTimeRange(slot.time);
            if (!range) return;

            const { startHour, endHour } = range;
            let inRange = false;

            if (endHour < startHour) {
                // Spans across midnight (e.g. 10pm - 2am)
                inRange = (currentHour >= startHour || currentHour < endHour);
            } else {
                inRange = (currentHour >= startHour && currentHour < endHour);
            }

            if (inRange) {
                activeShows.push(slot.title);
            }
        });

        if (activeShows.length > 0) {
            // Deduplicate in case the same show is listed multiple times
            const uniqueShows = [...new Set(activeShows)];
            showTitleEl.textContent = uniqueShows.join(' / ');
        } else {
            showTitleEl.textContent = "WUSB Music Library";
        }

    } catch (err) {
        console.error("Error updating on-air show:", err);
        if (!showTitleEl.textContent) {
            showTitleEl.textContent = "WUSB Programming";
        }
    }
}

function parseTimeRange(timeStr) {
    const parts = timeStr.toLowerCase().replace(/\s+/g, '').split('-');
    if (parts.length !== 2) return null;
    
    let startPart = parts[0];
    let endPart = parts[1];
    
    // Parse end time
    const endMatch = endPart.match(/^(\d+)(?::(\d+))?(am|pm)$/);
    if (!endMatch) return null;
    let endVal = parseInt(endMatch[1], 10);
    let endMin = endMatch[2] ? parseInt(endMatch[2], 10) : 0;
    const endAmpm = endMatch[3];
    
    // Convert end to decimal 24h
    let endHour = endVal + endMin / 60;
    if (endAmpm === 'pm' && endVal !== 12) endHour += 12;
    if (endAmpm === 'am' && endVal === 12) endHour = endMin / 60;
    
    // Parse start time
    let startVal, startMin, startAmpm;
    const startMatch = startPart.match(/^(\d+)(?::(\d+))?(am|pm)$/);
    if (startMatch) {
        startVal = parseInt(startMatch[1], 10);
        startMin = startMatch[2] ? parseInt(startMatch[2], 10) : 0;
        startAmpm = startMatch[3];
    } else {
        const startNumMatch = startPart.match(/^(\d+)(?::(\d+))?$/);
        if (!startNumMatch) return null;
        startVal = parseInt(startNumMatch[1], 10);
        startMin = startNumMatch[2] ? parseInt(startNumMatch[2], 10) : 0;
        startAmpm = endAmpm; // fallback to end indicator
    }
    
    // Convert start to decimal 24h
    let startHour = startVal + startMin / 60;
    if (startAmpm === 'pm' && startVal !== 12) startHour += 12;
    if (startAmpm === 'am' && startVal === 12) startHour = startMin / 60;
    
    return { startHour, endHour };
}

// Start sequence
document.addEventListener('DOMContentLoaded', () => {
    initLogic();
    initSchedule();
    initCarousels();
    initSPANavigation();
    updateOnAirShow();
    setInterval(updateOnAirShow, 60000); // Check/update every minute
});
