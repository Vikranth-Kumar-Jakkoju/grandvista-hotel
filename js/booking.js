/**
 * GrandVista Hotel — Multi-Step Booking Engine
 * File: js/booking.js
 * 
 * Features:
 * 1. 6-Step In-Memory State Pipeline (No Page Reloads)
 * 2. Deep Linking (booking.html#<slug>) with automatic room pre-selection & skip to Step 2
 * 3. Step 1: Real-time Date & Guest Validation (min date today, check-out after check-in, >= 1 adult)
 * 4. Step 2: Dynamic Room Selection (filtering out sold_out rooms, interactive radio cards)
 * 5. Step 3: Contact Form Validation (required fields, email format, numeric phone length)
 * 6. Step 4: Add-On Services Calculation (night-scaled & flat fees, optional notes)
 * 7. Step 5: Live Financial Breakdown (room x nights + services + 12% taxes) with jump-back edit links
 * 8. Step 6: Confirmation Screen with unique reference generator (GVH-2026-#####) and reset
 */

(function () {
  'use strict';

  // State Store
  const bookingState = {
    currentStep: 1,
    dates: {
      checkin: '',
      checkout: '',
      nights: 1,
      adults: 2,
      children: 0,
      roomsCount: 1,
    },
    roomsList: [],
    selectedRoom: null,
    guest: {
      fullName: '',
      email: '',
      phone: '',
      country: 'India',
      guestsCount: 2,
    },
    services: {
      airport_pickup: { selected: false, name: 'Airport Pickup', price: 1200, isPerNight: false, note: '' },
      airport_drop: { selected: false, name: 'Airport Drop', price: 1200, isPerNight: false, note: '' },
      breakfast: { selected: false, name: 'Gourmet Breakfast Buffet', price: 600, isPerNight: true, note: '' },
      extra_bed: { selected: false, name: 'Rollaway Extra Bed', price: 800, isPerNight: true, note: '' },
      spa: { selected: false, name: 'Signature Spa Session (60m)', price: 2500, isPerNight: false, note: '' },
      dinner: { selected: false, name: 'Chef Special 4-Course Dinner', price: 1500, isPerNight: false, note: '' },
      celebration: { selected: false, name: 'Celebration Floral & Cake Setup', price: 2000, isPerNight: false, note: '' },
      late_checkout: { selected: false, name: 'Guaranteed Late Checkout (4 PM)', price: 1000, isPerNight: false, note: '' },
      early_checkin: { selected: false, name: 'Priority Early Check-in (11 AM)', price: 0, isPerNight: false, note: '' },
      dietary: { selected: false, name: 'Special Dietary Requirements', price: 0, isPerNight: false, note: '' },
    },
    totals: {
      roomTotal: 0,
      servicesTotal: 0,
      subtotal: 0,
      taxes: 0,
      grandTotal: 0,
    },
    bookingReference: '',
  };

  // DOM Elements Cache
  const DOM = {
    stepperWrap: document.getElementById('booking-stepper-wrap'),
    progressFill: document.getElementById('stepper-progress-fill'),
    counterText: document.getElementById('stepper-counter-text'),
    stepIndicatorItems: document.querySelectorAll('.stepper-step'),
    panels: document.querySelectorAll('.booking-panel'),

    // Step 1 Elements
    step1Form: document.getElementById('step1-form'),
    checkinInput: document.getElementById('step1-checkin'),
    checkoutInput: document.getElementById('step1-checkout'),
    adultsSelect: document.getElementById('step1-adults'),
    childrenSelect: document.getElementById('step1-children'),
    roomsSelect: document.getElementById('step1-rooms'),
    step1Alert: document.getElementById('step1-alert'),

    // Step 2 Elements
    roomsContainer: document.getElementById('selectable-rooms-container'),
    step2Alert: document.getElementById('step2-alert'),
    step2Back: document.getElementById('step2-back-btn'),
    step2Next: document.getElementById('step2-next-btn'),

    // Step 3 Elements
    step3Form: document.getElementById('step3-form'),
    guestNameInput: document.getElementById('guest-name'),
    guestEmailInput: document.getElementById('guest-email'),
    guestPhoneInput: document.getElementById('guest-phone'),
    guestCountryInput: document.getElementById('guest-country'),
    guestCountSelect: document.getElementById('guest-count-select'),
    step3Alert: document.getElementById('step3-alert'),
    step3Back: document.getElementById('step3-back-btn'),

    // Step 4 Elements
    servicesForm: document.getElementById('step4-form'),
    step4Back: document.getElementById('step4-back-btn'),
    step4Next: document.getElementById('step4-next-btn'),

    // Step 5 Elements
    reviewRoomCard: document.getElementById('review-room-content'),
    reviewDatesContent: document.getElementById('review-dates-content'),
    reviewGuestContent: document.getElementById('review-guest-content'),
    reviewServicesContent: document.getElementById('review-services-content'),
    costTableBody: document.getElementById('cost-table-body'),
    confirmBookingBtn: document.getElementById('confirm-booking-btn'),
    step5Back: document.getElementById('step5-back-btn'),

    // Step 6 Elements
    confirmRefText: document.getElementById('confirm-booking-reference'),
    confirmGuestName: document.getElementById('confirm-guest-name'),
    confirmRoomName: document.getElementById('confirm-room-name'),
    confirmCheckin: document.getElementById('confirm-checkin'),
    confirmCheckout: document.getElementById('confirm-checkout'),
    confirmNights: document.getElementById('confirm-nights'),
    confirmGuests: document.getElementById('confirm-guests'),
    confirmRoomSubtotal: document.getElementById('confirm-room-subtotal'),
    confirmServicesSubtotal: document.getElementById('confirm-services-subtotal'),
    confirmTaxes: document.getElementById('confirm-taxes'),
    confirmTotal: document.getElementById('confirm-total-amount'),
    confirmBookingStatus: document.getElementById('confirm-booking-status'),
    confirmStatusText: document.getElementById('confirm-status-text'),
    bookAnotherBtn: document.getElementById('book-another-btn'),
  };

  document.addEventListener('DOMContentLoaded', initBookingFlow);

  /**
   * Main Initialization
   */
  async function initBookingFlow() {
    // 1. Fetch room records
    try {
      const response = await fetch('backend/api/rooms.php');
      if (!response.ok) {
        console.error('Fetch error for backend/api/rooms.php, status:', response.status);
        showAlert(DOM.step1Alert, `Server error ${response.status}: Unable to load accommodations. Please try again later.`);
        return;
      }
      bookingState.roomsList = await response.json();
    } catch (err) {
      console.error('Fetch error for backend/api/rooms.php:', err);
      showAlert(DOM.step1Alert, 'Network error connecting to accommodations service. Please check your connection.');
      return;
    }

    // 2. Setup initial dates & constraints for Step 1
    initDateConstraints();

    // 3. Bind UI event listeners across all steps
    bindStepEvents();

    // 4. Check for URL hash (#slug) to pre-select a room and skip to Step 2
    checkHashDeepLink();
  }

  /**
   * Setup date input minimums and default selections
   */
  function initDateConstraints() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = formatDateToISO(today);
    const tomorrowStr = formatDateToISO(tomorrow);

    if (DOM.checkinInput) {
      DOM.checkinInput.min = todayStr;
      if (!DOM.checkinInput.value) DOM.checkinInput.value = todayStr;
    }

    if (DOM.checkoutInput) {
      DOM.checkoutInput.min = tomorrowStr;
      if (!DOM.checkoutInput.value) DOM.checkoutInput.value = tomorrowStr;
    }

    // Update checkout minimum dynamically when checkin changes
    if (DOM.checkinInput && DOM.checkoutInput) {
      DOM.checkinInput.addEventListener('change', () => {
        if (!DOM.checkinInput.value) return;

        const checkinDate = new Date(DOM.checkinInput.value);
        const minCheckout = new Date(checkinDate);
        minCheckout.setDate(minCheckout.getDate() + 1);
        const minCheckoutStr = formatDateToISO(minCheckout);

        DOM.checkoutInput.min = minCheckoutStr;

        if (DOM.checkoutInput.value && DOM.checkoutInput.value <= DOM.checkinInput.value) {
          DOM.checkoutInput.value = minCheckoutStr;
        }
        hideAlert(DOM.step1Alert);
      });

      DOM.checkoutInput.addEventListener('change', () => {
        hideAlert(DOM.step1Alert);
      });
    }

    syncDatesToState();
  }

  /**
   * Synchronize Step 1 form fields to bookingState
   */
  function syncDatesToState() {
    const cinVal = DOM.checkinInput ? DOM.checkinInput.value : '';
    const coutVal = DOM.checkoutInput ? DOM.checkoutInput.value : '';
    const adultsVal = DOM.adultsSelect ? parseInt(DOM.adultsSelect.value, 10) : 2;
    const childrenVal = DOM.childrenSelect ? parseInt(DOM.childrenSelect.value, 10) : 0;
    const roomsVal = DOM.roomsSelect ? parseInt(DOM.roomsSelect.value, 10) : 1;

    bookingState.dates.checkin = cinVal;
    bookingState.dates.checkout = coutVal;
    bookingState.dates.adults = adultsVal;
    bookingState.dates.children = childrenVal;
    bookingState.dates.roomsCount = roomsVal;

    if (cinVal && coutVal) {
      const d1 = new Date(cinVal);
      const d2 = new Date(coutVal);
      const diffTime = Math.abs(d2 - d1);
      bookingState.dates.nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else {
      bookingState.dates.nights = 1;
    }
  }

  /**
   * Detect booking.html#<slug> and auto-navigate
   */
  function checkHashDeepLink() {
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (!hash) return;

    const matchedRoom = bookingState.roomsList.find(
      (r) => r.slug.toLowerCase() === hash && r.availability_status !== 'sold_out'
    );

    if (matchedRoom) {
      syncDatesToState();
      bookingState.selectedRoom = matchedRoom;
      renderSelectableRooms();
      goToStep(2);
    }
  }

  /**
   * Bind event listeners for steps, navigation, and validation
   */
  function bindStepEvents() {
    // --- Step 1 Search Submit ---
    if (DOM.step1Form) {
      DOM.step1Form.addEventListener('submit', (e) => {
        e.preventDefault();
        syncDatesToState();

        const { checkin, checkout, adults } = bookingState.dates;
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (!checkin) {
          showAlert(DOM.step1Alert, 'Please select your check-in date.');
          DOM.checkinInput?.focus();
          return;
        }

        if (!checkout) {
          showAlert(DOM.step1Alert, 'Please select your check-out date.');
          DOM.checkoutInput?.focus();
          return;
        }

        const cinDate = new Date(checkin);
        const coutDate = new Date(checkout);

        if (cinDate < startOfToday) {
          showAlert(DOM.step1Alert, 'Check-in date cannot be in the past. Please select today or later.');
          DOM.checkinInput?.focus();
          return;
        }

        if (coutDate <= cinDate) {
          showAlert(DOM.step1Alert, 'Check-out date must be after check-in date (at least 1 night stay).');
          DOM.checkoutInput?.focus();
          return;
        }

        if (adults < 1) {
          showAlert(DOM.step1Alert, 'At least 1 adult guest is required for reservations.');
          DOM.adultsSelect?.focus();
          return;
        }

        hideAlert(DOM.step1Alert);
        renderSelectableRooms();
        goToStep(2);
      });
    }

    // --- Step 2 Select Room Handlers ---
    if (DOM.step2Back) {
      DOM.step2Back.addEventListener('click', () => goToStep(1));
    }

    if (DOM.step2Next) {
      DOM.step2Next.addEventListener('click', () => {
        if (!bookingState.selectedRoom) {
          showAlert(DOM.step2Alert, 'Please select an accommodation to continue.');
          return;
        }
        hideAlert(DOM.step2Alert);
        populateGuestDefaults();
        goToStep(3);
      });
    }

    // --- Step 3 Guest Info Handlers ---
    if (DOM.step3Back) {
      DOM.step3Back.addEventListener('click', () => goToStep(2));
    }

    if (DOM.step3Form) {
      DOM.step3Form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = DOM.guestNameInput ? DOM.guestNameInput.value.trim() : '';
        const emailVal = DOM.guestEmailInput ? DOM.guestEmailInput.value.trim() : '';
        const phoneVal = DOM.guestPhoneInput ? DOM.guestPhoneInput.value.trim() : '';
        const countryVal = DOM.guestCountryInput ? DOM.guestCountryInput.value.trim() : 'India';
        const countVal = DOM.guestCountSelect ? parseInt(DOM.guestCountSelect.value, 10) : 2;

        if (!nameVal) {
          showAlert(DOM.step3Alert, 'Please provide the primary guest full name.');
          DOM.guestNameInput?.focus();
          return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          showAlert(DOM.step3Alert, 'Please enter a valid email address (e.g. name@example.com).');
          DOM.guestEmailInput?.focus();
          return;
        }

        // Phone validation (digits only, 10-15 chars, allowing optional leading +)
        const cleanPhone = phoneVal.replace(/[\s\-()]/g, '');
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(cleanPhone)) {
          showAlert(DOM.step3Alert, 'Please enter a valid contact phone number (10 to 15 numeric digits).');
          DOM.guestPhoneInput?.focus();
          return;
        }

        // Save guest state
        bookingState.guest.fullName = nameVal;
        bookingState.guest.email = emailVal;
        bookingState.guest.phone = cleanPhone;
        bookingState.guest.country = countryVal;
        bookingState.guest.guestsCount = countVal;

        hideAlert(DOM.step3Alert);
        goToStep(4);
      });
    }

    // --- Step 4 Special Requests Handlers ---
    if (DOM.step4Back) {
      DOM.step4Back.addEventListener('click', () => goToStep(3));
    }

    if (DOM.step4Next) {
      DOM.step4Next.addEventListener('click', () => {
        saveServicesState();
        calculateTotals();
        renderReviewStep();
        goToStep(5);
      });
    }

    // --- Step 5 Review & Confirm Handlers ---
    if (DOM.step5Back) {
      DOM.step5Back.addEventListener('click', () => goToStep(4));
    }

    if (DOM.confirmBookingBtn) {
      DOM.confirmBookingBtn.addEventListener('click', async () => {
        const selectedServices = Object.keys(bookingState.services)
          .filter((k) => bookingState.services[k].selected)
          .map((k) => ({
            name: bookingState.services[k].name,
            price: bookingState.services[k].price
          }));

        const payload = {
          room_id: bookingState.selectedRoom ? bookingState.selectedRoom.id : 1,
          room_slug: bookingState.selectedRoom ? bookingState.selectedRoom.slug : '',
          guest_name: bookingState.guest.fullName,
          email: bookingState.guest.email,
          phone: bookingState.guest.phone,
          country: bookingState.guest.country || 'India',
          check_in: bookingState.dates.checkin,
          check_out: bookingState.dates.checkout,
          adults: bookingState.dates.adults,
          children: bookingState.dates.children,
          rooms_count: bookingState.dates.roomsCount,
          nights: bookingState.dates.nights,
          room_subtotal: bookingState.totals.roomTotal,
          services_subtotal: bookingState.totals.servicesTotal,
          taxes: bookingState.totals.taxes,
          total_amount: bookingState.totals.grandTotal,
          services: selectedServices
        };

        try {
          const resp = await fetch('backend/api/booking.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!resp.ok) {
            console.error('Fetch error for backend/api/booking.php, status:', resp.status);
            showStep5Error(`Server error ${resp.status}: Unable to process reservation. Please verify your details and try again.`);
            return;
          }
          const data = await resp.json();
          if (data && data.success && (data.booking_reference || data.data?.booking_reference)) {
            bookingState.bookingReference = data.booking_reference || data.data?.booking_reference;
            if (data.data) {
              if (data.data.room_subtotal !== undefined) bookingState.totals.roomTotal = data.data.room_subtotal;
              if (data.data.services_subtotal !== undefined) bookingState.totals.servicesTotal = data.data.services_subtotal;
              if (data.data.taxes !== undefined) bookingState.totals.taxes = data.data.taxes;
              if (data.data.total_amount !== undefined) bookingState.totals.grandTotal = data.data.total_amount;
              if (data.data.nights !== undefined) bookingState.dates.nights = data.data.nights;
            }
          } else {
            console.error('Fetch error for backend/api/booking.php, unexpected response:', data);
            showStep5Error(data?.message || 'Unable to confirm reservation details from server response.');
            return;
          }
        } catch (err) {
          console.error('Fetch error for backend/api/booking.php:', err);
          showStep5Error('Network error connecting to booking service. Please check your connection.');
          return;
        }

        renderConfirmationStep();
        goToStep(6);
      });
    }

    // --- Step 6 Reset Handler ---
    if (DOM.bookAnotherBtn) {
      DOM.bookAnotherBtn.addEventListener('click', resetBookingFlow);
    }
  }

  /**
   * Render Step 2 Selectable Rooms
   */
  function renderSelectableRooms() {
    if (!DOM.roomsContainer) return;

    // Filter out sold_out rooms
    const availableRooms = bookingState.roomsList.filter(
      (r) => r.availability_status !== 'sold_out'
    );

    if (availableRooms.length === 0) {
      DOM.roomsContainer.innerHTML = `
        <div class="rooms-empty-state">
          <p class="empty-state-title">No Accommodations Currently Available</p>
          <p class="empty-state-desc">All rooms are booked for your selected dates. Please adjust your travel dates.</p>
        </div>
      `;
      return;
    }

    const cardsHtml = availableRooms
      .map((room) => {
        const isSelected =
          bookingState.selectedRoom && bookingState.selectedRoom.id === room.id;
        const formattedPrice = room.price_per_night.toLocaleString('en-IN');
        const statusLabel = room.availability_status === 'limited' ? 'Limited Availability' : 'Available';
        const statusClass = `room-card__status-badge--${room.availability_status}`;

        return `
          <label class="selectable-room-card ${isSelected ? 'is-selected' : ''}" data-room-id="${room.id}" tabindex="0" role="button" aria-pressed="${isSelected}">
            <input 
              type="radio" 
              name="selected_room_radio" 
              value="${room.id}" 
              ${isSelected ? 'checked' : ''} 
              aria-label="Select ${escapeHTML(room.name)}"
            />
            <span class="selectable-room-card__selected-badge">✓ Selected</span>
            
            <div class="selectable-room-card__img-wrap">
              <img src="${escapeHTML(room.image || 'images/rooms/deluxe-room.svg')}" alt="${escapeHTML(room.name)}" loading="lazy" />
              <span class="room-card__status-badge ${statusClass}" style="position: absolute; bottom: 8px; right: 8px;">
                ${statusLabel}
              </span>
            </div>

            <div class="selectable-room-card__body">
              <span class="room-card__view-tag">${escapeHTML(room.view)}</span>
              <h3 class="selectable-room-card__title">${escapeHTML(room.name)}</h3>
              
              <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: var(--space-xs); display: flex; gap: var(--space-sm);">
                <span>📐 ${room.size_sqft} sq ft</span>
                <span>👥 Max ${room.max_guests} Guests</span>
                <span>🛏️ ${escapeHTML(room.bed_type)}</span>
              </div>

              <div class="selectable-room-card__price">
                ₹${formattedPrice} <span style="font-size: 0.75rem; font-weight: normal; color: var(--color-text-muted);">/ night</span>
              </div>
            </div>
          </label>
        `;
      })
      .join('');

    DOM.roomsContainer.innerHTML = cardsHtml;

    // Attach card click handlers
    const cardElements = DOM.roomsContainer.querySelectorAll('.selectable-room-card');
    cardElements.forEach((card) => {
      const selectCard = () => {
        const roomId = parseInt(card.dataset.roomId, 10);
        const roomObj = availableRooms.find((r) => r.id === roomId);
        if (roomObj) {
          bookingState.selectedRoom = roomObj;
          cardElements.forEach((c) => {
            c.classList.remove('is-selected');
            c.setAttribute('aria-pressed', 'false');
            const radio = c.querySelector('input[type="radio"]');
            if (radio) radio.checked = false;
          });

          card.classList.add('is-selected');
          card.setAttribute('aria-pressed', 'true');
          const radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;

          hideAlert(DOM.step2Alert);
        }
      };

      card.addEventListener('click', selectCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          selectCard();
        }
      });
    });
  }

  /**
   * Prepopulate Step 3 Guest Count dropdown with sensible default based on room capacity
   */
  function populateGuestDefaults() {
    if (!DOM.guestCountSelect || !bookingState.selectedRoom) return;

    const maxOccupancy = Math.max(bookingState.selectedRoom.max_guests, 4);
    let optionsHtml = '';
    for (let i = 1; i <= maxOccupancy; i++) {
      const isSelected = i === (bookingState.dates.adults || 2);
      optionsHtml += `<option value="${i}" ${isSelected ? 'selected' : ''}>${i} Guest${i > 1 ? 's' : ''}</option>`;
    }
    DOM.guestCountSelect.innerHTML = optionsHtml;
  }

  /**
   * Save Step 4 services checkboxes & optional notes into state
   */
  function saveServicesState() {
    const serviceItems = document.querySelectorAll('.service-item-card');
    serviceItems.forEach((card) => {
      const key = card.dataset.serviceKey;
      if (!key || !bookingState.services[key]) return;

      const checkbox = card.querySelector('input[type="checkbox"]');
      const noteInput = card.querySelector('.service-item-note-input');

      bookingState.services[key].selected = checkbox ? checkbox.checked : false;
      bookingState.services[key].note = noteInput ? noteInput.value.trim() : '';

      card.classList.toggle('is-checked', bookingState.services[key].selected);
    });
  }

  /**
   * Live Financial Math Calculations
   */
  function calculateTotals() {
    const nights = bookingState.dates.nights || 1;
    const roomsCount = bookingState.dates.roomsCount || 1;
    const roomRate = bookingState.selectedRoom ? bookingState.selectedRoom.price_per_night : 0;

    // Room total
    const roomTotal = roomRate * nights * roomsCount;

    // Services total
    let servicesTotal = 0;
    Object.keys(bookingState.services).forEach((k) => {
      const svc = bookingState.services[k];
      if (svc.selected && svc.price > 0) {
        if (svc.isPerNight) {
          servicesTotal += svc.price * nights;
        } else {
          servicesTotal += svc.price;
        }
      }
    });

    const subtotal = roomTotal + servicesTotal;
    const taxes = Math.round(subtotal * 0.18); // 18% GST (PDR benchmark: 15,000 -> 2,700)
    const grandTotal = subtotal + taxes;

    bookingState.totals = {
      roomTotal,
      servicesTotal,
      subtotal,
      taxes,
      grandTotal,
    };
  }

  /**
   * Render Step 5 Review & Summary Tables
   */
  function renderReviewStep() {
    const room = bookingState.selectedRoom;
    const { checkin, checkout, nights, adults, children, roomsCount } = bookingState.dates;
    const guest = bookingState.guest;
    const totals = bookingState.totals;

    // 1. Room Card
    if (DOM.reviewRoomCard && room) {
      DOM.reviewRoomCard.innerHTML = `
        <div style="display: flex; gap: var(--space-md); align-items: center;">
          <img 
            src="${escapeHTML(room.image || 'images/rooms/deluxe-room.svg')}" 
            alt="${escapeHTML(room.name)}" 
            style="width: 110px; height: 75px; object-fit: cover; border-radius: var(--radius-sm);"
          />
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin-bottom: 2px;">
              ${escapeHTML(room.name)}
            </h4>
            <div style="font-size: 0.8rem; color: var(--color-text-muted);">
              ${escapeHTML(room.bed_type)} • ${room.size_sqft} sq ft • ${escapeHTML(room.view)}
            </div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-dark); margin-top: 4px;">
              ₹${room.price_per_night.toLocaleString('en-IN')} / night
            </div>
          </div>
        </div>
      `;
    }

    // 2. Dates Summary
    if (DOM.reviewDatesContent) {
      DOM.reviewDatesContent.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-sm); font-size: 0.875rem;">
          <div>
            <span style="color: var(--color-text-muted); font-size: 0.75rem; text-transform: uppercase;">Check-In</span>
            <div style="font-weight: 600; color: var(--color-primary);">${formatDisplayDate(checkin)}</div>
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">From 2:00 PM</span>
          </div>
          <div>
            <span style="color: var(--color-text-muted); font-size: 0.75rem; text-transform: uppercase;">Check-Out</span>
            <div style="font-weight: 600; color: var(--color-primary);">${formatDisplayDate(checkout)}</div>
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">Until 12:00 PM</span>
          </div>
          <div style="grid-column: 1 / -1; padding-top: var(--space-2xs); border-top: 1px dashed var(--color-border-light);">
            <strong>${nights} Night(s)</strong> • ${adults} Adult(s)${children > 0 ? `, ${children} Child(ren)` : ''} • ${roomsCount} Room(s)
          </div>
        </div>
      `;
    }

    // 3. Guest Info Summary
    if (DOM.reviewGuestContent) {
      DOM.reviewGuestContent.innerHTML = `
        <div style="font-size: 0.875rem; line-height: 1.6;">
          <div style="font-weight: 600; color: var(--color-primary);">${escapeHTML(guest.fullName)}</div>
          <div style="color: var(--color-text-muted);">${escapeHTML(guest.email)} • ${escapeHTML(guest.phone)}</div>
          <div style="color: var(--color-text-muted); font-size: 0.8rem;">Nationality: ${escapeHTML(guest.country)} • Reserved for ${guest.guestsCount} Guests</div>
        </div>
      `;
    }

    // 4. Special Requests Summary
    if (DOM.reviewServicesContent) {
      const selectedServicesList = Object.keys(bookingState.services)
        .filter((k) => bookingState.services[k].selected)
        .map((k) => {
          const s = bookingState.services[k];
          const noteText = s.note ? ` <em style="color: var(--color-text-muted);">("${escapeHTML(s.note)}")</em>` : '';
          const priceText = s.price > 0
            ? (s.isPerNight ? `₹${(s.price * nights).toLocaleString('en-IN')} (₹${s.price}/night)` : `₹${s.price.toLocaleString('en-IN')}`)
            : 'Included / Special Request';
          return `
            <li style="display: flex; justify-content: space-between; gap: var(--space-sm); margin-bottom: 6px; font-size: 0.85rem;">
              <span>• ${escapeHTML(s.name)}${noteText}</span>
              <strong style="color: var(--color-primary); white-space: nowrap;">${priceText}</strong>
            </li>
          `;
        });

      if (selectedServicesList.length > 0) {
        DOM.reviewServicesContent.innerHTML = `<ul style="list-style: none; padding: 0;">${selectedServicesList.join('')}</ul>`;
      } else {
        DOM.reviewServicesContent.innerHTML = `<p style="font-size: 0.85rem; color: var(--color-text-muted); font-style: italic;">No additional services or special requests selected.</p>`;
      }
    }

    // 5. Cost Breakdown Table
    if (DOM.costTableBody) {
      let rowsHtml = `
        <tr>
          <td>Accommodation (${nights} night${nights > 1 ? 's' : ''} × ${roomsCount} room)</td>
          <td>₹${totals.roomTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;

      // Itemize services
      Object.keys(bookingState.services).forEach((k) => {
        const s = bookingState.services[k];
        if (s.selected && s.price > 0) {
          const cost = s.isPerNight ? s.price * nights : s.price;
          const label = s.isPerNight ? `${s.name} (${nights} nights)` : s.name;
          rowsHtml += `
            <tr>
              <td>${escapeHTML(label)}</td>
              <td>₹${cost.toLocaleString('en-IN')}</td>
            </tr>
          `;
        }
      });

      rowsHtml += `
        <tr class="cost-table-divider">
          <td>Net Subtotal</td>
          <td>₹${totals.subtotal.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td>Taxes &amp; Luxury Hospitality Cess (18% GST)</td>
          <td>₹${totals.taxes.toLocaleString('en-IN')}</td>
        </tr>
        <tr class="cost-total-row">
          <td>Grand Total Due</td>
          <td><span class="cost-total-amount">₹${totals.grandTotal.toLocaleString('en-IN')}</span></td>
        </tr>
      `;

      DOM.costTableBody.innerHTML = rowsHtml;
    }

    // Attach step jump-back links
    document.querySelectorAll('[data-jump-step]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetStep = parseInt(link.dataset.jumpStep, 10);
        if (!isNaN(targetStep) && targetStep >= 1 && targetStep <= 4) {
          goToStep(targetStep);
        }
      });
    });
  }

  /**
   * Render Step 6 Final Confirmation Screen
   */
  function renderConfirmationStep() {
    const room = bookingState.selectedRoom;
    const { checkin, checkout, nights, adults, children } = bookingState.dates;
    const guest = bookingState.guest;
    const totals = bookingState.totals;

    if (DOM.confirmRefText) DOM.confirmRefText.textContent = bookingState.bookingReference;
    if (DOM.confirmGuestName) DOM.confirmGuestName.textContent = guest.fullName;
    if (DOM.confirmRoomName) DOM.confirmRoomName.textContent = room ? room.name : 'GrandVista Suite';
    if (DOM.confirmCheckin) DOM.confirmCheckin.textContent = `${formatDisplayDate(checkin)} (from 2:00 PM)`;
    if (DOM.confirmCheckout) DOM.confirmCheckout.textContent = `${formatDisplayDate(checkout)} (by 12:00 PM)`;
    if (DOM.confirmNights) DOM.confirmNights.textContent = `${nights} Night(s)`;
    if (DOM.confirmGuests) DOM.confirmGuests.textContent = `${adults} Adult(s)${children > 0 ? `, ${children} Child(ren)` : ''}`;
    if (DOM.confirmRoomSubtotal) DOM.confirmRoomSubtotal.textContent = `₹${totals.roomTotal.toLocaleString('en-IN')}`;
    if (DOM.confirmServicesSubtotal) DOM.confirmServicesSubtotal.textContent = `₹${totals.servicesTotal.toLocaleString('en-IN')}`;
    if (DOM.confirmTaxes) DOM.confirmTaxes.textContent = `₹${totals.taxes.toLocaleString('en-IN')}`;
    if (DOM.confirmTotal) DOM.confirmTotal.textContent = `₹${totals.grandTotal.toLocaleString('en-IN')} (incl. 18% GST)`;
    if (DOM.confirmBookingStatus) DOM.confirmBookingStatus.textContent = 'Pending Confirmation';
    if (DOM.confirmStatusText) DOM.confirmStatusText.textContent = 'Pending Confirmation';
  }

  /**
   * Reset Entire Booking Flow to Step 1
   */
  function resetBookingFlow() {
    bookingState.currentStep = 1;
    bookingState.selectedRoom = null;
    bookingState.bookingReference = '';

    // Clear guest info
    if (DOM.guestNameInput) DOM.guestNameInput.value = '';
    if (DOM.guestEmailInput) DOM.guestEmailInput.value = '';
    if (DOM.guestPhoneInput) DOM.guestPhoneInput.value = '';

    // Clear services
    Object.keys(bookingState.services).forEach((k) => {
      bookingState.services[k].selected = false;
      bookingState.services[k].note = '';
    });
    document.querySelectorAll('.service-item-card').forEach((card) => {
      card.classList.remove('is-checked');
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = false;
      const noteInput = card.querySelector('.service-item-note-input');
      if (noteInput) noteInput.value = '';
    });

    initDateConstraints();
    goToStep(1);
    window.location.hash = '';
  }

  /**
   * Navigation Controller between Steps (1 to 6)
   */
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 6) return;

    bookingState.currentStep = stepNumber;

    // 1. Toggle panels visibility
    DOM.panels.forEach((panel) => {
      const panelStep = parseInt(panel.dataset.step, 10);
      panel.classList.toggle('is-active', panelStep === stepNumber);
    });

    // 2. Update Progress Stepper Indicator
    const progressPercent = ((stepNumber - 1) / 5) * 100;
    if (DOM.progressFill) {
      DOM.progressFill.style.width = `${Math.max(16.66, progressPercent)}%`;
    }

    if (DOM.counterText) {
      const stepNames = [
        'Stay Dates & Guests',
        'Select Room',
        'Guest Information',
        'Special Requests',
        'Review Reservation',
        'Booking Confirmation',
      ];
      DOM.counterText.textContent = `Step ${stepNumber} of 6: ${stepNames[stepNumber - 1]}`;
    }

    DOM.stepIndicatorItems.forEach((item) => {
      const itemStep = parseInt(item.dataset.step, 10);
      item.classList.toggle('is-active', itemStep === stepNumber);
      item.classList.toggle('is-completed', itemStep < stepNumber);
    });

    // 3. Scroll to top of booking widget for smooth navigation
    const widgetAnchor = document.getElementById('booking-flow-container');
    if (widgetAnchor) {
      widgetAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ==========================================================================
     Helper Utilities
     ========================================================================== */
  function showAlert(alertEl, message) {
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.className = 'booking-alert is-error';
    alertEl.style.display = 'flex';
  }

  function hideAlert(alertEl) {
    if (!alertEl) return;
    alertEl.textContent = '';
    alertEl.className = 'booking-alert';
    alertEl.style.display = 'none';
  }

  function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
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
   * Render visible error alert in Step 5 review container
   */
  function showStep5Error(message) {
    let errorAlert = document.getElementById('step5-error-alert');
    if (!errorAlert && DOM.confirmBookingBtn) {
      errorAlert = document.createElement('div');
      errorAlert.id = 'step5-error-alert';
      errorAlert.className = 'booking-alert is-error';
      errorAlert.setAttribute('role', 'alert');
      errorAlert.style.marginBottom = 'var(--space-md)';
      DOM.confirmBookingBtn.parentNode.insertBefore(errorAlert, DOM.confirmBookingBtn);
    }
    if (errorAlert) {
      errorAlert.textContent = message;
      errorAlert.style.display = 'flex';
      errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
})();
