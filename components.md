# WUSB Website Component Breakdown

This document provides a modular breakdown of the WUSB Proof of Concept website. By decomposing the current static HTML templates into independent, reusable components, we create a clear path to building a modern, maintainable frontend and a seamless migration to **Drupal 10/11 Single Directory Components (SDC)**.

---

## 1. Global / Layout Components

### 🟢 1.1 Header Navigation (`header`)
*   **Description:** The sticky navigation bar fixed to the top of every page. It handles primary brand identity, desktop menus, secondary sub-menus, theme toggles, and the responsive mobile dropdown drawer.
*   **Component Type:** Drupal Block or Custom Theme Region (`page.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `brand_title` | Brand Title | Text | `WUSB` | Station call sign in Chuck font. |
| `brand_subtitle` | Brand Subtitle | Text | `90.1 FM` | Broadcast frequency in Swiss font. |
| `primary_menu` | Primary Navigation | List (Link) | `[{"label": "About", "url": "about.html"}]` | High-level main pages. |
| `secondary_menu`| Secondary Menu | List (Link) | `[{"label": "Underwriting", "url": "underwriting.html"}]` | Horizontal submenu links. |
| `pledge_url` | Pledge Target URL | URL | `https://stonybrookuniversity.co1.qualtrics.com/...` | Target link for the main call-to-action button. |

---

### 🟢 1.2 Sticky Bottom Radio Player / Standalone Archive Player (`player`)
*   **Description:** The persistent media player component. It functions in two modes: (1) As a docked footer component across all standard pages displaying live broadcast info; (2) As a full-featured standalone archive streaming page (`player.html`) displaying dynamic visualizers and metadata parsed from schedule queries.
*   **Component Type:** Standalone Webpage (`player.html`) and Embedded Footer Layout Block.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `stream_url` | Stream Source URL | URL | `https://stream.wusb.fm/live` | Stream URL for the audio element. |
| `live_show_title` | Live Show Title | Text | `The Underground Sound` | Display label of the program currently on-air (footer) or archive program (standalone). |
| `live_show_dj` | Live Show DJ | Text | `DJ Void` | Name of the hosting DJ. |
| `archive_ref` | Archive Code Label | Text Element | `#archive-ref-display` | Displays decoded WUSB day-of-week format (e.g. `6Sat-0900`). |
| `date_ref` | Date Format Label | Text Element | `#date-format-display` | Displays decoded WUSB date format (e.g. `0900-06-06-2026`). |
| `volume_slider` | Volume Range Control | Input Element | `#volume-slider` | Volume percentage slider. |

---

## 2. Page & Feed Components

### 🟢 2.1 Hero Banner (`hero`)
*   **Description:** The visually striking top-fold banner on the homepage that features massive station typography, a desaturated atmospheric background image, and two calls-to-action.
*   **Component Type:** Custom block or Paragraph type on the Homepage node.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `background_image` | Background Image | Media (Image) | `RadioHero.png` | Main desaturated image filling the section. |
| `overlay_color` | Overlay Tint Color | Color (CSS Var)| `rgba(0,0,0,0.6)` | Set as a custom CSS property (`--hero-overlay-color`). |
| `accent_title` | Gradient Accent Title | Text | `50 YEARS OF LONG ISLAND` | Top line of heading styled with the brand gradient. |
| `main_title` | Main Header Title | Text | `FREE FORM RADIO` | White text line of the primary heading. |
| `subtitle` | Subtitle Slogan | Text | `Broadcasting live from Stony Brook University` | Explanatory brand label below the heading. |
| `primary_btn_text` | Primary Button Text | Text | `View Schedule` | Text inside the filled action button. |
| `primary_btn_url` | Primary Button Link | URL | `schedule.html` | Destination page for the primary action. |
| `secondary_btn_text`| Secondary Button Text| Text | `Recent Playlists` | Text inside the hollow action button. |
| `secondary_btn_url`| Secondary Button Link| URL | `playlists.html` | Destination page for the secondary action. |

---

### 🟢 2.2 Page Header / Banner (`page_header`)
*   **Description:** A consistent page title section found on all informational pages (`about.html`, `contact.html`, `playlists.html`, `schedule.html`, `wusbpublicfile.html`).
*   **Component Type:** Node Page Template Title block (`page-title.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | Page Title | Text | `About WUSB` | Large heading text with the `wusb-gradient` style. |
| `subtitle` | Page Subtitle | Text (Optional) | `Regulatory filings for WUSB 90.1 FM` | Secondary description below title. |

---

### 🟢 2.3 Transmission Card (`transmission_card`)
*   **Description:** A content teaser grid card displaying station news, events, charts, or music reviews. It supports color-coded borders driven by custom taxonomy tags.
*   **Component Type:** Article Node Teaser View Mode (`node--article--teaser.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `category` | Taxonomy Category | Term Reference| `Studio` | Determines tag text and color. |
| `category_color` | Brand Accent Color | Color (CSS Var)| `#00e5ff` | Passed as CSS variable (`--card-color`) for borders and links. |
| `publish_date` | Date of Publication | Date | `MAR 10, 2026` | Timestamp of post creation. |
| `title` | Card Title | Text | `Upgrading the Broadcast Board` | Highlighted title (applies hover underline). |
| `image` | Teaser Image | Media (Image) | `mixing_board.jpg` | Optional card image with automatic grayscale-to-color transition. |
| `summary` | Teaser Body Text | Text (Plain) | `A behind-the-scenes look at Studio A...` | Introductory snippet of the article. |
| `details_url` | Read More Link | URL | `article.html` | Target node link when clicked. |

---

## 3. Structural Content Components

### 🟢 3.1 Content Block / Column Panel (`content_column_panel`)
*   **Description:** A structural grouping block with a solid border and dark glass background. Used for lists, affiliations, or simple compliance outlines on informational pages.
*   **Component Type:** Paragraph Component or Custom Layout Paragraph block.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `panel_title` | Panel Header | Text | `Memberships` | Top heading within the container. |
| `body_content` | Main Body Text | Rich Text (HTML) | `<p>Brief description...</p>` | Formatted prose text. |
| `list_items` | List Items | List (Text) | `["IBS", "College Broadcasters"]` | Array of text strings for checked list rows. |
| `accent_color` | List Accent Color | Choice/Color | `#8bfa00` | Accent color applied to checkmark icons (e.g. green or pink). |

---

### 🟢 3.2 Information Card / CTA Panel (`cta_panel`)
*   **Description:** A prominent focus panel containing a strong message and a large icon-linked action button. Used for the Underwriting Interest Form and Disability Accessibility notices.
*   **Component Type:** Reusable Custom Block Type or paragraph element.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `theme` | Brand Color Theme | Choice (Enum) | `pink` / `cyan` / `green` | Dictates side accent stripe color and icon highlights. |
| `lucide_icon` | Lucide Icon Name | Choice (Enum) | `accessibility` / `file-text` | Lucide identifier for SVG rendering. |
| `heading` | Panel Heading | Text | `Disability Accommodation Support` | Header label. |
| `description` | Panel Description | Text | `For disability-related assistance in accessing WUSB public files...` | Descriptive note. |
| `button_text` | Action Button Label | Text | `Email gm@wusb.fm` | Label for the main action trigger. |
| `button_url` | Action Button Link | URL | `mailto:gm@wusb.fm` | Redirect URL/action. |

---

### 🟢 3.3 Playlist Directory Item (`playlist_item`)
*   **Description:** An structured list row displaying broadcast logs, dj names, broadcast time, and genre tags.
*   **Component Type:** Playlist Node Teaser View Mode (`node--playlist--teaser.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `show_title` | Radio Program Name | Text | `With The Beatles` | Name of the radio program. |
| `dj_name` | DJ / Host Name | Text | `DJ Pete` | Host associated with the broadcast. |
| `broadcast_date` | Date of Broadcast | Date/Time | `May 28, 2026` | Date of the show airing. |
| `tags` | Genre Tag Array | List (Term) | `["Rock", "60s", "Indie"]` | Small tags highlighted in grey pill boxes. |
| `detail_url` | View Details URL | URL | `playlist-detail.html` | Click-through route to track-by-track tables. |

---

### 🟢 3.4 Interactive Schedule Slot (`schedule_slot`)
*   **Description:** A precise programming slot placed inside the interactive weekly programming calendar. It displays show name, host, and timing brackets. It has been upgraded with a dynamic Play button that generates archive URL requests pointing to `player.html`.
*   **Component Type:** View row within the schedule grid calendar page.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `show_name` | Show Name | Text | `The Underground Sound` | Primary show header inside the slot. |
| `dj_name` | Host DJ Name | Text | `DJ Void` | Supporting host label. |
| `start_time` | Start Time | Time | `18:00` | Start hours and minutes. |
| `end_time` | End Time | Time | `20:00` | End hours and minutes. |
| `day_of_week` | Show Day | Choice (Enum) | `Thursday` | Calendar column identifier. |
| `genre` | Broad Genre Category | Term Reference| `Electronic` | Shows general style category. |
| `archive_url` | Archive Stream URL | URL | `player.html?archive=4Thu-1800&date=1800-04-06-2026&title=...` | Computed link on the play button to open the archive stream player. |

---

### 🟢 3.5 Schedule Navigation and Controls (`schedule_controls`)
*   **Description:** A layout container positioned above the schedule table grid that allows filtering the calendar by day tabs, shifting focus by week, resetting to today's date, or searching for specific archive dates.
*   **Component Type:** Inline Control Panel block on the Schedule page.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `day_selector` | Day Tabs Container | Container | `#day-tabs-container` | Filters table to only show the selected day's column (or "Full Week"). |
| `prev_week_action` | Previous Week Trigger | Element Button | `#prev-week-btn` | Shifts selected calendar week back by 7 days. |
| `next_week_action` | Next Week Trigger | Element Button | `#next-week-btn` | Shifts selected calendar week forward by 7 days. |
| `current_week_lbl` | Week Range Label | Text Element | `#current-week-display` | Displays current active week range format. |
| `today_action` | Jump to Today Button | Element Button | `#today-btn` | Resets calendar to today's date, selecting today's tab and highlighting today's column. |
| `date_picker` | Date Lookup Input | Input Element | `#date-lookup-input` | HTML5 Date field allowing native day search. |
| `date_lookup_go` | Date Lookup Submit | Element Button | `#date-lookup-btn` | Triggers calendar focus jump to the input date. |

---

## 4. Architectural Rules for Frontend Developers

To maintain a clean migration path from these static HTML templates to server-rendered **Drupal Single Directory Components (SDC)**, frontend changes must respect the following rules:

1.  **Strict Comment Boundaries:** Always enclose structural components in explicit HTML block comments:
    ```html
    <!-- COMPONENT: HEADER -->
    <header class="..."> ... </header>
    <!-- END COMPONENT: HEADER -->
    ```
2.  **No Inline Hardcoded Variable Styles:** Do not inline styling colors directly inside elements (e.g. `style="border-color: #df0781"`). Instead, assign a component-level CSS variable on the outer wrapper element:
    ```html
    <article style="--card-color: #df0781;">
       <div class="h-3 w-full bg-[var(--card-color)]"></div>
    </article>
    ```
    This lets Drupal output the dynamically configured color exactly once on the component wrapper, and children will automatically inherit it via standard CSS.
3.  **Use Utility Scripts for Link Syncing:** When adding a new menu page, update the file list in `update_menus.js` and execute it via Node (`node update_menus.js`). Do not manually copy and paste changes to the navigation bars on every single file, as this breaks component integrity.
