/**
 * GrandVista Hotel — Recently Viewed Rooms Module
 * File: js/recently-viewed.js
 *
 * Tracks viewed room slugs in localStorage (max 4, most recent first, no duplicates).
 * Renders recently viewed room cards into any target container.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'grandvista_recently_viewed';
  const MAX_ITEMS = 4;

  const RecentlyViewed = {
    /**
     * Get array of stored room slugs from localStorage (most recent first)
     * @returns {string[]}
     */
    getAll() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.warn('Could not read recently viewed rooms from localStorage:', err);
        return [];
      }
    },

    /**
     * Track a viewed room slug.
     * Moves to front if already viewed, caps list at MAX_ITEMS (4).
     * @param {string} slug
     */
    track(slug) {
      if (!slug || typeof slug !== 'string') return;
      const cleanSlug = slug.trim().toLowerCase();
      let list = this.getAll();

      // Remove if already present so it moves to front
      list = list.filter((s) => s !== cleanSlug);

      // Add to front
      list.unshift(cleanSlug);

      // Cap at MAX_ITEMS (4)
      if (list.length > MAX_ITEMS) {
        list = list.slice(0, MAX_ITEMS);
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (err) {
        console.warn('Could not save recently viewed rooms to localStorage:', err);
      }
    },

    /**
     * Fetches room data from data/rooms.json and renders cards into containerId.
     * Hides the entire section wrapper if the list is empty (no empty state).
     * @param {string} containerId
     */
    async render(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const sectionWrapper = container.closest('section') || container.parentElement;
      const slugs = this.getAll();

      // Hide section if list is empty (do not show empty state on homepage)
      if (!slugs || slugs.length === 0) {
        if (sectionWrapper) {
          sectionWrapper.style.display = 'none';
        }
        container.innerHTML = '';
        return;
      }

      let allRooms = [];
      try {
        const response = await fetch('data/rooms.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        allRooms = await response.json();
      } catch (err) {
        console.warn('RecentlyViewed using local fallback dataset:', err);
        allRooms = this._getFallbackRooms();
      }

      // Filter and order rooms to match slugs array order (most recent first)
      const matchedRooms = [];
      slugs.forEach((slug) => {
        const found = allRooms.find((r) => r.slug.toLowerCase() === slug);
        if (found) matchedRooms.push(found);
      });

      if (matchedRooms.length === 0) {
        if (sectionWrapper) sectionWrapper.style.display = 'none';
        container.innerHTML = '';
        return;
      }

      // Show section if it was hidden
      if (sectionWrapper) {
        sectionWrapper.style.display = '';
      }

      const cardsHtml = matchedRooms
        .map((room) => {
          const formattedPrice = room.price_per_night ? room.price_per_night.toLocaleString('en-IN') : '';
          const statusClass = `room-card__status-badge--${room.availability_status || 'available'}`;
          const statusLabel = room.availability_status === 'limited'
            ? 'Limited Availability'
            : room.availability_status === 'sold_out'
            ? 'Sold Out'
            : 'Available';

          const wishlistBtnHtml = window.GrandVistaWishlist
            ? window.GrandVistaWishlist.renderHeartButton(room.slug)
            : '';

          return `
            <article class="room-card" data-room-id="${room.id}">
              <div class="room-card__media">
                ${wishlistBtnHtml}
                <img 
                  src="${this._escapeHTML(room.image || 'images/rooms/deluxe-room.svg')}" 
                  alt="${this._escapeHTML(room.name)}" 
                  class="room-card__img" 
                  loading="lazy"
                />
                <span class="room-card__status-badge ${statusClass}">
                  ${statusLabel}
                </span>
              </div>

              <div class="room-card__body">
                <span class="room-card__view-tag">${this._escapeHTML(room.view || 'Scenic View')}</span>
                <h3 class="room-card__title">${this._escapeHTML(room.name)}</h3>
                
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
                    <span class="room-spec__value">${this._escapeHTML(room.bed_type)}</span>
                  </div>
                </div>

                <div class="room-card__footer" style="margin-top: auto; padding-top: var(--space-sm);">
                  <div class="room-card__price-box">
                    <span class="room-card__price-amount">₹${formattedPrice}</span>
                    <span class="room-card__price-period">/ night</span>
                  </div>

                  <div class="room-card__actions">
                    <a href="room-details.html?room=${encodeURIComponent(room.slug)}" class="btn btn--outline-dark btn--sm">View Details</a>
                    <a href="booking.html#${encodeURIComponent(room.slug)}" class="btn btn--primary btn--sm">Book</a>
                  </div>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      container.innerHTML = cardsHtml;
    },

    _escapeHTML(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    _getFallbackRooms() {
      return [
        { id: 1, slug: 'deluxe-room', name: 'Deluxe Room', type: 'Deluxe', price_per_night: 5500, size_sqft: 380, max_guests: 2, bed_type: 'King Bed', view: 'City View', image: 'images/rooms/deluxe-room.svg', availability_status: 'available' },
        { id: 2, slug: 'premium-room', name: 'Premium Room', type: 'Premium', price_per_night: 7800, size_sqft: 460, max_guests: 2, bed_type: 'King Bed', view: 'Garden View', image: 'images/rooms/premium-room.svg', availability_status: 'available' },
        { id: 3, slug: 'executive-suite', name: 'Executive Suite', type: 'Executive', price_per_night: 12500, size_sqft: 650, max_guests: 3, bed_type: 'Super King Bed', view: 'Panoramic Skyline View', image: 'images/rooms/executive-suite.svg', availability_status: 'limited' },
        { id: 4, slug: 'family-room', name: 'Family Room', type: 'Family', price_per_night: 10200, size_sqft: 580, max_guests: 4, bed_type: '2 Queen Beds', view: 'Courtyard View', image: 'images/rooms/family-room.svg', availability_status: 'available' },
        { id: 5, slug: 'suite', name: 'Suite', type: 'Suite', price_per_night: 21500, size_sqft: 920, max_guests: 4, bed_type: 'California King Bed', view: 'Panoramic Skyline View', image: 'images/rooms/suite.svg', availability_status: 'sold_out' }
      ];
    }
  };

  // Expose public API
  window.RecentlyViewed = RecentlyViewed;
  window.GrandVistaRecentlyViewed = RecentlyViewed;
})();
