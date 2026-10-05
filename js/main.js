/**
 * GrandVista Hotel — Main JavaScript
 * Handles:
 * 1. Mobile Navigation & Sticky Header Scroll State
 * 2. Booking Search Widget Date Constraints & Validation
 * 3. Dynamic Fetch & Render for Featured Rooms from data/rooms.json
 * 4. Extensible utility functions for future Room Listing & Booking pages
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBookingWidget();
  loadFeaturedRooms();
});

/* ==========================================================================
   1. Navigation & Header
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header elevate effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });

  // Mobile menu hamburger toggle
  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking any nav link
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Ensure wishlist.js is loaded and navigation badge is synced
  if (!window.GrandVistaWishlist) {
    const script = document.createElement('script');
    script.src = 'js/wishlist.js';
    script.onload = () => {
      window.GrandVistaWishlist?.updateNavBadge();
    };
    document.head.appendChild(script);
  } else {
    window.GrandVistaWishlist.updateNavBadge();
  }
}

/* ==========================================================================
   2. Booking Search Widget Validation & Date Setup
   ========================================================================== */
function initBookingWidget() {
  const bookingForm = document.getElementById('booking-search-form');
  const checkinInput = document.getElementById('checkin-date');
  const checkoutInput = document.getElementById('checkout-date');
  const adultsInput = document.getElementById('adults-count');
  const alertBox = document.getElementById('booking-alert');

  if (!bookingForm || !checkinInput || !checkoutInput || !adultsInput) return;

  // Format Date object to YYYY-MM-DD string
  const formatDateToISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set today & tomorrow as default dates and min thresholds
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = formatDateToISO(today);
  const tomorrowStr = formatDateToISO(tomorrow);

  // Set HTML5 min constraints (prevents past dates in browser picker)
  checkinInput.min = todayStr;
  checkoutInput.min = tomorrowStr;

  // Set sensible initial values
  if (!checkinInput.value) checkinInput.value = todayStr;
  if (!checkoutInput.value) checkoutInput.value = tomorrowStr;

  // Dynamically update checkout min when checkin date changes
  checkinInput.addEventListener('change', () => {
    if (!checkinInput.value) return;

    const selectedCheckin = new Date(checkinInput.value);
    const minCheckout = new Date(selectedCheckin);
    minCheckout.setDate(minCheckout.getDate() + 1);
    const minCheckoutStr = formatDateToISO(minCheckout);

    checkoutInput.min = minCheckoutStr;

    // If current checkout is before or equal to checkin, adjust it automatically
    if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
      checkoutInput.value = minCheckoutStr;
    }
    hideAlert();
  });

  checkoutInput.addEventListener('change', () => {
    hideAlert();
  });

  adultsInput.addEventListener('input', () => {
    hideAlert();
  });

  // Form Submission Validation Handler
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const checkinVal = checkinInput.value;
    const checkoutVal = checkoutInput.value;
    const adultsVal = parseInt(adultsInput.value, 10);
    const childrenVal = parseInt(document.getElementById('children-count')?.value || '0', 10);
    const roomsVal = parseInt(document.getElementById('rooms-count')?.value || '1', 10);
    const roomTypeVal = document.getElementById('room-type')?.value || 'all';

    // 1. Validate check-in date is provided
    if (!checkinVal) {
      showAlert('Please select your check-in date.', 'error');
      checkinInput.focus();
      return;
    }

    // 2. Validate check-out date is provided
    if (!checkoutVal) {
      showAlert('Please select your check-out date.', 'error');
      checkoutInput.focus();
      return;
    }

    // 3. Validate no past dates for check-in
    const checkinDate = new Date(checkinVal);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfCheckin = new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate());

    if (startOfCheckin < startOfToday) {
      showAlert('Check-in date cannot be in the past. Please select today or a future date.', 'error');
      checkinInput.focus();
      return;
    }

    // 4. Validate check-out is after check-in (at least 1 night)
    const checkoutDate = new Date(checkoutVal);
    const startOfCheckout = new Date(checkoutDate.getFullYear(), checkoutDate.getMonth(), checkoutDate.getDate());

    if (startOfCheckout <= startOfCheckin) {
      showAlert('Check-out date must be after check-in date (minimum 1 night stay).', 'error');
      checkoutInput.focus();
      return;
    }

    // 5. Validate at least 1 adult
    if (isNaN(adultsVal) || adultsVal < 1) {
      showAlert('Please select at least 1 adult guest.', 'error');
      adultsInput.focus();
      return;
    }

    // Calculate nights for feedback
    const diffTime = Math.abs(startOfCheckout - startOfCheckin);
    const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Success State Confirmation
    const roomTypeDisplay = roomTypeVal === 'all' ? 'All Room Categories' : roomTypeVal;
    const successMsg = `✓ Availability confirmed for ${diffNights} night(s) • ${adultsVal} Adult(s)${
      childrenVal > 0 ? `, ${childrenVal} Child(ren)` : ''
    } • ${roomsVal} Room(s) (${roomTypeDisplay}). Redirecting to booking...`;

    showAlert(successMsg, 'success');

    // Smooth scroll to featured rooms for immediate exploration
    const featuredSection = document.getElementById('featured-rooms');
    if (featuredSection) {
      setTimeout(() => {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }, 700);
    }
  });

  function showAlert(message, type) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `booking-alert is-${type}`;
    alertBox.setAttribute('role', 'alert');
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.className = 'booking-alert';
    alertBox.textContent = '';
  }
}

