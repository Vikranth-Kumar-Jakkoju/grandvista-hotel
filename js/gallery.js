/**
 * GrandVista Hotel — Hotel Photo Gallery & Reusable Lightbox
 * File: js/gallery.js
 */

(function () {
  'use strict';

  // Gallery Data
  const galleryItems = [
    { id: 1, category: 'exterior', title: 'Grand Heritage Facade', desc: 'Colonial classical architecture illuminated at dusk', src: 'images/hotel/exterior.svg' },
    { id: 2, category: 'lobby', title: 'The Grand Reception Atrium', desc: 'Handcrafted crystal chandeliers and Italian marble floors', src: 'images/hotel/lobby.svg' },
    { id: 3, category: 'rooms', title: 'Deluxe Room & City Panorama', desc: 'Plush walnut appointments and floor-to-ceiling skyline views', src: 'images/rooms/deluxe-room.svg' },
    { id: 4, category: 'pool', title: 'Rooftop Heated Infinity Pool', desc: 'Panoramic Visakhapatnam coastal views and sunset cocktail terrace', src: 'images/hotel/pool.svg' },
    { id: 5, category: 'restaurant', title: 'The Sommelier Cellar & Fine Dining', desc: 'Michelin-calibre gastronomy and vintage sommelier collection', src: 'images/hotel/restaurant.svg' },
    { id: 6, category: 'spa', title: 'Ayurvedic & Holistic Wellness Spa', desc: 'Private herbal steam suites and ancient rejuvenating treatments', src: 'images/hotel/spa.svg' },
    { id: 7, category: 'events', title: 'Imperial Grand Ballroom', desc: 'Colonial arched ceilings for state banquets and royal celebrations', src: 'images/hotel/events.svg' },
    { id: 8, category: 'rooms', title: 'Premium Room Private Balcony', desc: 'Step-out terrace overlooking manicured courtyard gardens', src: 'images/rooms/premium-room.svg' },
    { id: 9, category: 'rooms', title: 'Executive Suite Master Salon', desc: 'Expansive private parlor and ergonomic marble executive work desk', src: 'images/rooms/executive-suite.svg' },
    { id: 10, category: 'rooms', title: 'Presidential Grand Suite', desc: 'Wraparound terrace, dining salon and 24h butler service', src: 'images/rooms/suite.svg' },
    { id: 11, category: 'rooms', title: 'Ensuite Marble Bathroom & Tub', desc: 'Deep-soaking freestanding oval bathtub and rain shower', src: 'images/rooms/gallery/bathroom.svg' },
    { id: 12, category: 'exterior', title: 'Hotel Portico & Coastal Gardens', desc: 'Private chauffeured porte-cochere and manicured palms', src: 'images/hotel/hotel-intro.svg' },
  ];

  let currentCategory = 'all';
  let activeFilteredList = [...galleryItems];
  let lightboxIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  const DOM = {
    grid: document.getElementById('gallery-catalog-grid'),
    filterBtns: document.querySelectorAll('.gallery-filter-btn'),
    lightboxModal: document.getElementById('lightbox-modal'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxCaption: document.getElementById('lightbox-caption'),
    lightboxCounter: document.getElementById('lightbox-counter'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxPrev: document.getElementById('lightbox-prev'),
    lightboxNext: document.getElementById('lightbox-next'),
  };

  document.addEventListener('DOMContentLoaded', initGallery);

  function initGallery() {
    renderGalleryGrid();
    bindFilterButtons();
    bindLightboxEvents();
  }

  function bindFilterButtons() {
    DOM.filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        DOM.filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        currentCategory = btn.dataset.category || 'all';
        if (currentCategory === 'all') {
          activeFilteredList = [...galleryItems];
        } else {
          activeFilteredList = galleryItems.filter((item) => item.category === currentCategory);
        }

        renderGalleryGrid();
      });
    });
  }

  function renderGalleryGrid() {
    if (!DOM.grid) return;

    if (activeFilteredList.length === 0) {
      DOM.grid.innerHTML = `
        <div class="rooms-empty-state" style="grid-column: 1 / -1;">
          <p class="empty-state-title">No photos found in this category.</p>
        </div>
      `;
      return;
    }

    DOM.grid.innerHTML = activeFilteredList
      .map(
        (item, idx) => `
        <article 
          class="gallery-card-item" 
          data-index="${idx}" 
          role="button" 
          tabindex="0" 
          aria-label="View photo: ${escapeHTML(item.title)}"
        >
          <img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.title)} - ${escapeHTML(item.desc)}" loading="lazy" />
          <div class="gallery-card-overlay">
            <span class="gallery-card-category">${escapeHTML(item.category)}</span>
            <h3 class="gallery-card-title">${escapeHTML(item.title)}</h3>
          </div>
        </article>
      `
      )
      .join('');

    // Attach click events
    DOM.grid.querySelectorAll('.gallery-card-item').forEach((card) => {
      const open = () => {
        const index = parseInt(card.dataset.index, 10);
        if (!isNaN(index)) {
          openLightbox(index);
        }
      };

      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  }

  function bindLightboxEvents() {
    if (DOM.lightboxClose) DOM.lightboxClose.addEventListener('click', closeLightbox);
    if (DOM.lightboxPrev) DOM.lightboxPrev.addEventListener('click', prevImage);
    if (DOM.lightboxNext) DOM.lightboxNext.addEventListener('click', nextImage);

    if (DOM.lightboxModal) {
      DOM.lightboxModal.addEventListener('click', (e) => {
        if (e.target === DOM.lightboxModal) closeLightbox();
      });

      // Touch swipe
      DOM.lightboxModal.addEventListener(
        'touchstart',
        (e) => {
          if (e.touches && e.touches.length > 0) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }
        },
        { passive: true }
      );

      DOM.lightboxModal.addEventListener(
        'touchend',
        (e) => {
          if (!e.changedTouches || e.changedTouches.length === 0) return;
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          const deltaY = e.changedTouches[0].clientY - touchStartY;

          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) nextImage();
            else prevImage();
          }
        },
        { passive: true }
      );
    }

    // Keyboard keys
    window.addEventListener('keydown', (e) => {
      if (!DOM.lightboxModal || !DOM.lightboxModal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
    });
  }

  function openLightbox(index) {
    if (!DOM.lightboxModal || index < 0 || index >= activeFilteredList.length) return;
    lightboxIndex = index;
    updateLightbox();
    DOM.lightboxModal.classList.add('is-open');
    DOM.lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!DOM.lightboxModal) return;
    DOM.lightboxModal.classList.remove('is-open');
    DOM.lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function prevImage() {
    lightboxIndex = (lightboxIndex - 1 + activeFilteredList.length) % activeFilteredList.length;
    updateLightbox();
  }

  function nextImage() {
    lightboxIndex = (lightboxIndex + 1) % activeFilteredList.length;
    updateLightbox();
  }

  function updateLightbox() {
    const item = activeFilteredList[lightboxIndex];
    if (!item) return;

    if (DOM.lightboxImg) {
      DOM.lightboxImg.src = item.src;
      DOM.lightboxImg.alt = item.title;
    }
    if (DOM.lightboxCaption) {
      DOM.lightboxCaption.innerHTML = `<strong>${escapeHTML(item.title)}</strong> &mdash; ${escapeHTML(item.desc)}`;
    }
    if (DOM.lightboxCounter) {
      DOM.lightboxCounter.textContent = `${lightboxIndex + 1} / ${activeFilteredList.length}`;
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
})();
