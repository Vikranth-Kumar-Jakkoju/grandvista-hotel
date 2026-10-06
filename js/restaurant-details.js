/**
 * GrandVista Hotel — Restaurant Details & Digital Menu Module
 * Dynamic venue rendering via ?restaurant=<slug>
 * Handles:
 * 1. Venue overview & specifications
 * 2. Lightbox photo gallery
 * 3. Signature dish highlights
 * 4. Filterable digital menu with FSSAI Veg / Non-Veg indicators
 * 5. Interactive table reservation form (#reserve) with inline validation
 * File: js/restaurant-details.js
 */

(function () {
  'use strict';

  let allVenues = [];
  let currentVenue = null;
  let currentMenuItems = [];
  let activeMenuCategory = 'all';
  let lightboxGallery = [];
  let lightboxIndex = 0;

  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = (urlParams.get('restaurant') || 'grandvista-restaurant').toLowerCase();

    loadVenueData(slug);
    initReservationForm();
  }

  async function loadVenueData(slug) {
    try {
      const [resRestaurants, resMenus] = await Promise.all([
        fetch('backend/api/restaurants.php'),
        fetch(`backend/api/menu-items.php?restaurant=${encodeURIComponent(slug)}`)
      ]);

      if (!resRestaurants.ok) {
        console.error('Fetch error for backend/api/restaurants.php, status:', resRestaurants.status);
        showVenueError(`Server error ${resRestaurants.status}: Unable to load restaurant information. Please try again later.`);
        return;
      }
      if (!resMenus.ok) {
        console.error('Fetch error for backend/api/menu-items.php, status:', resMenus.status);
        showVenueError(`Server error ${resMenus.status}: Unable to load dining menu. Please try again later.`);
        return;
      }

      const restaurants = await resRestaurants.json();
      const menus = await resMenus.json();

      allVenues = Array.isArray(restaurants) ? restaurants : [];
      currentVenue = allVenues.find((v) => v.slug === slug) || allVenues[0];

      if (!currentVenue) {
        console.error('Restaurant not found for slug:', slug);
        showVenueError(`Requested restaurant "${slug}" could not be found.`);
        return;
      }

      currentMenuItems = Array.isArray(menus) ? menus : [];

      renderVenue(currentVenue);
      renderGallery(currentVenue);
      renderSignatureDishes(currentVenue);
      renderDigitalMenu();
      initMenuFilters();
      prefillReservationVenue(currentVenue);
    } catch (err) {
      console.error('Fetch error loading restaurant details:', err);
      showVenueError('Network error connecting to dining service. Please check your connection.');
    }
  }

  function showVenueError(message) {
    const main = document.querySelector('main');
    if (!main) return;
    const errorContainer = document.querySelector('.section--warm .container') || main;
    errorContainer.innerHTML = `
      <div class="rooms-empty-state" style="border-color: #ef4444; margin: 3rem auto; max-width: 600px; text-align: center;" role="alert">
        <div class="empty-state-icon" style="color: #ef4444;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 class="empty-state-title" style="color: #b91c1c;">Unable to Load Restaurant Information</h2>
        <p class="empty-state-desc">${message}</p>
        <a href="dining.html" class="btn btn--primary" style="margin-top: 1.5rem;">Return to Dining Overview</a>
      </div>
    `;
  }

  function renderVenue(venue) {
    document.title = `${venue.name} — GrandVista Hotel`;

    const breadcrumb = document.getElementById('venue-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = venue.name;

    const title = document.getElementById('venue-title');
    if (title) title.textContent = venue.name;

    const subtitle = document.getElementById('venue-subtitle');
    if (subtitle) subtitle.textContent = venue.subtitle;

    const desc = document.getElementById('venue-description');
    if (desc) desc.textContent = venue.description;

    const cuisinesContainer = document.getElementById('venue-cuisines');
    if (cuisinesContainer) {
      cuisinesContainer.innerHTML = venue.cuisine
        .map((c) => `<span class="dining-cuisine-pill">${c}</span>`)
        .join('');
    }

    const hoursVal = document.getElementById('venue-hours-val');
    if (hoursVal) hoursVal.textContent = venue.hours;

    const dressVal = document.getElementById('venue-dress-val');
    if (dressVal) dressVal.textContent = venue.dress_code;

    const locVal = document.getElementById('venue-location-val');
    if (locVal) locVal.textContent = venue.location;
  }

  function renderGallery(venue) {
    const grid = document.getElementById('restaurant-gallery-grid');
    if (!grid) return;

    lightboxGallery = venue.gallery || [];
    grid.innerHTML = lightboxGallery
      .map(
        (item, idx) => `
        <article class="restaurant-gallery-card" data-idx="${idx}" role="button" tabindex="0" aria-label="View: ${item.caption}">
          <img src="${item.src}" alt="${item.alt || item.caption}" loading="lazy" />
          <div class="restaurant-gallery-overlay">
            <span>${item.caption}</span>
          </div>
        </article>
      `
      )
      .join('');

    grid.querySelectorAll('.restaurant-gallery-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-idx'), 10) || 0;
        openLightbox(idx);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(card.getAttribute('data-idx'), 10) || 0;
          openLightbox(idx);
        }
      });
    });

    initLightboxControls();
  }

  function openLightbox(index) {
    if (!lightboxGallery.length) return;
    lightboxIndex = index;
    updateLightboxContent();

    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeBtn = document.getElementById('lightbox-close');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function updateLightboxContent() {
    if (!lightboxGallery.length) return;
    const item = lightboxGallery[lightboxIndex];
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    const cnt = document.getElementById('lightbox-counter');

    if (img) {
      img.src = item.src;
      img.alt = item.alt || item.caption;
    }
    if (cap) cap.textContent = item.caption;
    if (cnt) cnt.textContent = `${lightboxIndex + 1} / ${lightboxGallery.length}`;
  }

  function initLightboxControls() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxIndex = (lightboxIndex - 1 + lightboxGallery.length) % lightboxGallery.length;
        updateLightboxContent();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxIndex = (lightboxIndex + 1) % lightboxGallery.length;
        updateLightboxContent();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLightbox();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        lightboxIndex = (lightboxIndex - 1 + lightboxGallery.length) % lightboxGallery.length;
        updateLightboxContent();
      }
      if (e.key === 'ArrowRight') {
        lightboxIndex = (lightboxIndex + 1) % lightboxGallery.length;
        updateLightboxContent();
      }
    });
  }

  function renderSignatureDishes(venue) {
    const grid = document.getElementById('signature-dishes-grid');
    if (!grid || !venue.signature_dishes) return;

    grid.innerHTML = venue.signature_dishes
      .map(
        (dish) => `
        <article class="signature-dish-card">
          <img src="${dish.image}" alt="${dish.name}" class="signature-dish-img" loading="lazy" />
          <div class="signature-dish-body">
            <div class="signature-dish-header">
              <h4 class="signature-dish-title">
                <span class="dietary-badge ${dish.is_veg ? 'dietary-badge--veg' : 'dietary-badge--nonveg'}" title="${dish.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                <span>${dish.name}</span>
              </h4>
              <span class="signature-dish-price">₹${dish.price.toLocaleString('en-IN')}</span>
            </div>
            <p class="signature-dish-desc">${dish.description}</p>
          </div>
        </article>
      `
      )
      .join('');
  }

  function renderDigitalMenu() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    const filtered = activeMenuCategory === 'all'
      ? currentMenuItems
      : currentMenuItems.filter((item) => item.category === activeMenuCategory);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="rooms-empty-state" style="grid-column: 1 / -1;">
          <h4 class="empty-state-title">No items in this category</h4>
          <p class="empty-state-desc">Please choose another section to explore our curated culinary creations.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (item) => `
        <article class="menu-item-card">
          <div class="menu-item-header">
            <div class="menu-item-title-wrap">
              <span class="dietary-badge ${item.is_veg ? 'dietary-badge--veg' : 'dietary-badge--nonveg'}" title="${item.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
              <h4 class="menu-item-title">${item.name}</h4>
            </div>
            <span class="menu-item-price">₹${item.price.toLocaleString('en-IN')}</span>
          </div>
          <p class="menu-item-desc">${item.description}</p>
        </article>
      `
      )
      .join('');
  }

  function initMenuFilters() {
    const filterBtns = document.querySelectorAll('.menu-filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        activeMenuCategory = btn.getAttribute('data-category') || 'all';
        renderDigitalMenu();
      });
    });
  }

  function prefillReservationVenue(venue) {
    if (!venue) return;
    const venueSelect = document.getElementById('res-venue');
    if (venueSelect) {
      venueSelect.value = venue.slug;
      Array.from(venueSelect.options).forEach((opt) => {
        opt.defaultSelected = (opt.value === venue.slug);
      });
    }
    const venueHeading = document.getElementById('reserve-venue-name');
    if (venueHeading) {
      venueHeading.textContent = venue.name;
    }
  }

  function initReservationForm() {
    const form = document.getElementById('table-reservation-form');
    const dateInput = document.getElementById('res-date');
    const confirmationBox = document.getElementById('reservation-confirmation');
    const resetBtn = document.getElementById('res-reset-btn');
    const venueSelect = document.getElementById('res-venue');

    if (!form) return;

    // Helper to get today's local date string YYYY-MM-DD
    const getTodayStr = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Set today as min date
    if (dateInput) {
      const today = getTodayStr();
      dateInput.min = today;
      if (!dateInput.value) {
        dateInput.value = today;
      }
      dateInput.addEventListener('input', () => {
        showError('res-date-error', '');
      });
      dateInput.addEventListener('change', () => {
        showError('res-date-error', '');
      });
    }

    if (currentVenue) {
      prefillReservationVenue(currentVenue);
    }

    if (venueSelect) {
      venueSelect.addEventListener('change', () => {
        const venueHeading = document.getElementById('reserve-venue-name');
        if (venueHeading) {
          const selectedSlug = venueSelect.value;
          const matched = allVenues.find((v) => v.slug === selectedSlug);
          venueHeading.textContent = matched ? matched.name : (venueSelect.selectedIndex >= 0 ? venueSelect.options[venueSelect.selectedIndex].text : '');
        }
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      const date = document.getElementById('res-date')?.value.trim();
      const time = document.getElementById('res-time')?.value.trim();
      const guests = document.getElementById('res-guests')?.value.trim();
      const seating = document.getElementById('res-seating')?.value.trim();
      const name = document.getElementById('res-name')?.value.trim();
      const email = document.getElementById('res-email')?.value.trim();
      const phone = document.getElementById('res-phone')?.value.trim();
      
      // Determine venue name at submit time from actual selected value
      const selectedSlug = venueSelect ? venueSelect.value : (currentVenue ? currentVenue.slug : 'grandvista-restaurant');
      const matchedVenue = allVenues.find((v) => v.slug === selectedSlug);
      const venueName = matchedVenue ? matchedVenue.name : (venueSelect && venueSelect.selectedIndex >= 0 ? venueSelect.options[venueSelect.selectedIndex].text : (currentVenue ? currentVenue.name : 'GrandVista Restaurant'));

      const requests = document.getElementById('res-requests')?.value.trim();

      // Clear existing errors
      document.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));

      // Validate Date: must be provided and cannot be in the past
      const todayStr = getTodayStr();
      if (!date) {
        showError('res-date-error', 'Please select a reservation date.');
        isValid = false;
      } else if (date < todayStr) {
        showError('res-date-error', 'Reservation date cannot be in the past. Please select today or a future date.');
        isValid = false;
      }

      // Validate Time
      if (!time) {
        showError('res-time-error', 'Please select your preferred seating time.');
        isValid = false;
      }

      // Validate Name
      if (!name || name.length < 2) {
        showError('res-name-error', 'Please enter your full name (at least 2 letters).');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('res-email-error', 'Please provide a valid email address.');
        isValid = false;
      }

      // Validate Phone
      const phoneClean = phone.replace(/[^0-9]/g, '');
      if (!phone || phoneClean.length < 8) {
        showError('res-phone-error', 'Please provide a valid telephone number.');
        isValid = false;
      }

      if (!isValid) return;

      // Clear form error banner if present
      const alertEl = document.getElementById('res-form-general-error');
      if (alertEl) alertEl.style.display = 'none';

      // POST to backend/api/table-reservation.php
      let refNumber = '';
      const reservationData = {
        venue: selectedSlug,
        restaurant_id: matchedVenue ? matchedVenue.id : 1,
        name: name,
        email: email,
        phone: phone,
        date: date,
        time: time,
        guests: parseInt(guests, 10) || 2,
        seating: seating,
        requests: requests
      };

      try {
        const resp = await fetch('backend/api/table-reservation.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservationData)
        });
        if (!resp.ok) {
          console.error('Fetch error for backend/api/table-reservation.php, status:', resp.status);
          const errData = await resp.json().catch(() => ({}));
          const errMsg = errData.message || (Array.isArray(errData.errors) ? errData.errors.join(', ') : `Server error ${resp.status}: Unable to complete reservation.`);
          showReservationError(errMsg);
          return;
        }
        const data = await resp.json();
        if (data && data.success && (data.reference || data.data?.reference)) {
          refNumber = data.reference || data.data?.reference;
        } else {
          console.error('Fetch error for backend/api/table-reservation.php, unexpected response:', data);
          showReservationError(data?.message || 'Server did not return a valid confirmation.');
          return;
        }
      } catch (err) {
        console.error('Fetch error for backend/api/table-reservation.php:', err);
        showReservationError('Network error connecting to table reservation service. Please check your connection.');
        return;
      }

      // Render Confirmation
      if (confirmationBox) {
        document.getElementById('conf-ref-id').textContent = refNumber;
        document.getElementById('conf-guest-name').textContent = name;
        document.getElementById('conf-venue').textContent = venueName;
        document.getElementById('conf-datetime').textContent = `${date} at ${time}`;
        document.getElementById('conf-party').textContent = `${guests} Guests (${seating})`;
        if (requests) {
          document.getElementById('conf-notes-row').style.display = 'block';
          document.getElementById('conf-notes').textContent = requests;
        } else {
          document.getElementById('conf-notes-row').style.display = 'none';
        }

        form.style.display = 'none';
        confirmationBox.style.display = 'block';
        confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        // Always reset venue selector to current page's restaurant
        if (currentVenue) {
          prefillReservationVenue(currentVenue);
        }
        if (dateInput) {
          const today = getTodayStr();
          dateInput.min = today;
          dateInput.value = today;
        }
        document.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
        const alertEl = document.getElementById('res-form-general-error');
        if (alertEl) alertEl.style.display = 'none';
        if (confirmationBox) confirmationBox.style.display = 'none';
        form.style.display = 'block';
      });
    }
  }

  function showReservationError(message) {
    let alertEl = document.getElementById('res-form-general-error');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.id = 'res-form-general-error';
      alertEl.className = 'form-error';
      alertEl.style.cssText = 'color: #b91c1c; font-size: 0.875rem; margin-bottom: 12px; text-align: center; padding: 10px; background: #fee2e2; border-radius: 4px; border: 1px solid #f87171;';
      const form = document.getElementById('table-reservation-form');
      if (form) {
        const submitWrap = form.querySelector('.reservation-grid__full:last-of-type') || form;
        submitWrap.prepend(alertEl);
      }
    }
    alertEl.textContent = message;
    alertEl.style.display = 'block';
    alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
