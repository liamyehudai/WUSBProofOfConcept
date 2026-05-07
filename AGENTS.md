# WUSB Drupal Architecture Prototype

This document outlines the proposed Drupal 10/11 architecture based on the HTML/CSS/JS prototypes.

## 1. Content Types (Node Entities)

*   **Basic Page (`page`)**
    *   **Usage:** Static informational pages like "About WUSB", "Contact", "EEO Report", "Underwriting".
    *   **Fields:** Body (Rich Text).

*   **Article / Transmission (`article`)**
    *   **Usage:** News posts, music reviews, event announcements (the cards on the homepage).
    *   **Fields:**
        *   Title
        *   Body (Rich Text)
        *   Category (Taxonomy Reference: Music, Station News, Reviews, Events, etc.)
        *   Image (Media Reference)
        *   Date (Date field)

*   **Playlist (`playlist`)**
    *   **Usage:** Tracklists and show notes submitted by DJs for their specific broadcasts.
    *   **Fields:**
        *   Title (e.g., "With The Beatles playlist for 05/07/2026")
        *   Body (Rich Text for show notes and tracklists)
        *   Program/Show Reference (Entity Reference to the related `show` node)
        *   Author/DJ Reference (Entity Reference to the User/DJ Profile)
        *   Date/Time of Broadcast

*   **Show (`show`)** *(Sidequest)*
    *   **Usage:** Individual radio shows.
    *   **Fields:** Show Name, Description, DJ (Entity Reference to User/DJ profile), Genre, Schedule Time.

*   **DJ Profile (`dj_profile`)** *(Sidequest)*
    *   **Usage:** Profiles for the radio hosts. Can be a custom Content Type or user profile fields.

## 2. Taxonomy (Vocabularies)

*   **Transmission Categories:** Music, Station News, Reviews, Events, Editorial, Charts. Used to color-code and filter the blog grid on the homepage.
*   **Genres:** Indie, Punk, Jazz, Electronic, etc.

## 3. Blocks & Regions

*   **Header Region**
    *   **Site Branding Block:** The WUSB Logo and 90.1 FM text.
    *   **Main Navigation Block:** About, Schedule, Sports, Playlists, Pledge button.
    *   **Theme Toggle Block:** Custom block containing the Sun/Moon toggle.
*   **Sub-Header Region**
    *   **Secondary Navigation Block:** Underwriting, Requests, EEO Report, etc.
*   **Footer / Bottom Region**
    *   **Radio Player Block:** The sticky bottom player containing play/pause logic and volume controls. This should likely be a custom block type or integrated directly into the theme's `page.html.twig` to persist across page loads (or use decoupled/headless architecture to keep it truly persistent).

## 4. Views

*   **Latest Transmissions View**
    *   **Display Type:** Grid of unformatted list or teasers.
    *   **Filter:** Content type = Article, Published = Yes.
    *   **Sort:** Authored on (Descending).
    *   **Location:** Homepage main content area.

*   **Recent Playlists View**
    *   **Display Type:** Unformatted list of teasers (vertical feed).
    *   **Filter:** Content type = Playlist, Published = Yes.
    *   **Sort:** Broadcast Date (Descending).
    *   **Location:** Playlists page (`/playlists`).

## 5. Theme Structure

*   **Tailwind CSS:** Integrated via a build process (e.g., using Webpack or Vite) rather than CDN in production. The `tailwind.config.js` will map to the defined CSS variables for theming.
*   **Libraries (`wusb.libraries.yml`)**:
    *   `global-styling`: Loads `style.css`.
    *   `global-scripts`: Loads `script.js` (wrapped in Drupal behaviors).
    *   `lucide-icons`: Loads the Lucide SVG icon library.

## 6. JavaScript Behaviors

In Drupal, JavaScript should be wrapped in `Drupal.behaviors` to ensure it attaches properly when content is loaded via AJAX (e.g., Views infinite scroll or BigPipe). See `script.js` for mapping.