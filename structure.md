# WUSB Proof of Concept - Project Structure

This document outlines the purpose of each file in the directory. The files are divided into categories, clearly indicating which files are part of the active website and which are utility or legacy scripts no longer in active use.

## 🟢 Actively Used Files (Core Application)
These files make up the actual HTML/CSS/JS frontend that users interact with.

* **`index.html`** - The homepage of the WUSB Proof of Concept.
* **`about.html`** - The "About Us" page.
* **`contact.html`** - The "Contact" page.
* **`playlists.html`** - The directory page for recent program playlists.
* **`schedule.html`** - The interactive grid schedule page.
* **`underwriting.html`** - The underwriting information page.
* **`wusbpublicfile.html`** - The FCC Online Public Inspection File information page.
* **`style.css`** - The main stylesheet containing custom CSS utilities, scrollbar hiding, marquee scrolling keyframes, and gradient text definitions complementing Tailwind.
* **`script.js`** - The core client-side JavaScript handling the mobile menu, theme toggling (light/dark mode), and radio player UI logic.
* **`Underwritingbanner.png`** - Image asset displayed on the underwriting page.

## 📘 Documentation & Guidelines
* **`README.md`** - General project documentation.
* **`components.md`** - Modular component breakdown detailing machine names, fields, and Drupal SDC-ready mappings.
* **`agentInstructions.md`** - Technical instructions and best practices for developers and agents working on this project.

## 🟡 Reference Data & Component Snippets
These files were used to store raw data or component markup. Now that components are statically compiled into the HTML files, these act primarily as reference materials.

* **`header.html`** - The isolated markup for the main navigation header.
* **`player.html`** - The isolated markup for the sticky bottom radio player.
* **`playlistContent.html`** - Raw HTML scraped or exported from the original site to be parsed into the `playlists.html` structure.
* **`schedule.json`** - Parsed structured data representing the radio schedule, used by scripts to generate `schedule.html`.

## 🔴 Inactive / Utility Scripts (Not Actively Used)
The following files are **not** actively used by the running website. They are Node.js, Python, or temporary test scripts created to automate refactoring, scrape data, or generate HTML structures. They can be safely ignored when viewing the live site.

**Parsing & Scraping Scripts:**
* **`parse_schedule.py` / `parse_schedule.js` / `test_parse.js`** - Scripts used to scrape and parse original text/HTML schedules into structured data (`schedule.json`).
* **`parse_playlists.js`** - Script to extract playlist information from `playlistContent.html`.

**HTML Generation & Injection Scripts:**
* **`generate_schedule.js` / `generate_grid_schedule.js`** - Scripts that consumed `schedule.json` to programmatically build the complex HTML grid found in `schedule.html`.
* **`update_menus.js`** - Script used to perform bulk updates to the navigation links across all HTML files.
* **`modularize.js`** / **`components.js`** - Old scripts used to dynamically inject or manage components before the architecture shifted back to SSR-friendly static compilation.

**Recent Refactoring & Fix Scripts (Run once and discarded):**
* **`fix_all.js`** - Script used to re-inject `header.html` and `player.html` back into the main pages wrapped in boundary comments.
* **`fix_css_vars.js`** - Script used to replace hardcoded inline Tailwind colors with dynamic CSS variables (`--card-color`).
* **`fix_index.js`** - Script used specifically to fix CSS variable applications on the homepage.
* **`fix_script.js`** - Script used to strip the old component loader logic from the main `script.js` file.
* **`fix_components.js` / `fix_components2.js` / `fix_light_mode.js` / `fix_grid_height.js` / `fix_generate_grid_schedule.js`** - Various older scripts written to perform bulk search-and-replace fixes for UI bugs.
* **`test_style_grep.js` / `test_playlist_structure.js` / `test_playlist_structure2.js`** - Temporary debugging scripts used to inspect file contents during recent refactoring.

**Other:**
* **`Playlist/`** - An unused or empty directory left over from previous data parsing.
