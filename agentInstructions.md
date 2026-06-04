
# WUSB Drupal Architecture Prototype

This document outlines the proposed Drupal 10/11 architecture based on the HTML/CSS/JS prototypes.

## 1. Content Types (Node Entities)

-   **Basic Page (`page`)**
    
    -   **Usage:** Static informational pages like "About WUSB", "Contact", "EEO Report", "Underwriting".
        
    -   **Fields:** Body (Rich Text).
        
-   **Article / Transmission (`article`)**
    
    -   **Usage:** News posts, music reviews, event announcements (the cards on the homepage).
        
    -   **Fields:**
        
        -   Title
            
        -   Body (Rich Text)
            
        -   Category (Taxonomy Reference: Music, Station News, Reviews, Events, etc.)
            
        -   Image (Media Reference)
            
        -   Date (Date field)
            
-   **Playlist (`playlist`)**
    
    -   **Usage:** Tracklists and show notes submitted by DJs for their specific broadcasts.
        
    -   **Fields:**
        
        -   Title (e.g., "With The Beatles playlist for 05/07/2026")
            
        -   Body (Rich Text for show notes and tracklists)
            
        -   Program/Show Reference (Entity Reference to the related `show` node)
            
        -   Author/DJ Reference (Entity Reference to the User/DJ Profile)
            
        -   Date/Time of Broadcast
            
-   **Show (`show`)** _(Sidequest)_
    
    -   **Usage:** Individual radio shows.
        
    -   **Fields:** Show Name, Description, DJ (Entity Reference to User/DJ profile), Genre, Schedule Time.
        
-   **DJ Profile (`dj_profile`)** _(Sidequest)_
    
    -   **Usage:** Profiles for the radio hosts. Can be a custom Content Type or user profile fields.
        

## 2. Taxonomy (Vocabularies)

-   **Transmission Categories:** Music, Station News, Reviews, Events, Editorial, Charts. Used to color-code and filter the blog grid on the homepage.
    
-   **Genres:** Indie, Punk, Jazz, Electronic, etc.
    

## 3. Blocks & Regions

-   **Header Region**
    
    -   **Site Branding Block:** The WUSB Logo and 90.1 FM text.
        
    -   **Main Navigation Block:** About, Schedule, Sports, Playlists, Pledge button.
        
    -   **Theme Toggle Block:** Custom block containing the Sun/Moon toggle.
        
-   **Sub-Header Region**
    
    -   **Secondary Navigation Block:** Underwriting, Requests, EEO Report, etc.
        
-   **Footer / Bottom Region**
    
    -   **Radio Player Block:** The sticky bottom player containing play/pause logic and volume controls. This should likely be a custom block type or integrated directly into the theme's `page.html.twig` to persist across page loads (or use decoupled/headless architecture to keep it truly persistent).
        

## 4. Views

-   **Latest Transmissions View**
    
    -   **Display Type:** Grid of unformatted list or teasers.
        
    -   **Filter:** Content type = Article, Published = Yes.
        
    -   **Sort:** Authored on (Descending).
        
    -   **Location:** Homepage main content area.
        
-   **Recent Playlists View**
    
    -   **Display Type:** Unformatted list of teasers (vertical feed).
        
    -   **Filter:** Content type = Playlist, Published = Yes.
        
    -   **Sort:** Broadcast Date (Descending).
        
    -   **Location:** Playlists page (`/playlists`).
        

## 5. Theme Structure

-   **Tailwind CSS:** Integrated via a build process (e.g., using Webpack or Vite) rather than CDN in production. The `tailwind.config.js` will map to the defined CSS variables for theming.
    
-   **Libraries (`wusb.libraries.yml`)**:
    
    -   `global-styling`: Loads `style.css`.
        
    -   `global-scripts`: Loads `script.js` (wrapped in Drupal behaviors).
        
    -   `lucide-icons`: Loads the Lucide SVG icon library.
        

## 6. JavaScript Behaviors

In Drupal, JavaScript should be wrapped in `Drupal.behaviors` to ensure it attaches properly when content is loaded via AJAX (e.g., Views infinite scroll or BigPipe). See `script.js` for mapping.

## 7. Single Directory Components (SDC) Strategy

To ensure a smooth transition from the vanilla HTML/Tailwind Proof of Concept to Drupal 10/11 Single Directory Components, the following best practices must be followed in the HTML prototypes:

-   **Use CSS Variables for Dynamic/Thematic Styling:** Do not hardcode dynamic inline styles deep within a component's markup. Instead, declare a CSS variable on the component's outer wrapper (e.g., `<article style="--card-color: {{ taxonomy_color }};">`) and inherit it using `var(--card-color)` on all child elements. This allows Drupal to inject dynamic data exactly once per component instance, keeping Twig templates clean and maintainable.
    
-   **Avoid JS Placeholders for Server-Side Content:** Because Drupal is fundamentally a Server-Side Rendered (SSR) system, structural components (like headers, footers, and players) should not be loaded dynamically via JavaScript `fetch()` in the PoC. Instead, include the full mocked-up HTML markup directly in the parent layout file, wrapped in explicit boundary comments (e.g., `<!-- COMPONENT: HEADER -->`). This ensures backend developers can see the structure and easily extract it into isolated `.twig` files.
