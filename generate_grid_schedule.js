const fs = require('fs');

const scheduleData = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'));
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const colors = ["#df0781", "#8bfa00", "#52a1fc", "#f8e700", "#9800e0", "#df2331", "#eebc00", "#8febfe", "#af04ab", "#3b00fc", "#a91b00"];

let colorIndex = 0;
function getNextColor() {
    let c = colors[colorIndex % colors.length];
    colorIndex++;
    return c;
}

function parseTime(timeStr) {
    timeStr = timeStr.toLowerCase().replace(/\s/g, '');
    let parts = timeStr.split('-');
    
    let endAmPm = parts[1].includes('am') ? 'am' : (parts[1].includes('pm') ? 'pm' : 'am');
    let startAmPm = parts[0].includes('am') ? 'am' : (parts[0].includes('pm') ? 'pm' : null);
    
    if (!startAmPm) {
        if (endAmPm === 'pm') {
            let startH = parseInt(parts[0].split(':')[0]);
            let endH = parseInt(parts[1].split(':')[0]);
            if (startH === 12) startAmPm = 'pm';
            else if (startH > endH && endH !== 12) startAmPm = 'am';
            else startAmPm = 'pm';
        } else {
            let startH = parseInt(parts[0].split(':')[0]);
            if (startH === 12) startAmPm = 'am';
            else startAmPm = 'am';
        }
    }
    
    function parsePart(p, defaultAmPm) {
        let ampm = p.includes('am') ? 'am' : (p.includes('pm') ? 'pm' : defaultAmPm);
        p = p.replace('am', '').replace('pm', '');
        let [hours, mins] = p.split(':');
        hours = parseInt(hours);
        mins = mins ? parseInt(mins) : 0;
        
        if (ampm === 'pm' && hours !== 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;
        
        return hours * 2 + (mins === 30 ? 1 : 0);
    }
    
    let startSlot = parsePart(parts[0], startAmPm);
    let endSlot = parsePart(parts[1], endAmPm);
    
    if (endSlot === 0 && startSlot > 0) {
        endSlot = 48;
    }
    
    return { start: startSlot, end: endSlot };
}

const grid = {};

for (let day of days) {
    let dayCells = new Array(48).fill(null);
    let shows = scheduleData[day];
    
    shows.forEach(show => {
        let times = parseTime(show.time);
        let start = times.start;
        let end = times.end;
        if (start === end) end++;
        
        if (start >= 48) return; // ignore out of bounds
        
        let length = end - start;
        
        if (!dayCells[start] || dayCells[start].skip) {
            dayCells[start] = { shows: [], rowspan: length };
        } else {
            dayCells[start].rowspan = Math.max(dayCells[start].rowspan, length);
        }
        
        show.color = getNextColor();
        dayCells[start].shows.push(show);
        
        // mark skipped slots
        for (let i = start + 1; i < start + dayCells[start].rowspan; i++) {
            if (i < 48) dayCells[i] = { skip: true };
        }
    });
    
    for (let i = 0; i < 48; i++) {
        if (!dayCells[i]) {
            dayCells[i] = { shows: [], rowspan: 1 };
        }
    }
    grid[day] = dayCells;
}

let rowsHtml = "";
for (let i = 0; i < 48; i++) {
    rowsHtml += "                    <tr>\n";
    
    // Time column
    if (i % 2 === 0) {
        let hour = i / 2;
        let ampm = hour < 12 ? 'AM' : 'PM';
        let displayHour = hour % 12;
        if (displayHour === 0) displayHour = 12;
        rowsHtml += `                        <td class="text-zinc-500 text-xs font-bold border-r border-zinc-800 bg-zinc-900/20 text-center align-middle w-16" style="border-bottom: none;">${displayHour} ${ampm}</td>\n`;
    } else {
        rowsHtml += `                        <td class="text-zinc-500 text-xs font-bold border-r border-zinc-800 bg-zinc-900/20 text-center align-middle w-16" style="border-bottom: 1px solid var(--color-zinc-800);"></td>\n`;
    }
    
    for (let day of days) {
        let cell = grid[day][i];
        if (cell.skip) continue;
        
        let bgClass = day === 'Tuesday' ? 'bg-zinc-900/30 current-day' : '';
        
        if (cell.shows.length === 0) {
            rowsHtml += `                        <td data-day="${day}" rowspan="${cell.rowspan}" class="border-r border-zinc-800 border-b border-zinc-800 ${bgClass}"></td>\n`;
        } else {
            rowsHtml += `                        <td data-day="${day}" rowspan="${cell.rowspan}" class="border-r border-zinc-800 border-b border-zinc-800 ${bgClass} p-0">\n`;
            rowsHtml += `                            <div class="show-container">\n`;
            cell.shows.forEach((show) => {
                rowsHtml += `                                <div class="show-item" style="border-left-color: ${show.color};">
                                    <span class="show-time">${show.time}</span>
                                    <a href="programX.html" class="show-title hover:text-[#8febfe] transition-colors hover:underline decoration-1 underline-offset-2">${show.title}</a>
                                    ${show.is_alt ? '<div class="alt-show">-ALT-</div>' : ''}
                                </div>\n`;
            });
            rowsHtml += `                            </div>\n`;
            rowsHtml += `                        </td>\n`;
        }
    }
    
    rowsHtml += "                    </tr>\n";
}

let template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schedule | WUSB 90.1 FM</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
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
      }
    </script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="style.css">
    <style>
        /* Custom styles for the schedule table to handle the density */
        .schedule-container {
            overflow-x: auto;
            max-height: 80vh; /* make it scrollable */
        }
        .schedule-table {
            border-collapse: collapse; /* change to collapse to avoid gaps */
            min-width: 1200px;
        }
        .schedule-table th {
            background-color: var(--color-zinc-900);
            padding: 1rem;
            text-align: left;
            position: sticky;
            top: 0;
            z-index: 10;
            border-bottom: 2px solid var(--color-zinc-800);
        }
        .schedule-table tr {
            height: 60px; /* Guarantee a minimum height for every 30-minute row */
        }
        .schedule-table td {
            background-color: rgba(24, 24, 27, 0.4);
            padding: 0;
            vertical-align: top;
            transition: background-color 0.2s;
            height: 1px; /* Magic trick for full height children in tables */
        }
        .schedule-table td:hover {
            background-color: var(--color-zinc-900);
        }
        .show-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 4px;
            gap: 4px;
        }
        .show-item {
            flex: 1;
            padding: 0.5rem;
            border-left: 4px solid #df0781;
            background: rgba(0,0,0,0.3);
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 50px; /* Ensure text is always legible */
        }
        .show-time {
            font-size: 0.7rem;
            color: #a1a1aa;
            font-weight: bold;
            display: block;
            margin-bottom: 2px;
        }
        .show-title {
            font-weight: bold;
            font-size: 0.9rem;
            line-height: 1.2;
            color: #fff;
        }
        .alt-show {
            font-size: 0.65rem;
            color: #df2331;
            font-weight: bold;
            margin-top: 2px;
        }
        .current-day {
            border: 2px solid #8bfa00 !important;
        }
    </style>
