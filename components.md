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

### 🟢 2.4 Conveyor Belt Carousel (`conveyor_belt_carousel`)
*   **Description:** Two infinite-scrolling marquee lists moving in opposite directions (conveyor belt style) placed below the content card grid on the homepage. The top carousel scrolls DJ profile avatars (circles), and the bottom carousel scrolls On-Air show covers (rounded squares). Items are dynamically randomized and repeated on page load, pausing on hover.
*   **Component Type:** Custom block or Homepage content region template.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `dj_list` | DJs Data Array | List (Object) | `[{"name": "DJ Void", "initials": "DV"}]` | Array of DJ profiles containing initials and name. |
| `show_list` | Shows Data Array | List (Object) | `[{"name": "Radio Kaos", "initials": "RK"}]` | Array of Radio shows containing initials and title. |
| `gradient_presets` | Neon Gradient Array | List (Text) | `["from-[#df0781] to-[#af04ab]"]` | Preset CSS classes for high-fidelity gradients applied to profile icons. |
| `scroll_speed` | Carousel Scroll Speed | Text (CSS Time) | `45s` | Animation duration parameter for speed customization. |

---

### 🟢 2.5 DJ Grid (`dj_grid`)
*   **Description:** A searchable, filterable grid displaying all DJ profiles on the dedicated DJs page ([djs.html](file:///Users/liam_yehudai/Documents/VSCode/WUSBProofOfConcept/djs.html)). Active DJs are automatically sorted first, followed by inactive DJs in alphabetical order. Features responsive card layouts with active status badges and search capabilities.
*   **Component Type:** Drupal View page or custom block.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `dj_list` | DJs Data Array | List (Object) | `[{"name": "DJ Void", "initials": "DV", "active": true}]` | Array of DJ profiles with active status and initials. |
| `search_placeholder`| Search Input Placeholder| Text | `Search DJs...` | Placeholder text inside search query box. |
| `no_results_text` | No Results Label | Text | `No DJs match your search.` | Text display when search query matches zero records. |

---

### 🟢 2.6 DJ Profile (`dj_profile`)
*   **Description:** The detailed profile view for a radio DJ/host ([djx.html](file:///Users/liam_yehudai/Documents/VSCode/WUSBProofOfConcept/djx.html)). It displays their brand identity (tag/name), active status, biography text, links to their socials and website, references to the shows they host, and a featured video stream.
*   **Component Type:** Node DJ Profile Full View Mode (`node--dj--full.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `dj_name` | DJ Name/Tag | Text | `DJx` | Primary brand heading. |
| `dj_avatar` | Avatar Image | Media (Image) | `djx_avatar.jpg` | Square profile icon of the DJ. |
| `active_status` | Is Active DJ | Boolean | `true` | Show status badge (Live Host / Inactive). |
| `biography` | Bio Narrative | Rich Text | `<p>DJx is a resident...</p>` | Plain text description / biography. |
| `social_links` | Social & Web Links | List (Link) | `[{"label": "Website", "url": "..."}]` | List of socials (Instagram, SoundCloud, Mixcloud, Website) rendered with matching Lucide icons. |
| `attached_programs`| Hosted Programs | List (Entity Reference) | `[{"title": "Program X", "url": "programX.html"}]` | Link cards to shows hosted by this DJ. |

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
*   **Description:** A structured list item displaying broadcast logs, DJ/host name, broadcast date/time, and a custom thumbnail. The thumbnail displays the program cover art (e.g. `program_x_thumbnail.jpg` for Program X) or falls back to a dynamically themed spinning vinyl record displaying the program's initials.
*   **Component Type:** Playlist Node Teaser View Mode (`node--playlist--teaser.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `show_title` | Radio Program Name | Text | `With The Beatles` | Name of the radio program. |
| `dj_name` | DJ / Host Name | Text | `DJ Pete` | Host associated with the broadcast. |
| `broadcast_date` | Date of Broadcast | Date/Time | `May 28, 2026` | Date of the show airing. |
| `thumbnail` | Cover Art Thumbnail | Image / Custom HTML | Dynamic spinning vinyl / `program_x_thumbnail.jpg` | Square cover picture or styled spinning vinyl template. |
| `detail_url` | View Details URL | URL | `playlist-detail.html` | Click-through route to track-by-track tables. |

---

### 🟢 3.4 Interactive Schedule Slot (`schedule_slot`)
*   **Description:** A precise programming slot placed inside the interactive weekly programming calendar. It displays the show name (linking to its program profile page, e.g. `programX.html`), host, and timing brackets. It has been upgraded with a dynamic Play button that redirects the user to the standalone `player.html` player page.
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

### 🟢 3.6 Radio Program Details (`program_details`)
*   **Description:** The detailed view section for a radio show, displaying its cover thumbnail, description, active air block, genre tags, and references to the attached host/DJ.
*   **Component Type:** Node Show Detail View Mode (`node--show--full.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `thumbnail_image` | Program Thumbnail | Media (Image/GIF) | `program_x_thumbnail.jpg` | Main cover asset for the radio show, supporting animated gifs. |
| `show_title` | Program Title | Text | `Program X` | Large header title for the show. |
| `show_description` | Show Biography | Rich Text | `<p>Dive deep into...</p>` | Formatted text description of the program. |
| `air_day` | Weekly Air Day | Text | `Thursdays` | Day of the week the program is broadcast. |
| `air_hours` | On-Air Time Range | Text | `18:00 - 20:00 EST` | Start and end hours of the broadcast block. |
| `genre_tags` | Genre Taxonomy Tags | List (Term) | `["Synthwave", "Vaporwave"]` | List of style categories associated with the program. |
| `attached_dj` | Associated DJ Profile | Entity Reference | `[{"name": "DJ Void", "initials": "DV"}]` | Reference to the DJ profile host page. |

---

### 🟢 3.7 Interactive Rich Text Editor (`rich_text_editor`)
*   **Description:** A client-side visual editor block allowing station staff or DJs to write blog posts, log track playlists, format text, and embed custom links, images, GIFs, and YouTube embeds.
*   **Component Type:** Reusable Custom Editor Block / Node Form Element.

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `editor_title` | Editor Section Heading | Text | `Show Blog & Playlist Notes Editor` | Header label for the editor component. |
| `initial_content` | Initial HTML Content | Rich Text | `<h2>Show Notes...</h2>` | Default populated HTML in the composer. |
| `save_draft_action` | Save Trigger Handler | Function | LocalStorage Callback | Save mechanism for storing draft state. |
| `preset_assets` | Preset Media Presets | List (Object) | `[{"label": "Vapor Tape GIF", "url": "..."}]` | Quick-insert buttons for demo graphics and animations. |

---

### 🟢 3.8 Playlist Detail Page (`playlist_detail`)
*   **Description:** The detailed playlist log detail view page, unified as a card article layout matching `Episode 45` from `programX.html` ([playlistX.html](file:///Users/liam_yehudai/Documents/VSCode/WUSBProofOfConcept/playlistX.html)).
*   **Component Type:** Node Playlist Full View Mode (`node--playlist--full.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `program_title` | Episode/Program Title | Text | `Episode 45: Retro-Future Beats & Tape Loops` | Heading name of the broadcast block. |
| `broadcast_date` | Date of Release | Date | `June 25, 2026` | Date this specific episode aired. |
| `attached_dj` | Host DJ Profile | Entity Reference | `[{"name": "DJx"}]` | Link reference to the DJ profile page. |
| `narrative` | Show Description | Rich Text | `<p>Tonight on Program X...</p>` | Text block summarizing the specific episode's theme. |
| `tracklist` | Tracklist Rows | List (Object) | `[{"artist": "Gunship", "title": "Fly for Your Life", "album": "Gunship", "new": false}]` | Table items with Artist, Title, and Album columns. New releases are marked with an asterisk `*` in the text. |
| `program_profile` | Program Link | Link | `programX.html` | Click-through route to the master show profile. |
| `archive_play` | Archive Play Button | Link | `player.html?archive=...` | Direct link button to load and listen to this show's broadcast archive in the standalone media player. |
| `download_csv` | Download CSV trigger| File / Action | Local Download Generator | Real-time browser spreadsheet compilation & download. |
| `thumbnail_mode` | Thumbnail Mode | Choice (Enum) | `default` / `uploaded` | **Backend Feature Only:** Dictates whether the page renders the dynamically generated brand visual (rotating Vinyl graphic) or a custom uploaded image. Configurable by DJs on the dashboard and not exposed as a front-end toggle. |
| `youtube_video` | Embedded Episode Video | URL | `https://www.youtube.com/embed/MVgM6X1hM8E` | Video iframe embedded directly inside the rich text narrative block at the bottom of the article card. |
| `spotify_playlist` | Spotify Embed URL | URL | `https://open.spotify.com/embed/playlist/...` | Widget embed for companion playlist. |
| `attached_gallery` | Attached Studio Media | List (Media Image) | `["wusb_studio.jpg"]` | Gallery of files attached to the playlist with click lightbox. |

---

### 🟢 3.9 Article Detail Page (`article_detail`)
*   **Description:** The detailed page view for news articles, blogs, music reviews, and events ([articleX.html](file:///Users/liam_yehudai/Documents/VSCode/WUSBProofOfConcept/articleX.html)).
*   **Component Type:** Node Article Full View Mode (`node--article--full.html.twig`).

#### Component Fields
| Field Machine Name | Field Label | Field Type | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | Article Title | Text | `Cyberpunk and the Evolution of Electronic Radio` | Heading name of the post. |
| `published_date` | Date of Publication | Date | `June 30, 2026` | Date the article was published. |
| `author_dj` | Author DJ reference | Entity Reference | `[{"name": "DJx"}]` | Reference to the authoring user or DJ profile page. |
| `hero_image` | Hero Thumbnail Banner | Media Image | `article_hero.jpg` | Main visually prominent banner photo. |
| `category` | Taxonomy Category | Taxonomy reference | `Music Review` | Taxonomy tag reference displaying with colored highlight outline. |
| `body` | Rich Text Content | Rich Text | `<p>How did free-form...</p>` | The complete editor-generated body text containing paragraphs, headings, blockquotes, and embedded image figures. |

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
