const fs = require('fs');

const scheduleData = JSON.parse(fs.readFileSync('schedule.json', 'utf-8'));
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Colors for styling shows
const colors = ["#df0781", "#8bfa00", "#52a1fc", "#f8e700", "#9800e0", "#df2331", "#eebc00", "#8febfe", "#af04ab", "#3b00fc", "#a91b00"];

function getColor(dayIndex, showIndex) {
    return colors[(dayIndex * 3 + showIndex) % colors.length];
}

let html = `<!DOCTYPE html>
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
        }
        .schedule-table {
            border-collapse: separate;
            border-spacing: 2px;
            min-width: 1200px;
        }
        .schedule-table th {
            background-color: var(--color-zinc-900);
            padding: 1rem;
            text-align: left;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .schedule-table td {
            background-color: rgba(24, 24, 27, 0.4);
            padding: 0.5rem;
            vertical-align: top;
            border: 1px solid var(--color-zinc-800);
            transition: background-color 0.2s;
        }
        .schedule-table td:hover {
            background-color: var(--color-zinc-900);
        }
        .show-item {
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            border-left: 3px solid #df0781;
            background: rgba(0,0,0,0.2);
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

    <!-- HEADER SECTION -->
    <header class="border-b-4 border-zinc-900 sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
                
                <!-- Logo Area -->
                <a href="index.html" class="flex items-end gap-3 cursor-pointer group">
                    <h1 class="font-chuck text-6xl md:text-8xl leading-none wusb-gradient transform group-hover:scale-105 transition-transform duration-200">
                        WUSB
                    </h1>
                    <span class="font-swiss font-bold text-3xl md:text-5xl tracking-tighter mb-1 md:mb-2 text-white">
                        90.1 FM
                    </span>
                </a>

                <!-- Desktop Sub Menu (Now in Top Bar) -->
                <nav class="hidden lg:flex items-center gap-6">
                    <a href="about.html" class="font-swiss font-bold text-lg uppercase tracking-tight hover:text-[#8febfe] transition-colors">About</a>
                    <a href="#underwriting" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">Underwriting</a>
                    <a href="#wusb-requests" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">WUSB Requests</a>
                    <a href="#eeo-report" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">EEO Report</a>
                    <a href="#contact" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">Contact</a>
                </nav>

                <!-- Mobile Menu Toggle -->
                <div class="lg:hidden flex items-center gap-4">
                    <button id="mobile-theme-toggle" class="text-white hover:text-[#8febfe] transition-colors focus:outline-none" aria-label="Toggle theme">
                        <i id="mobile-icon-sun" data-lucide="sun" class="w-6 h-6"></i>
                        <i id="mobile-icon-moon" data-lucide="moon" class="w-6 h-6 hidden"></i>
                    </button>
                    <button id="mobile-menu-btn" class="text-white focus:outline-none">
                        <i id="icon-menu" data-lucide="menu" class="w-9 h-9"></i>
                        <i id="icon-x" data-lucide="x" class="w-9 h-9 hidden"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Desktop Main Menu (Now in Bottom Bar) -->
        <div class="hidden lg:block bg-zinc-900/50 border-t border-zinc-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
                <div class="flex gap-8 items-center">
                    <a href="schedule.html" class="font-swiss font-bold text-xl uppercase tracking-tight text-[#8febfe] transition-colors">Schedule</a>
                    <a href="#sports" class="font-swiss font-bold text-xl uppercase tracking-tight hover:text-[#8febfe] transition-colors">Sports</a>
                    <a href="#playlists" class="font-swiss font-bold text-xl uppercase tracking-tight hover:text-[#8febfe] transition-colors">Playlists</a>
                    <a href="#wusb-public-file" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">Public File</a>
                    <a href="#create-content" class="font-swiss text-sm font-medium tracking-wide text-zinc-400 hover:text-white whitespace-nowrap transition-colors">Create content</a>
                </div>
                
                <div class="flex items-center gap-6">
                    <button id="theme-toggle" class="text-white hover:text-[#8febfe] transition-colors focus:outline-none" aria-label="Toggle theme">
                        <i id="icon-sun" data-lucide="sun" class="w-6 h-6"></i>
                        <i id="icon-moon" data-lucide="moon" class="w-6 h-6 hidden"></i>
                    </button>
                    <button class="font-chuck text-2xl px-6 py-2 rounded text-[#000] pledge-gradient transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,250,0,0.4)] transition-all duration-200">
                        PLEDGE
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <div id="mobile-menu" class="hidden lg:hidden absolute top-full left-0 w-full bg-zinc-900 border-b-4 border-zinc-800 flex flex-col">
            <div class="flex flex-col p-4 gap-4 border-b border-zinc-800">
                <a href="about.html" class="font-swiss font-bold text-2xl uppercase tracking-tight text-white hover:text-[#8febfe]">About</a>
                <a href="schedule.html" class="font-swiss font-bold text-2xl uppercase tracking-tight text-[#8febfe]">Schedule</a>
                <a href="#sports" class="font-swiss font-bold text-2xl uppercase tracking-tight text-white hover:text-[#8febfe]">Sports</a>
                <a href="#playlists" class="font-swiss font-bold text-2xl uppercase tracking-tight text-white hover:text-[#8febfe]">Playlists</a>
                <button class="font-chuck text-2xl px-6 py-3 mt-2 rounded text-[#000] pledge-gradient w-full text-center">
                    PLEDGE
                </button>
            </div>
            <div class="flex flex-col p-4 gap-3 bg-zinc-950">
                <a href="#underwriting" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">Underwriting</a>
                <a href="#wusb-requests" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">WUSB Requests</a>
                <a href="#eeo-report" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">EEO Report</a>
                <a href="#wusb-public-file" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">WUSB Public File</a>
                <a href="#contact" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">Contact</a>
                <a href="#create-content" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">Create content</a>
                <a href="#stream-help" class="font-swiss text-sm tracking-wide text-zinc-400 hover:text-white">Stream Help</a>
            </div>
        </div>
    </header>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-zinc-800 pb-4 mb-8 gap-6">
            <div>
                <h2 class="font-swiss font-bold text-4xl md:text-5xl uppercase tracking-tighter">Weekly Schedule</h2>
                <p class="text-zinc-500 font-swiss font-bold text-sm tracking-widest mt-2 uppercase">Spring 2026 Season</p>
            </div>
            
            <!-- Day Selector Tabs -->
            <div class="flex bg-zinc-900 p-1 rounded-sm overflow-x-auto no-scrollbar max-w-full">
                <button class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Sun</button>
                <button class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Mon</button>
                <button class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest text-[#8bfa00] bg-zinc-800">Tue</button>
                <button class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Wed</button>
                <button class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Thu</button>
                <button class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Fri</button>
                <button class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Sat</button>
                <button class="px-4 py-2 font-swiss text-xs font-bold uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Full Week</button>
            </div>
        </div>

        <!-- Schedule Table -->
        <div class="schedule-container bg-zinc-950 border border-zinc-800 rounded-sm mb-24">
            <table class="schedule-table w-full">
                <thead>
                    <tr class="font-swiss font-bold text-xs uppercase tracking-widest text-zinc-400">
                        <th class="border-r border-zinc-800">Sunday</th>
                        <th class="border-r border-zinc-800">Monday</th>
                        <th class="current-day border-r border-zinc-800 bg-zinc-900/80">Tuesday</th>
                        <th class="border-r border-zinc-800">Wednesday</th>
                        <th class="border-r border-zinc-800">Thursday</th>
                        <th class="border-r border-zinc-800">Friday</th>
                        <th>Saturday</th>
                    </tr>
                </thead>
                <tbody class="font-swiss">
                    <tr>
`;

// To simplify the display, we will render a single row where each day has all its shows in a column.
days.forEach((day, dayIndex) => {
    let bgClass = day === 'Tuesday' ? 'bg-zinc-900/30 current-day' : '';
    html += "\n                        <td class=\"border-r border-zinc-800 " + bgClass + "\">";
    const shows = scheduleData[day];
    shows.forEach((show, showIndex) => {
        const color = getColor(dayIndex, showIndex);
        html += "\n                            <div class=\"show-item\" style=\"border-left-color: " + color + ";\">\n                                <span class=\"show-time\">" + show.time + "</span>\n                                <span class=\"show-title\">" + show.title + "</span>\n                                " + (show.is_alt ? "<div class=\"alt-show\">-ALT-</div>" : "") + "\n                            </div>";
    });
    html += "\n                        </td>";
});

html += `
                    </tr>
                </tbody>
            </table>
        </div>
    </main>

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
    </div>

    <!-- JAVASCRIPT LOGIC -->
    <script src="script.js"></script>
</body>
</html>`;

fs.writeFileSync('schedule.html', html);
console.log('Successfully generated schedule.html from schedule.json');
