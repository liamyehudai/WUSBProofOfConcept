# WUSB 90.1 FM - Proof of Concept Website

A modern, responsive, and high-fidelity frontend proof of concept for the WUSB 90.1 FM (Stony Brook University Free-Form Radio) website. This prototype showcases premium dark/light themes, smooth responsive layouts, and interactive calendar/media components built with HTML5, CSS3, and Tailwind CSS.

## 🚀 Live Demo (GitHub Pages)

You can explore the live, fully interactive prototype deployed on GitHub Pages here:
👉 **[WUSB Proof of Concept Live Site](https://liamyehudai.github.io/WUSBProofOfConcept/)**

---

## 🛠️ Key Features

### 📅 1. Interactive Schedule Grid & Controls
*   **Dynamic Day Filtering Tabs:** Instantly toggle between single-day views (e.g., Tuesday, Wednesday) and the "Full Week" view. Selecting an individual day hides unrelated columns, scaling the table dynamically for clean mobile and desktop layouts.
*   **Week Range Navigation:** Step forward or backward through weeks using chevron controls, which automatically compute and display the calendar week range (e.g., `Week of Jun 1, 2026 - Jun 7, 2026`).
*   **Jump to Today:** One-click reset to today's date, which automatically highlights the current day's broadcast columns and switches to today's tab view.
*   **Date Lookup Search:** Select or type any date into the input field to center the calendar focus on that specific historical or future week block.

### 📻 2. Standalone Archive Player (`player.html`)
*   **Show Archive Integration:** Every show card on the schedule has a play button. Clicking it takes the user to the standalone player page, passing the specific show's metadata through URL query parameters.
*   **Double-Format Query System:** Generates both the traditional WUSB day-of-week block archive string (e.g., `6Sat-0900` representing Saturday's 9:00 AM block) and the new date format (`0900-06-06-2026` representing time, day, month, year).
*   **Cassette Reel Visualizer:** Features a retro-futuristic cassette tape deck animation that spins during playback.
*   **Mock Player Controls:** Fully interactive Play/Pause, Rewind/Fast-Forward 10s buttons, track timeline slider, and a volume slider.

### 🌓 3. System-Wide Dark & Light Themes
*   Features a premium, high-contrast dark aesthetic that transitions into a clean light aesthetic at the click of the header toggle.
*   Syncs preferences automatically to `localStorage` for cross-page persistence.

### 🎡 4. Conveyor Belt Carousel
*   **Opposing Marquees:** Two horizontal marquee bands below the cards feed that slowly auto-scroll in opposite directions. The Featured DJs row scrolls right-to-left, while the On Air Programs row scrolls left-to-right.
*   **Vibrant Profile Badges:** DJ icons are rendered as large circle avatars (`w-24 h-24`), and On Air Shows are rounded squares. Badges feature bold, stylized initials centered over high-fidelity gradients that sync automatically with dark and light themes.
*   **Order Randomization:** Shuffles DJ and Show arrays dynamically on page load to keep the homepage layout fresh and engaging.
*   **Hover-to-Pause:** Seamlessly pauses the marquee movement when the user hovers over an icon, allowing for easy selection and click-through to DJ playlists or schedule entries.

### 🔍 5. Searchable DJ Directory (`djs.html`)
*   **Status & Alphabetical Sorting:** Automatically displays active host DJs first (marked with pulsing neon status badges), followed by inactive DJs sorted alphabetically.
*   **Real-time Search Filter:** Instantly filters DJ profiles in a fully responsive grid as the user types.
*   **Cohesive Aesthetic:** Adapts beautifully to dark and light mode variable shifts, utilizing stable gradient profiles for each card avatar.

---

## 📂 Project Structure

*   `index.html` - Brand homepage featuring the Hero Banner and recent news feed.
*   `about.html` - Stony Brook station history and info page.
*   `contact.html` - Request, general feedback, and contact details.
*   `schedule.html` - Interactive programming grid.
*   `playlists.html` - Directory of DJ playlist logs.
*   `djs.html` - Searchable and filterable DJ profiles directory page.
*   `underwriting.html` - Station support and sponsorship information.
*   `wusbpublicfile.html` - FCC public inspection files checklist.
*   `style.css` - Custom styles, layout variables, and typography defaults.
*   `script.js` - Dynamic DOM scripting, mobile menus, theme syncing, schedule column solvers, and navigation event hooks.
*   `components.md` - Modular breakdown of elements for future migration to Drupal 10/11 Single Directory Components (SDC).

---

## ⚙️ Running Locally

Since the site is built on standard static HTML, CSS, and JS, you can run it locally without a compilation step:

1.  **Direct File Execution:** Double-click `index.html` to open it in your browser.
2.  **Local Static Server:** For the best experience (ensuring proper protocol execution and pathing), launch a static server in the root directory:
    ```bash
    # Using python
    python -m http.server 8000
    
    # Or using node
    npx serve .
    ```
    Then visit `http://localhost:8000` or `http://localhost:3000` in your web browser.