</head>
<body class="bg-black text-white font-sans selection:bg-[#df0781] selection:text-white flex flex-col min-h-screen">

    <!-- COMPONENT: header.html -->\n    <div id="header-placeholder"></div>\n    

    <!-- MAIN CONTENT AREA -->
    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <!-- Section Header -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-2 border-zinc-800 pb-4 mb-8 gap-6">
            <div>
                <h2 class="font-swiss font-bold text-4xl md:text-5xl uppercase tracking-tighter">Weekly Schedule</h2>
                <p class="text-zinc-500 font-swiss font-bold text-sm tracking-widest mt-2 uppercase">Spring 2026 Season</p>
            </div>
            
            <!-- Date Search and Day Selector -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                <!-- Date Picker Input Component -->
                <div class="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm px-3 py-2 gap-2 text-zinc-400 focus-within:border-[#8febfe] transition-colors">
                    <i data-lucide="calendar" class="w-4 h-4 text-zinc-400"></i>
                    <input type="date" id="schedule-date-picker" class="bg-transparent text-white font-swiss text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer border-none" style="color-scheme: dark;" />
                </div>

                <!-- Day Selector Tabs -->
                <div id="day-selector" class="flex bg-zinc-900 p-1 rounded-sm overflow-x-auto no-scrollbar max-w-full">
                    <button data-filter="Sunday" class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Sun</button>
                    <button data-filter="Monday" class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Mon</button>
                    <button data-filter="Tuesday" class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Tue</button>
                    <button data-filter="Wednesday" class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Wed</button>
                    <button data-filter="Thursday" class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Thu</button>
                    <button data-filter="Friday" class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Fri</button>
                    <button data-filter="Saturday" class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Sat</button>
                    <button data-filter="all" class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest text-[#8bfa00] bg-zinc-800">Full Week</button>
                </div>
            </div>
        </div>

        <!-- Date Info Alert -->
        <div id="date-info-display" class="hidden bg-zinc-900/40 border border-zinc-800 rounded p-4 mb-6 flex items-center justify-between">
            <span class="font-swiss text-sm text-zinc-300">
                Viewing schedule for <strong id="date-info-day" class="text-white">Tuesday</strong> (<span id="date-info-formatted" class="text-zinc-400">July 1, 2026</span>)
            </span>
            <button id="clear-date-btn" class="text-xs font-swiss font-bold uppercase tracking-widest text-[#df0781] hover:text-white transition-colors">
                Show Full Week
            </button>
        </div>

        <!-- Schedule Table -->
        <div class="schedule-container bg-zinc-950 border border-zinc-800 rounded-sm mb-24">
            <table class="schedule-table w-full relative">
                <thead>
                    <tr class="font-swiss font-bold text-xs uppercase tracking-widest text-zinc-400">
                        <th class="w-16 border-r border-zinc-800 text-center">Time</th>
                        <th data-day="Sunday" class="border-r border-zinc-800 text-center">Sunday</th>
                        <th data-day="Monday" class="border-r border-zinc-800 text-center">Monday</th>
                        <th data-day="Tuesday" class="current-day border-r border-zinc-800 bg-zinc-900/80 text-center">Tuesday</th>
                        <th data-day="Wednesday" class="border-r border-zinc-800 text-center">Wednesday</th>
                        <th data-day="Thursday" class="border-r border-zinc-800 text-center">Thursday</th>
                        <th data-day="Friday" class="border-r border-zinc-800 text-center">Friday</th>
                        <th data-day="Saturday" class="text-center">Saturday</th>
                    </tr>
                </thead>
                <tbody class="font-swiss">
${rowsHtml}
                </tbody>
            </table>
        </div>
    </main>

    <!-- COMPONENT: player-sticky -->
    <div id="player-placeholder"></div>

    <!-- JAVASCRIPT LOGIC -->
    <script src="script.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const tabs = document.querySelectorAll('#day-selector button');
            const tableCells = document.querySelectorAll('.schedule-table th[data-day], .schedule-table td[data-day]');
            const datePicker = document.getElementById('schedule-date-picker');
            const dateInfoDisplay = document.getElementById('date-info-display');
            const dateInfoDay = document.getElementById('date-info-day');
            const dateInfoFormatted = document.getElementById('date-info-formatted');
            const clearDateBtn = document.getElementById('clear-date-btn');
            
            // Function to filter grid by day name
            function filterDay(dayName) {
                if (dayName === 'all') {
                    tableCells.forEach(cell => {
                        cell.style.display = '';
                    });
                } else {
                    tableCells.forEach(cell => {
                        if (cell.getAttribute('data-day') === dayName) {
                            cell.style.display = '';
                        } else {
                            cell.style.display = 'none';
                        }
                    });
                }
            }

            // Tab click handling
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => {
                        t.classList.remove('text-[#8bfa00]', 'bg-zinc-800');
                        t.classList.add('text-zinc-500', 'hover:text-white');
                    });
                    
                    tab.classList.remove('text-zinc-500', 'hover:text-white');
                    tab.classList.add('text-[#8bfa00]', 'bg-zinc-800');
                    
                    const filter = tab.getAttribute('data-filter');
                    filterDay(filter);
                    
                    // Reset date picker and hide banner if user manually clicks a weekday or Full Week
                    if (filter === 'all' || !datePicker.value) {
                        datePicker.value = '';
                        dateInfoDisplay.classList.add('hidden');
                    } else {
                        // Check if picker matches selected day; if not, clear it
                        const dateVal = datePicker.value;
                        if (dateVal) {
                            const date = new Date(dateVal + 'T00:00:00');
                            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                            const dayName = days[date.getDay()];
                            if (dayName !== filter) {
                                datePicker.value = '';
                                dateInfoDisplay.classList.add('hidden');
                            }
                        }
                    }
                });
            });

            // Date picker change handling
            datePicker.addEventListener('change', () => {
                const dateVal = datePicker.value;
                if (dateVal) {
                    const date = new Date(dateVal + 'T00:00:00');
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const dayName = days[date.getDay()];
                    
                    // Click matching day tab
                    const matchingTab = document.querySelector('#day-selector button[data-filter="' + dayName + '"]');
                    if (matchingTab) {
                        matchingTab.click();
                    }
                    
                    // Format display date
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const formatted = date.toLocaleDateString(undefined, options);
                    
                    dateInfoDay.textContent = dayName;
                    dateInfoFormatted.textContent = formatted.replace(dayName + ', ', '');
                    dateInfoDisplay.classList.remove('hidden');
                } else {
                    // Reset
                    const allTab = document.querySelector('#day-selector button[data-filter="all"]');
                    if (allTab) allTab.click();
                }
            });

            // Clear button handling
            clearDateBtn.addEventListener('click', () => {
                const allTab = document.querySelector('#day-selector button[data-filter="all"]');
                if (allTab) allTab.click();
            });
        });
    </script>
