# GrandVista Hotel — Website Project

A premium, responsive hotel website for **GrandVista Hotel**, a 5-star luxury heritage boutique hotel in New Delhi's diplomatic enclave. Built completely from scratch using **plain HTML5, CSS3, and vanilla JavaScript** with zero third-party UI libraries or frameworks.

---

## 📁 Project Structure

```text
hotel-website/
├── index.html                  # Homepage (Sticky Nav, Hero, Search Widget, Intro, Featured Rooms, Highlights, Footer)
├── rooms.html                  # Rooms Listing Page (Filters, Sorting, Dynamic Grid, Empty State)
├── room-details.html           # Room Details Page (Template driven by ?room=<slug>, Lightbox Gallery, Policies, Booking Card)
├── booking.html                # Multi-Step Booking Engine (Dates, Room Select, Guest Info, Requests, Review, Confirmation)
├── gallery.html                # Photo Gallery (Category Filters, Lightbox Modal with Touch/Keyboard Navigation)
├── amenities.html              # Hotel Amenities & Services (6 Facility Showcases with Operating Hours & Highlights)
├── about.html                  # Heritage & Story (History, Mission, Architecture, Stats & Visual Timeline 1928–2026)
├── contact.html                # Contact & Location (Interactive Coordinates, SVG Map, Department Contacts, Inquiry Form)
├── faq.html                    # Frequently Asked Questions (Accessible ARIA Accordion for 10 Common Inquiries)
├── policies.html               # Hotel Policies & Terms (Check-in/out, 48h Cancellation, Children, Pets, ID, Smoking)
├── wishlist.html               # Dedicated Saved Wishlist (Dynamic Grid, Empty State, Remove & Clear Actions)
├── css/
│   └── style.css               # Design system tokens, responsive layout, rooms, details, booking & component styles
├── js/
│   ├── main.js                 # Navigation toggle, sticky scroll, booking form validation, featured rooms fetch, wishlist bootstrap
│   ├── filters.js              # Client-side filtering, sorting, wishlist toggle, and empty state management for rooms.html
│   ├── room-details.js         # URL query parser, gallery carousel, lightbox with swipe/keyboard, metadata updates, wishlist toggle
│   ├── booking.js              # 6-step in-memory state engine, date validation, live financial math, confirmation receipt
│   ├── wishlist.js             # LocalStorage wishlist engine, custom events, heart button renderer, dynamic nav badge
│   ├── recently-viewed.js      # LocalStorage history tracker (max 4, most recent first), homepage history render engine
│   ├── gallery.js              # Category filtering and touch/keyboard-accessible fullscreen lightbox modal for gallery.html
│   ├── contact.js              # Form validation, live feedback alert banner, and inquiry submission handler for contact.html
│   └── faq.js                  # Accessible keyboard-navigable ARIA accordion component for faq.html
├── data/
│   └── rooms.json              # 5 Room types dataset with amenities, pricing, availability & gallery images
├── images/
│   ├── hotel/                  # Hotel visuals & facility illustrations
│   │   ├── hero-bg.svg
│   │   ├── hotel-intro.svg
│   │   ├── lobby.svg
│   │   ├── pool.svg
│   │   ├── spa.svg
│   │   ├── restaurant.svg
│   │   ├── events.svg
│   │   └── exterior.svg
│   └── rooms/                  # Room card graphics & gallery placeholders
│       ├── deluxe-room.svg
│       ├── premium-room.svg
│       ├── executive-suite.svg
│       ├── family-room.svg
│       ├── suite.svg
│       └── gallery/
│           ├── balcony.svg
│           ├── bathroom.svg
│           ├── living.svg
│           └── view.svg
└── README.md                   # Documentation and comprehensive project guide
```

---

## 🎨 1. Design System (`css/style.css`)

The design system is defined via CSS custom properties on `:root` to ensure consistency and modularity:

### Color Palette (Warm Neutral & Luxury Gold)
- **Deep Charcoal (Primary Base):** `--color-primary: #18191c;`, `--color-primary-light: #26282e;`
- **Warm Gold / Brass (Accent):** `--color-accent: #c5a880;`, `--color-accent-light: #dfc8a5;`, `--color-accent-dark: #9e8055;`
- **Cream & Warm Surfaces:** `--color-bg-warm: #faf7f2;`, `--color-bg-card: #ffffff;`, `--color-bg-subtle: #f3efe8;`
- **High-Contrast Text:** `--color-text-main: #242528;`, `--color-text-muted: #6a6c72;`, `--color-text-light: #f7f4ee;`
- **Borders & Dividers:** `--color-border: #e6e0d5;`, `--color-border-gold: rgba(197, 168, 128, 0.4);`
- **Availability Status Tokens:**
  - *Available:* `--color-status-available: #1e7e43;` (light emerald badge)
  - *Limited:* `--color-status-limited: #b45309;` (warm amber badge)
  - *Sold Out:* `--color-status-soldout: #b91c1c;` (soft crimson badge)