/* ==========================================================================
   3. Featured Rooms Dynamic Fetch & Render
   ========================================================================== */
async function loadFeaturedRooms() {
  const container = document.getElementById('featured-rooms-list');
  if (!container) return;

  try {
    const response = await fetch('data/rooms.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rooms = await response.json();

    // Pull 3 rooms (prefer is_featured: true, or first 3)
    const featuredRooms = rooms.filter((r) => r.is_featured).slice(0, 3);
    const displayRooms = featuredRooms.length >= 3 ? featuredRooms : rooms.slice(0, 3);

    renderFeaturedRooms(displayRooms, container);
  } catch (err) {
    console.warn('Could not fetch data/rooms.json directly (e.g. file:// protocol restriction). Using local fallback dataset.', err);
    // Fallback data ensures page always renders properly even if opened as a local file without a live server
    renderFeaturedRooms(getFallbackRooms(), container);
  }
}

function renderFeaturedRooms(rooms, container) {
  if (!container) return;

  if (!rooms || rooms.length === 0) {
    container.innerHTML = `
      <div class="rooms-error">
        <p>No featured rooms are available at the moment. Please check back shortly.</p>
      </div>
    `;
    return;
  }

  const cardsHtml = rooms
    .map((room) => {
      const formattedPrice = formatCurrencyINR(room.price_per_night);
      const statusLabel = formatStatusLabel(room.availability_status);
      const statusClass = `room-card__status-badge--${room.availability_status || 'available'}`;

      // Pick top 4 amenities for concise display on card
      const amenitiesHtml = (room.amenities || [])
        .slice(0, 4)
        .map((a) => `<span class="room-amenity-pill">${escapeHTML(a)}</span>`)
        .join('');

      const wishlistBtnHtml = window.GrandVistaWishlist
        ? window.GrandVistaWishlist.renderHeartButton(room.slug)
        : `<button type="button" class="wishlist-toggle-btn" data-wishlist-slug="${escapeHTML(room.slug)}" aria-label="Save to wishlist"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>`;

      return `
      <article class="room-card" data-room-id="${room.id}">
        <div class="room-card__media">
          ${wishlistBtnHtml}
          <img 
            src="${escapeHTML(room.image || 'images/rooms/deluxe-room.svg')}" 
            alt="${escapeHTML(room.name)}" 
            class="room-card__img" 
            loading="lazy"
          />
          <span class="room-card__status-badge ${statusClass}">
            ${statusLabel}
          </span>
        </div>

        <div class="room-card__body">
          <span class="room-card__view-tag">${escapeHTML(room.view || 'Luxury View')}</span>
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
              <a href="#" class="btn btn--outline-dark btn--sm" data-slug="${escapeHTML(room.slug)}">View Details</a>
              <a href="#" class="btn btn--primary btn--sm" data-slug="${escapeHTML(room.slug)}">Book Now</a>
            </div>
          </div>
        </div>
      </article>
    `;
    })
    .join('');

  container.innerHTML = cardsHtml;
}

/* ==========================================================================
   4. Helper Utilities (INR Currency, Safe Escaping, Status Labels)
   ========================================================================== */
function formatCurrencyINR(amount) {
  if (typeof amount !== 'number') return '0';
  return amount.toLocaleString('en-IN');
}

function formatStatusLabel(status) {
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

/* Safe Fallback Dataset (Used if CORS blocks local file:// fetch) */
function getFallbackRooms() {
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
      is_featured: true,
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
      is_featured: true,
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
      is_featured: true,
    },
  ];
}
