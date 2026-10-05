/**
 * GrandVista Hotel — Rooms Listing, Filtering & Sorting
 * File: js/filters.js
 * 
 * Features:
 * 1. Fetches all room records from data/rooms.json (with file:// fallback)
 * 2. Multi-parameter client-side filtering:
 *    - Room Type
 *    - Max Guests
 *    - Bed Type
 *    - Price Range (Min/Max INR)
 *    - Room Size (Sq Ft)
 *    - View
 *    - Amenities (Multi-select checkboxes)
 * 3. Sorting (Price Asc/Desc, Room Size, Featured First)
 * 4. Dynamic empty state with one-click filter reset
 * 5. Card rendering with conditional "Sold Out" state and deep links
 */

(function () {
  'use strict';

  // State
  let allRooms = [];
  let currentFilteredRooms = [];

  // DOM Elements Cache
  const DOM = {
    grid: document.getElementById('all-rooms-grid'),
    resultsCount: document.getElementById('results-count'),
    filterType: document.getElementById('filter-type'),
    filterGuests: document.getElementById('filter-guests'),
    filterBed: document.getElementById('filter-bed'),
    filterPriceMin: document.getElementById('filter-price-min'),
    filterPriceMax: document.getElementById('filter-price-max'),
    filterSize: document.getElementById('filter-size'),
    filterView: document.getElementById('filter-view'),
    filterAmenities: document.querySelectorAll('.amenity-checkbox'),
    sortSelect: document.getElementById('sort-rooms'),
    resetBtn: document.getElementById('reset-filters-btn'),
  };

  document.addEventListener('DOMContentLoaded', initRoomsPage);

  /**
   * Initialize Rooms Page: fetch data and set up event listeners
   */
  async function initRoomsPage() {
    if (!DOM.grid) return;

    try {
      const response = await fetch('data/rooms.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      allRooms = await response.json();
    } catch (err) {
      console.warn('Using local rooms fallback dataset due to fetch limitation:', err);
      allRooms = getLocalFallbackRooms();
    }

    // Populate initial views and bed types dynamically if needed or bind filters
    bindEventListeners();
    applyFiltersAndSort();
  }

  /**
   * Bind event listeners to all interactive filter controls
   */
  function bindEventListeners() {
    // Select dropdowns
    [DOM.filterType, DOM.filterGuests, DOM.filterBed, DOM.filterSize, DOM.filterView].forEach((el) => {
      if (el) el.addEventListener('change', applyFiltersAndSort);
    });

    // Price range inputs (with debounce on input, or on change)
    if (DOM.filterPriceMin) DOM.filterPriceMin.addEventListener('input', applyFiltersAndSort);
    if (DOM.filterPriceMax) DOM.filterPriceMax.addEventListener('input', applyFiltersAndSort);

    // Multi-select amenity checkboxes
    if (DOM.filterAmenities) {
      DOM.filterAmenities.forEach((checkbox) => {
        checkbox.addEventListener('change', applyFiltersAndSort);
      });
    }

    // Sort select
    if (DOM.sortSelect) {
      DOM.sortSelect.addEventListener('change', applyFiltersAndSort);
    }

    // Reset button
    if (DOM.resetBtn) {
      DOM.resetBtn.addEventListener('click', resetAllFilters);
    }
  }

  /**
   * Primary filter & sort controller (filtered-then-sorted pipeline)
   */
  function applyFiltersAndSort() {
    // 1. Gather active filter values
    const selectedType = DOM.filterType ? DOM.filterType.value : 'all';
    const selectedGuests = DOM.filterGuests ? DOM.filterGuests.value : 'any';
    const selectedBed = DOM.filterBed ? DOM.filterBed.value : 'all';
    const selectedSize = DOM.filterSize ? DOM.filterSize.value : 'any';
    const selectedView = DOM.filterView ? DOM.filterView.value : 'all';

    const minPrice = DOM.filterPriceMin && DOM.filterPriceMin.value ? Number(DOM.filterPriceMin.value) : 0;
    const maxPrice = DOM.filterPriceMax && DOM.filterPriceMax.value ? Number(DOM.filterPriceMax.value) : Infinity;

    const checkedAmenities = Array.from(document.querySelectorAll('.amenity-checkbox:checked')).map(
      (cb) => cb.value
    );

    // 2. Filter pipeline
    let filtered = allRooms.filter((room) => {
      // Room Type
      if (selectedType !== 'all' && room.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Max Guests
      if (selectedGuests !== 'any') {
        const requiredGuests = parseInt(selectedGuests, 10);
        if (room.max_guests < requiredGuests) return false;
      }

      // Bed Type
      if (selectedBed !== 'all' && room.bed_type !== selectedBed) {
        return false;
      }

      // Room Size (min sq ft)
      if (selectedSize !== 'any') {
        const minSqft = parseInt(selectedSize, 10);
        if (room.size_sqft < minSqft) return false;
      }

      // View
      if (selectedView !== 'all' && room.view !== selectedView) {
        return false;
      }

      // Price Range (INR)
      if (room.price_per_night < minPrice || room.price_per_night > maxPrice) {
        return false;
      }

      // Multi-Select Amenities (Room must contain ALL checked amenities)
      if (checkedAmenities.length > 0) {
        const hasAllAmenities = checkedAmenities.every((amenity) =>
          room.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    // 3. Sort pipeline
    const sortMode = DOM.sortSelect ? DOM.sortSelect.value : 'featured';

    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'price-asc':
          return a.price_per_night - b.price_per_night;
        case 'price-desc':
          return b.price_per_night - a.price_per_night;
        case 'size-desc':
          return b.size_sqft - a.size_sqft;
        case 'featured':
        default:
          // Featured first, then by ID
          if (a.is_featured === b.is_featured) {
            return a.id - b.id;
          }
          return a.is_featured ? -1 : 1;
      }
    });

    currentFilteredRooms = filtered;

    // 4. Update UI results counter & render cards
    updateResultsCount(filtered.length, allRooms.length);
    renderCards(filtered);
  }

  /**
   * Render Room Cards or Empty State
   */
  function renderCards(rooms) {
    if (!DOM.grid) return;

    if (rooms.length === 0) {
      DOM.grid.innerHTML = `
        <div class="rooms-empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3 class="empty-state-title">No Accommodations Found</h3>
          <p class="empty-state-desc">
            No rooms match your specific combination of filters. Try broadening your criteria or reset filters to explore all available rooms.
          </p>
          <button type="button" class="btn btn--primary btn--sm" id="empty-reset-btn">
            Reset All Filters
          </button>
        </div>
      `;

      const emptyResetBtn = document.getElementById('empty-reset-btn');
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener('click', resetAllFilters);
      }
      return;
    }

    const cardsHtml = rooms
      .map((room) => {
        const isSoldOut = room.availability_status === 'sold_out';
        const formattedPrice = room.price_per_night.toLocaleString('en-IN');
        const statusLabel = getStatusLabel(room.availability_status);
        const statusClass = `room-card__status-badge--${room.availability_status || 'available'}`;

        // Top 4 amenities pills
        const amenitiesHtml = (room.amenities || [])
          .slice(0, 4)
          .map((a) => `<span class="room-amenity-pill">${escapeHTML(a)}</span>`)
          .join('');

        // Action CTA: Disabled Sold Out vs Book Now (links to booking.html#slug)
        const bookNowHtml = isSoldOut
          ? `<button class="btn btn--primary btn--sm btn--disabled" disabled aria-disabled="true" title="Currently Sold Out">Sold Out</button>`
          : `<a href="booking.html#${escapeHTML(room.slug)}" class="btn btn--primary btn--sm" data-slug="${escapeHTML(room.slug)}">Book Now</a>`;

        const wishlistBtnHtml = window.GrandVistaWishlist
          ? window.GrandVistaWishlist.renderHeartButton(room.slug)
          : `<button type="button" class="wishlist-toggle-btn" data-wishlist-slug="${escapeHTML(room.slug)}" aria-label="Save to wishlist"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>`;

        return `
          <article class="room-card" data-room-id="${room.id}">
            <div class="room-card__media">
              ${wishlistBtnHtml}
              <img 
                src="${escapeHTML(room.image || 'images/rooms/deluxe-room.svg')}" 
                alt="${escapeHTML(room.name)} at GrandVista Hotel" 
                class="room-card__img" 
                loading="lazy"
              />
              <span class="room-card__status-badge ${statusClass}">
                ${statusLabel}
              </span>
            </div>

            <div class="room-card__body">
              <span class="room-card__view-tag">${escapeHTML(room.view || 'Scenic View')}</span>
              <h3 class="room-card__title">${escapeHTML(room.name)}</h3>
              <p class="room-card__desc">${escapeHTML(room.description || '')}</p>

              <div class="room-card__specs">
                <div class="room-spec">
                  <span class="room-spec__label">Size</span>
                  <span class="room-spec__value">${room.size_sqft} sq ft</span>
                </div>
                <div class="room-spec">
                  <span class="room-spec__label">Guests</span>
                  <span class="room-spec__value">Max ${room.max_guests}</span>
                </div>
                <div class="room-spec">
                  <span class="room-spec__label">Bed</span>
                  <span class="room-spec__value">${escapeHTML(room.bed_type)}</span>
                </div>
              </div>

              <div class="room-card__amenities">
                ${amenitiesHtml}
              </div>

              <div class="room-card__footer">
                <div class="room-card__price-box">
                  <span class="room-card__price-from">Starting from</span>
                  <span class="room-card__price-amount">₹${formattedPrice}</span>
                  <span class="room-card__price-period">per night + taxes</span>
                </div>

                <div class="room-card__actions">
                  <a href="room-details.html?room=${escapeHTML(room.slug)}" class="btn btn--outline-dark btn--sm">
                    View Details
                  </a>
                  ${bookNowHtml}
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    DOM.grid.innerHTML = cardsHtml;
  }

  /**
   * Reset all filter inputs to default state
   */
  function resetAllFilters() {
    if (DOM.filterType) DOM.filterType.value = 'all';
    if (DOM.filterGuests) DOM.filterGuests.value = 'any';
    if (DOM.filterBed) DOM.filterBed.value = 'all';
    if (DOM.filterSize) DOM.filterSize.value = 'any';
    if (DOM.filterView) DOM.filterView.value = 'all';
    if (DOM.filterPriceMin) DOM.filterPriceMin.value = '';
    if (DOM.filterPriceMax) DOM.filterPriceMax.value = '';
    if (DOM.sortSelect) DOM.sortSelect.value = 'featured';

    const checkedBoxes = document.querySelectorAll('.amenity-checkbox:checked');
    checkedBoxes.forEach((cb) => (cb.checked = false));

    applyFiltersAndSort();
  }

  /**
   * Update the results count display banner
   */
  function updateResultsCount(count, total) {
    if (!DOM.resultsCount) return;
    DOM.resultsCount.innerHTML = `Showing <strong>${count}</strong> of <strong>${total}</strong> luxury accommodations`;
  }

  function getStatusLabel(status) {
    switch (status) {
      case 'limited':
        return 'Limited Availability';
      case 'sold_out':
        return 'Sold Out';
      case 'available':
      default:
        return 'Available';
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Fallback dataset matching data/rooms.json (if file:// CORS restriction is active)
   */
  function getLocalFallbackRooms() {
    return [
      {
        id: 1,
        slug: 'deluxe-room',
        name: 'Deluxe Room',
        type: 'Deluxe',
        price_per_night: 5500,
        size_sqft: 380,
        max_guests: 2,
        bed_type: 'King Bed',
        view: 'City View',
        description: 'An elegantly appointed sanctuary featuring custom walnut furnishings, Italian marble bathroom with rain shower, and sweeping views of the vibrant city skyline.',
        amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Work Desk', 'Air Conditioning'],
        availability_status: 'available',
        image: 'images/rooms/deluxe-room.svg',
        is_featured: true
      },
      {
        id: 2,
        slug: 'premium-room',
        name: 'Premium Room',
        type: 'Premium',
        price_per_night: 7800,
        size_sqft: 460,
        max_guests: 2,
        bed_type: 'King Bed',
        view: 'Garden View',
        description: 'Designed for discerning guests, featuring a private step-out balcony overlooking manicured courtyard gardens, luxury plush bedding, and an exquisite soaking bathtub.',
        amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Bathtub', 'Balcony', 'Work Desk', 'Air Conditioning'],
        availability_status: 'available',
        image: 'images/rooms/premium-room.svg',
        is_featured: true
      },
      {
        id: 3,
        slug: 'executive-suite',
        name: 'Executive Suite',
        type: 'Executive',
        price_per_night: 12500,
        size_sqft: 650,
        max_guests: 3,
        bed_type: 'Super King Bed',
        view: 'Panoramic Skyline View',
        description: 'A sophisticated corner suite boasting an expansive separate lounge salon, ergonomic executive workstation, deep marble bath, and dedicated concierge privilege.',
        amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Bathtub', 'Balcony', 'Work Desk', 'Air Conditioning'],
        availability_status: 'limited',
        image: 'images/rooms/executive-suite.svg',
        is_featured: true
      },
      {
        id: 4,
        slug: 'family-room',
        name: 'Family Room',
        type: 'Family',
        price_per_night: 10200,
        size_sqft: 580,
        max_guests: 4,
        bed_type: '2 Queen Beds',
        view: 'Courtyard View',
        description: 'Thoughtfully crafted for families seeking seamless togetherness without compromising on luxury, offering twin plush queen beds and an inviting residential seating alcove.',
        amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Balcony', 'Work Desk', 'Air Conditioning'],
        availability_status: 'available',
        image: 'images/rooms/family-room.svg',
        is_featured: false
      },
      {
        id: 5,
        slug: 'suite',
        name: 'Suite',
        type: 'Suite',
        price_per_night: 21500,
        size_sqft: 920,
        max_guests: 4,
        bed_type: 'California King Bed',
        view: 'Panoramic Skyline View',
        description: 'The crowning jewel of GrandVista. Features a grand master bedroom, private dining alcove, wraparound open-air terrace, and bespoke 24-hour butler assistance.',
        amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Bathtub', 'Balcony', 'Work Desk', 'Air Conditioning'],
        availability_status: 'limited',
        image: 'images/rooms/suite.svg',
        is_featured: false
      }
    ];
  }
})();