### Typography
- **Headings (Serif):** `Playfair Display`, serif (Google Fonts)
- **Body & Controls (Sans-Serif):** `Inter`, sans-serif (Google Fonts)
- **Fluid & Scaled Hierarchy:** `--font-size-xs` (12px) to `--font-size-5xl` (60px)

### Spacing & Border Radii
- **Spacing Scale:** `--space-2xs` (4px), `--space-xs` (8px), `--space-sm` (12px), `--space-md` (16px), `--space-lg` (24px), `--space-xl` (32px), `--space-2xl` (48px), `--space-3xl` (72px), `--space-4xl` (96px).
- **Border Radii:** `--radius-xs` (2px), `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (14px), `--radius-full` (9999px).

### Responsiveness
- Mobile-first methodology with standard responsive breakpoints:
  - Mobile: `< 640px`
  - Tablet: `640px – 1023px`
  - Desktop: `≥ 1024px`

---

## 🛏️ 2. Room Data Schema (`data/rooms.json`)

The data file contains 5 structured room records:
1. **Deluxe Room** (`deluxe-room`) — ₹5,500/night (380 sq ft, 2 guests, King Bed, City View)
2. **Premium Room** (`premium-room`) — ₹7,800/night (460 sq ft, 2 guests, King Bed, Garden View)
3. **Executive Suite** (`executive-suite`) — ₹12,500/night (650 sq ft, 3 guests, Super King Bed, Skyline View)
4. **Family Room** (`family-room`) — ₹10,200/night (580 sq ft, 4 guests, 2 Queen Beds, Courtyard View)
5. **Suite** (`suite`) — ₹21,500/night (920 sq ft, 4 guests, California King Bed, Panoramic View)

---

## 🖥️ 3. Implemented Pages & Features

### 1. Homepage (`index.html`)
- **Sticky Navigation Bar:** Logo, 10 sitemap links, wishlist counter badge, and animated mobile hamburger drawer.
- **Hero Section:** Headline *"Stay Better. Experience More."* with dual CTAs.
- **Booking Search Widget:** Check-in, check-out, adults, children, rooms, room type, with vanilla JS validation.
- **Hotel Introduction Section:** Heritage, diplomatic enclave location, classification, and facilities.
- **Featured Rooms Section:** Dynamically rendered top 3 rooms from `rooms.json`.
- **Hotel Highlights Section:** 8-item custom SVG icon grid.
- **Footer:** Full contact info, social placeholders, and sitemap navigation links.

### 2. Rooms Listing Page (`rooms.html` & `js/filters.js`)
- **Multi-Parameter Filtering:** Room Type, Min Guests, Bed Type, Room Size, View, Price Range (Min/Max), and Amenities (Multi-select checkboxes).
- **Sort Dropdown:** Featured First, Price: Low to High, Price: High to Low, Room Size: Largest First.
- **Client-Side Pipeline:** Seamless filtering and sorting in real-time without reloading.
- **Empty State:** Friendly *"No Accommodations Found"* message with a one-click *"Reset All Filters"* action.
- **Card States:** Heart wishlist toggle button, availability badge, view tag, specs, amenity pills, *"View Details"* link (`room-details.html?room=<slug>`), and conditional *"Book Now"* button (disabled *"Sold Out"* state for sold-out rooms).

### 3. Room Details Page (`room-details.html` & `js/room-details.js`)
- **URL Parameter Driven:** Reads `?room=<slug>` from the address bar.
- **Dynamic SEO:** Sets `<title>` and `<meta name="description">` specifically for the active room.
- **Interactive Image Gallery:** Main photo display with captions and counter badge, thumbnail strip, and click-to-enlarge Lightbox modal with keyboard arrows (`ArrowLeft`/`ArrowRight`), `Escape` to close, and mobile touch swipe left/right.
- **Detailed Specifications:** Key metrics grid (Size, Guests, Bedding, View).
- **Hotel Policies Block:** Check-in (2:00 PM), check-out (12:00 PM), flexible cancellation guarantee demo text, and identification requirements.
- **Sticky Booking Sidebar:** Real-time pricing, guarantee reassurance, concierge contact, and *"Book This Room"* action.
- **Wishlist Integration:** Header heart button toggles room state in localStorage and updates navigation badges in real time.
- **Room Not Found State:** Graceful error handling for missing or invalid room slugs.

### 4. Multi-Step Booking Flow (`booking.html` & `js/booking.js`)
- **Visible Stepper Progress Bar:** Top step progress indicator (Step X of 6) with dynamic fill track and active/completed circles.
- **Deep Linking Support:** Opening `booking.html#<slug>` automatically finds the room, pre-selects it, and skips directly to Step 2.
- **Step 1 — Search & Dates:** Date inputs with dynamic minimums (no past dates, check-out strictly after check-in, minimum 1 adult).
- **Step 2 — Select Room:** Displays all available rooms from `rooms.json` (excluding `sold_out`). Interactive radio-style selectable cards with highlight border, checkmark badge, and specifications.
- **Step 3 — Guest Information:** Full Name, Email Address (validated with regex), Mobile Phone (numeric validation), Country, and Number of Guests.
- **Step 4 — Personalize & Special Requests:** Optional add-on services with live pricing (Airport Transfers, Breakfast, Extra Bed, Spa, Dinner, Floral setup, Late Checkout, Early Check-in).
- **Step 5 — Live Review & Cost Breakdown:** Summary cards with "Edit" jump-back links, itemized pricing, 12% GST calculation, and grand total.
- **Step 6 — Booking Confirmation:** Generates reference code (`GVH-2026-#####`), status badge, complete itemized receipt, and *"Book Another Stay"* reset button.