</body>
</html>`;

const headerHtml = fs.readFileSync('header.html', 'utf-8');
const playerStickyHtml = `<!-- COMPONENT: PLAYER -->
    <!-- STICKY BOTTOM RADIO PLAYER -->
    <div class="fixed bottom-0 left-0 w-full z-50">
        <div class="bg-zinc-950 border-t border-zinc-800 py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button id="play-pause-btn" class="w-12 h-12 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform focus:outline-none">
                    <i id="icon-play" data-lucide="play" class="w-6 h-6 ml-1 block fill-current"></i>
                    <i id="icon-pause" data-lucide="pause" class="w-6 h-6 hidden fill-current"></i>
                </button>
                <div class="hidden sm:block">
                    <div class="flex items-center gap-2">
                        <span class="relative flex h-3 w-3">
                            <span id="live-ping" class="hidden animate-ping absolute inline-flex h-full w-full rounded-full bg-[#df2331] opacity-75"></span>
                            <span id="live-dot" class="relative inline-flex rounded-full h-3 w-3 bg-zinc-600"></span>
                        </span>
                        <span class="font-swiss font-bold text-xs uppercase tracking-widest text-zinc-400">On Air Now</span>
                    </div>
                    <div class="font-swiss font-bold text-lg tracking-tight">The Underground Sound w/ DJ Void</div>
                </div>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center gap-2 mr-4">
                    <i data-lucide="volume-2" class="w-5 h-5 text-zinc-400"></i>
                    <div class="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div class="w-3/4 h-full bg-white"></div>
                    </div>
                </div>
                <button class="font-swiss font-bold text-sm border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-widest">
                    Listen Live
                </button>
            </div>
        </div>

        <!-- NEON COLOR STRIP -->
        <div class="flex h-4 w-full">
            <div class="flex-1 bg-[#df0781]"></div>
            <div class="flex-1 bg-[#af04ab]"></div>
            <div class="flex-1 bg-[#9800e0]"></div>
            <div class="flex-1 bg-[#8febfe]"></div>
            <div class="flex-1 bg-[#8bfa00]"></div>
            <div class="flex-1 bg-[#f8e700]"></div>
            <div class="flex-1 bg-[#eebc00]"></div>
            <div class="flex-1 bg-[#df2331]"></div>
            <div class="flex-1 bg-[#a91b00]"></div>
            <div class="flex-1 bg-[#52a1fc]"></div>
            <div class="flex-1 bg-[#3b00fc]"></div>
            <div class="flex-1 bg-[#badd00]"></div>
        </div>
    </div>`;

template = template.replace('<div id="header-placeholder"></div>', headerHtml);
template = template.replace('<div id="player-placeholder"></div>', playerStickyHtml);

fs.writeFileSync('schedule.html', template);
console.log('Successfully regenerated grided schedule.html');
