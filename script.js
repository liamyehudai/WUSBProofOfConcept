
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

// Start sequence
document.addEventListener('DOMContentLoaded', () => {
    initLogic();
    initSchedule();
});