### 5. Photo Gallery Page (`gallery.html` & `js/gallery.js`)
- **Category Filter Bar:** 8 categories (All Photos, Rooms & Suites, Lobby, Dining & Cellar, Infinity Pool, Spa & Wellness, Events & Banquets, Exterior).
- **Interactive Lightbox Modal:** Fullscreen zoom modal with previous/next controls, image counter, descriptive captions, keyboard support (<kbd>Escape</kbd>, <kbd>&larr;</kbd>, <kbd>&rarr;</kbd>), and touch swipe gestures.
- **Accessibility:** Photo cards are focusable via keyboard (<kbd>Tab</kbd>) and can be opened with <kbd>Enter</kbd> or <kbd>Space</kbd>.

### 6. Curated Amenities Page (`amenities.html`)
- **6 Facility Showcases:**
  1. *Temperature-Controlled Infinity Pool* (6:00 AM – 10:00 PM)
  2. *State-of-the-Art Fitness Centre* (24 Hours Open)
  3. *Holistic Ayurvedic & Wellness Spa* (8:00 AM – 9:00 PM)
  4. *Executive Diplomatic Business Centre* (24 Hours Open)
  5. *Complimentary Chauffeured Valet Parking* (24 Hours Open)
  6. *High-Speed Fiber Wi-Fi* (Complimentary High-Bandwidth)
- **Detailed Features:** Each facility highlights specialized services, operating hours badges, and direct links to reserve rooms.

### 7. About Hotel Page (`about.html`)
- **Heritage & Narrative:** Explores the history of GrandVista since 1928, its diplomatic heritage, and architectural conservation.
- **Hospitality Mission & Pillars:** Focuses on timeless warmth, authentic discretion, and bespoke concierge service.
- **Key Metrics Grid:** 98+ years of heritage, 120 artisan staff, 40 bespoke suites, and 99.4% guest satisfaction.
- **Visual Horizontal Timeline:** Responsive milestone progression through 1928 (Inception), 1965 (Diplomatic Expansion), 1998 (Heritage Modernization), and 2026 (The GrandVista Era).

### 8. Contact & Location Page (`contact.html` & `js/contact.js`)
- **Direct Coordinates:** Mansingh Heritage Boulevard address, direct concierge telephone, and reservation email.
- **Department Directory:** Front Desk, Sommelier Dining, Banquets & Events, Spa & Wellness.
- **Interactive SVG Map:** Visual location map block highlighting proximity to central embassies and monuments.
- **Validated Inquiry Form:** Client-side input validation for full name, email format, subject selection, and message length, with an animated confirmation alert banner.

### 9. Frequently Asked Questions (`faq.html` & `js/faq.js`)
- **10 Core Guest Questions:** Covers check-in/out policies, airport transfers, breakfast timings, smoking guidelines, pet policies, cancellations, and valet parking.
- **Accessible Accordion:** Native ARIA attributes (`aria-expanded`, `aria-hidden`, `aria-controls`), keyboard toggle support (<kbd>Enter</kbd> and <kbd>Space</kbd>), and automatic collapse of sibling panels.

### 10. Hotel Policies & Terms Page (`policies.html`)
- **Comprehensive Policy Cards:**
  - Check-in (2:00 PM) & Early Arrival
  - Check-out (12:00 PM) & Late Departure
  - 48-Hour Cancellation Guarantee
  - Children & Extra Bed Policies
  - Pet Policy (Guide & Service Animals Welcome)
  - Government ID Verification Requirements
  - 100% Non-Smoking Sanctuary
  - Secure Payment Methods & Currency Exchange

### 11. Saved Wishlist Page (`wishlist.html` & `js/wishlist.js`)
- **LocalStorage Persistence:** Uses key `grandvista_wishlist` to maintain saved room slugs across sessions.
- **Global Heart Toggle Buttons:** Appears on room listing cards (`rooms.html`) and the room details header (`room-details.html`).
- **Dynamic Navigation Badge:** Automatically syncs and updates the count badge (`.wishlist-count-badge`) in both desktop and mobile navigation across all 11 pages.
- **Dedicated Management View:** Displays saved rooms with specs, prices, and direct "Book" CTAs, individual removal buttons, a "Clear All" action, and an empty state banner with a call to explore accommodations.

---

## ⚙️ 4. Advanced Features Architecture

### Wishlist Flow & Synchronization
```
[User clicks heart button on Room Card / Room Details]
                     │
                     ▼
       window.GrandVistaWishlist.toggle(slug)
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
Update localStorage      Dispatch 'wishlist:updated'
['deluxe-room', ...]             │
                                 ▼
                     Update .wishlist-count-badge
                     in Desktop & Mobile Nav across pages
                                 │
                                 ▼
                     Re-render cards on wishlist.html (if active)
```

### Recently Viewed Rooms Architecture (`js/recently-viewed.js`)
- **Independent Storage Key:** `grandvista_recently_viewed`.
- **Capacity & Ordering:** Stores room slugs ordered most recent first, strictly capped at a maximum of 4 items.
- **De-duplication:** Re-viewing an existing accommodation moves it to the front of the list rather than creating duplicates.
- **Auto-Hiding Homepage Section:** If the list is empty (e.g. on first visit), the section is omitted entirely with zero flash of empty content. Once rooms are tracked, the section displays matching cards with specifications, real-time rates, and direct links to view details or book.

### Fullscreen Lightbox Pattern
- **Modal Container:** Focus-trapped container with `role="dialog"` and `aria-modal="true"`.
- **Keyboard Navigation:** <kbd>Escape</kbd> to close, <kbd>&larr;</kbd> for previous image, <kbd>&rarr;</kbd> for next image.
- **Touch Gesture Support:** Detects touch start and end horizontal displacement (`deltaX > 40px`) for seamless mobile swiping.

---

## 🚀 5. How to Run Locally

Because the website uses native `fetch()` to load `data/rooms.json`, running via any local HTTP server is recommended:

### Option A: VS Code Live Server (Recommended)
1. Open the `hotel-website` folder in VS Code.
2. Right click `index.html` (or any other page) and select **"Open with Live Server"**.

### Option B: Python 3 Built-In Server
Run from the `hotel-website` directory:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option C: Direct File Opening
Double-clicking any HTML file in your local file explorer will open directly. The built-in fallback dataset ensures all pages render smoothly even if your browser's security policy blocks `file:///` local fetch requests.

---

## 🛡️ 6. Quality & Accessibility Audit

- **Zero Third-Party Dependencies:** 100% pure semantic HTML5, modern CSS3 (Custom Properties, Flexbox, Grid), and vanilla JavaScript.
- **Responsive Layout:** Tested across mobile (375px), tablet (768px), and desktop (1024px+). No horizontal scrolling or overflow bugs.
- **SEO Ready:** Every page includes distinct `<title>`, unique `<meta name="description">`, OpenGraph tags, semantic `<h1>`–`<h3>` hierarchy, and descriptive image `alt` attributes.
- **Accessible Forms:** All `<input>`, `<select>`, and `<textarea>` controls have associated `<label>` elements or ARIA descriptions.
