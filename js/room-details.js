/**
 * GrandVista Hotel — Room Details Page Logic
 * File: js/room-details.js
 * 
 * Features:
 * 1. Reads ?room=<slug> from URL query parameters
 * 2. Fetches backend/api/rooms.php and finds matching room
 * 3. Dynamic <title> and meta description updates for SEO
 * 4. Image Gallery:
 *    - Main image display with captions and counter badge
 *    - Thumbnail navigation strip
 *    - Click-to-enlarge Lightbox modal
 *    - Keyboard controls (Escape, ArrowLeft, ArrowRight)
 *    - Mobile touch swipe support
 * 5. Full specifications, amenities list, hotel policies block, and sticky booking card
 * 6. Friendly "Room Not Found" error state if slug is invalid or missing
 */

(function () {
  'use strict';

  // Gallery state
  let galleryImages = [];
  let currentImageIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  // DOM Elements Cache
  const DOM = {
    contentWrapper: document.getElementById('room-details-content'),
    notFoundWrapper: document.getElementById('room-not-found-state'),
    breadcrumbCurrent: document.getElementById('breadcrumb-room-name'),
    lightboxModal: document.getElementById('lightbox-modal'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxCaption: document.getElementById('lightbox-caption'),
    lightboxCounter: document.getElementById('lightbox-counter'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxPrev: document.getElementById('lightbox-prev'),
    lightboxNext: document.getElementById('lightbox-next'),
  };

  document.addEventListener('DOMContentLoaded', initRoomDetailsPage);

  /**
   * Main entry point
   */
  async function initRoomDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomSlug = urlParams.get('room');

    if (!roomSlug) {
      showNotFoundState('No accommodation was specified in the request.');
      return;
    }

    let rooms = [];
    try {
      const response = await fetch('backend/api/rooms.php');
      if (!response.ok) {
        console.error('Fetch error for backend/api/rooms.php, status:', response.status);
        showNotFoundState(`Server error ${response.status}: Unable to load accommodation details. Please try again later.`);
        return;
      }
      rooms = await response.json();
    } catch (err) {
      console.error('Fetch error for backend/api/rooms.php:', err);
      showNotFoundState('Network error connecting to accommodation service. Please check your connection.');
      return;
    }

    const room = rooms.find((r) => r.slug.toLowerCase() === roomSlug.toLowerCase());

    if (!room) {
      showNotFoundState(`We could not find an accommodation matching "${escapeHTML(roomSlug)}".`);
      return;
    }

    // Populate SEO & Document Title
    updateMetadata(room);

    // Populate Gallery Images Array
    prepareGallery(room);

    // Render Full Page Content
    renderRoomDetails(room);

    // Setup Gallery & Lightbox Event Listeners
    initGalleryEvents();

    // Track in Recently Viewed
    if (window.RecentlyViewed) {
      window.RecentlyViewed.track(room.slug);
    }
  }

  /**
   * Update page <title> and meta description dynamically
   */
  function updateMetadata(room) {
    document.title = `${room.name} — GrandVista Hotel`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `${room.name} at GrandVista Hotel. ${room.description} Features ${room.bed_type}, ${room.size_sqft} sq ft, starting at ₹${room.price_per_night.toLocaleString('en-IN')}/night.`;

    if (DOM.breadcrumbCurrent) {
      DOM.breadcrumbCurrent.textContent = room.name;
    }
  }

  /**
   * Extract or assemble 4 gallery slides with captions
   */
  function prepareGallery(room) {
    if (room.gallery && Array.isArray(room.gallery) && room.gallery.length > 0) {
      galleryImages = room.gallery;
    } else {
      // Default 4-image slide fallback
      galleryImages = [
        { src: room.image || 'images/rooms/deluxe-room.svg', caption: `${room.name} — Master Bedroom` },
        { src: 'images/rooms/gallery/bathroom.svg', caption: 'Ensuite Italian Marble Bathroom & Deep Tub' },
        { src: 'images/rooms/gallery/living.svg', caption: 'Executive Living Salon & Workstation' },
        { src: 'images/rooms/gallery/view.svg', caption: `${room.view} — Floor-to-Ceiling Windows` },
      ];
    }
    currentImageIndex = 0;
  }

  /**
   * Render the complete Room Details HTML structure
   */
  function renderRoomDetails(room) {
    if (!DOM.contentWrapper) return;

    if (DOM.notFoundWrapper) DOM.notFoundWrapper.style.display = 'none';
    DOM.contentWrapper.style.display = 'block';

    const isSoldOut = room.availability_status === 'sold_out';
    const formattedPrice = room.price_per_night.toLocaleString('en-IN');
    const statusLabel = getStatusLabel(room.availability_status);
    const statusClass = `room-card__status-badge--${room.availability_status || 'available'}`;

    // Thumbnail strip HTML
    const thumbsHtml = galleryImages
      .map(
        (img, idx) => `
        <button type="button" class="thumb-btn ${idx === 0 ? 'is-active' : ''}" data-index="${idx}" aria-label="View photo ${idx + 1}: ${escapeHTML(img.caption)}">
          <img src="${escapeHTML(img.src)}" alt="${escapeHTML(img.caption)}" loading="lazy" />
        </button>
      `
      )
      .join('');

    // Detailed Amenities HTML with checkmarks
    const amenitiesHtml = (room.amenities || [])
      .map(
        (amenity) => `
        <div class="amenity-detailed-item">
          <svg class="amenity-check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${escapeHTML(amenity)}</span>
        </div>
      `
      )
      .join('');

    // Booking CTA button
    const bookCtaHtml = isSoldOut
      ? `<button class="btn btn--primary btn--block btn--disabled" disabled aria-disabled="true">Currently Sold Out</button>`
      : `<a href="booking.html#${escapeHTML(room.slug)}" class="btn btn--primary btn--block" data-slug="${escapeHTML(room.slug)}">
           Book This Room
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M5 12h14M12 5l7 7-7 7"/>
           </svg>
         </a>`;

    const wishlistBtnHtml = window.GrandVistaWishlist
      ? window.GrandVistaWishlist.renderHeartButton(room.slug)
      : `<button type="button" class="wishlist-toggle-btn" data-wishlist-slug="${escapeHTML(room.slug)}" aria-label="Save to wishlist"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>`;

    // 1. Update existing static <h1> element by ID rather than creating a new one
    const staticTitleEl = document.getElementById('room-title-static');
    if (staticTitleEl) {
      staticTitleEl.textContent = room.name;
    }

    const badgesContainer = document.getElementById('room-meta-badges');
    if (badgesContainer) {
      badgesContainer.innerHTML = `
        <span class="room-card__status-badge ${statusClass}">
          ${statusLabel}
        </span>
        <span class="room-amenity-pill" style="font-weight: 600;">${escapeHTML(room.type)} Category</span>
        <span class="room-amenity-pill">${escapeHTML(room.view)}</span>
      `;
    }

    const wishlistContainer = document.getElementById('room-wishlist-btn-container');
    if (wishlistContainer) {
      wishlistContainer.innerHTML = wishlistBtnHtml;
    }

    const detailsGridHtml = `
        <div class="details-grid">
          <!-- Left Column: Gallery & In-Depth Details -->
          <div class="details-main-col">
            
            <!-- Gallery Component -->
            <div class="gallery-container">
              <!-- Main Click-to-Enlarge Display -->
              <div class="gallery-main" id="gallery-main-view" role="button" tabindex="0" aria-label="Click to enlarge image in fullscreen lightbox">
                <img 
                  id="gallery-main-img" 
                  src="${escapeHTML(galleryImages[0].src)}" 
                  alt="${escapeHTML(galleryImages[0].caption)}" 
                />
                <span class="gallery-zoom-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  Click to Expand
                </span>
                <div class="gallery-caption-overlay">
                  <span class="gallery-caption-text" id="gallery-caption-text">
                    ${escapeHTML(galleryImages[0].caption)}
                  </span>
                  <span class="gallery-counter-badge" id="gallery-counter-text">
                    1 / ${galleryImages.length}
                  </span>
                </div>
              </div>

              <!-- Thumbnails Strip -->
              <div class="gallery-thumbs" id="gallery-thumbs-strip">
                ${thumbsHtml}
              </div>
            </div>

            <!-- Key Specifications Banner -->
            <div class="specs-overview-card">
              <div class="specs-overview-grid">
                <div class="specs-overview-item">
                  <span class="specs-overview-label">Room Area</span>
                  <span class="specs-overview-value">${room.size_sqft} sq ft</span>
                </div>
                <div class="specs-overview-item">
                  <span class="specs-overview-label">Max Occupancy</span>
                  <span class="specs-overview-value">Up to ${room.max_guests} Guests</span>
                </div>
                <div class="specs-overview-item">
                  <span class="specs-overview-label">Bedding</span>
                  <span class="specs-overview-value">${escapeHTML(room.bed_type)}</span>
                </div>
                <div class="specs-overview-item">
                  <span class="specs-overview-label">Window Outlook</span>
                  <span class="specs-overview-value">${escapeHTML(room.view)}</span>
                </div>
              </div>
            </div>

            <!-- Room Description -->
            <div class="details-content-card">
              <h2 class="details-card-title">Accommodation Overview</h2>
              <p class="details-paragraph">
                ${escapeHTML(room.description)}
              </p>
              <p class="details-paragraph">
                Every detail in the ${escapeHTML(room.name)} is tailored to deliver peace of mind and supreme indulgence. Featuring high-thread-count Egyptian cotton linens, bespoke acoustic soundproofing, automated mood illumination, and a dedicated workspace crafted for discerning professionals.
              </p>
            </div>

            <!-- Included Amenities List -->
            <div class="details-content-card">
              <h2 class="details-card-title">Room Amenities &amp; Features</h2>
              <div class="amenities-detailed-list">
                ${amenitiesHtml}
              </div>
            </div>

            <!-- Hotel Policies Block -->
            <div class="policies-card">
              <h2 class="details-card-title" style="margin-bottom: var(--space-sm);">Stay Policies &amp; Terms</h2>
              <div class="policies-list">
                <div class="policy-item">
                  <span class="policy-item__title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Check-In &amp; Check-Out Schedule
                  </span>
                  <p class="policy-item__desc">
                    Check-in commences from <strong>2:00 PM</strong> onwards. Check-out is scheduled by <strong>12:00 PM (Noon)</strong>. Early arrivals and late departures are accommodated upon prior arrangement and subject to availability.
                  </p>
                </div>

                <div class="policy-item">
                  <span class="policy-item__title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Cancellation Policy (Flexible Demo Guarantee)
                  </span>
                  <p class="policy-item__desc">
                    Complimentary cancellation is offered up to <strong>48 hours</strong> prior to your arrival date. Cancellations received within 48 hours or non-arrivals are subject to a fee equal to one night's room charge plus applicable taxes.
                  </p>
                </div>

                <div class="policy-item">
                  <span class="policy-item__title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Guest Identification &amp; Deposit
                  </span>
                  <p class="policy-item__desc">
                    All adult guests must present valid government-issued photographic identification upon check-in. A refundable security hold or credit card pre-authorization is collected upon arrival.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Column: Sticky Booking Card -->
          <aside class="details-sidebar-col">
            <div class="booking-sidebar-card">
              <div class="sidebar-price-block">
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.05em;">
                  Direct Booking Rate
                </span>
                <span class="sidebar-price-amount">₹${formattedPrice}</span>
                <span class="sidebar-per-night">per room / per night + taxes</span>
              </div>

              <!-- Quick Reservation Details -->
              <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-lg);">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px dashed var(--color-border-light); padding-bottom: 0.5rem;">
                  <span style="color: var(--color-text-muted);">Occupancy</span>
                  <span style="font-weight: 600;">Max ${room.max_guests} Guests</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px dashed var(--color-border-light); padding-bottom: 0.5rem;">
                  <span style="color: var(--color-text-muted);">Bedding</span>
                  <span style="font-weight: 600;">${escapeHTML(room.bed_type)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px dashed var(--color-border-light); padding-bottom: 0.5rem;">
                  <span style="color: var(--color-text-muted);">Status</span>
                  <span style="font-weight: 600; color: ${isSoldOut ? 'var(--color-status-soldout)' : 'var(--color-status-available)'};">
                    ${statusLabel}
                  </span>
                </div>
              </div>

              <!-- Primary Action CTA -->
              ${bookCtaHtml}

              <div class="sidebar-guarantee-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Best Rate Guaranteed • No Hidden Fees</span>
              </div>

              <div style="margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px solid var(--color-border-light); font-size: 0.8rem; color: var(--color-text-muted); text-align: center;">
                Need assistance? Call Concierge: <br>
                <strong style="color: var(--color-primary);">+91 11 4820 9000</strong>
              </div>
            </div>
          </aside>
        </div>
    `;

    const detailsBody = document.getElementById('room-details-body');
    if (detailsBody) {
      detailsBody.innerHTML = detailsGridHtml;
    } else {
      // Fallback in case container structure lacks #room-details-body
      DOM.contentWrapper.innerHTML = `
        <div class="container">
          <div class="room-header-block" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-sm);">
            <div>
              <div class="room-meta-badges">
                <span class="room-card__status-badge ${statusClass}">
                  ${statusLabel}
                </span>
                <span class="room-amenity-pill" style="font-weight: 600;">${escapeHTML(room.type)} Category</span>
                <span class="room-amenity-pill">${escapeHTML(room.view)}</span>
              </div>
              <h1 class="room-title-lg" id="room-title-static">${escapeHTML(room.name)}</h1>
            </div>
            <div style="position: relative; width: 44px; height: 44px;">
              ${wishlistBtnHtml}
            </div>
          </div>
          ${detailsGridHtml}
        </div>
      `;
    }
  }

  /**
   * Set up thumbnail clicks, lightbox modal navigation, keyboard keys, and touch swipe
   */
  function initGalleryEvents() {
    const mainView = document.getElementById('gallery-main-view');
    const thumbsStrip = document.getElementById('gallery-thumbs-strip');

    // Thumbnail Clicks
    if (thumbsStrip) {
      thumbsStrip.addEventListener('click', (e) => {
        const thumbBtn = e.target.closest('.thumb-btn');
        if (!thumbBtn) return;

        const index = parseInt(thumbBtn.dataset.index, 10);
        if (!isNaN(index)) {
          setActiveImage(index);
        }
      });
    }

    // Main Image Click -> Open Lightbox
    if (mainView) {
      mainView.addEventListener('click', openLightbox);
      mainView.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox();
        }
      });
    }

    // Lightbox Controls
    if (DOM.lightboxClose) DOM.lightboxClose.addEventListener('click', closeLightbox);
    if (DOM.lightboxPrev) DOM.lightboxPrev.addEventListener('click', prevLightboxImage);
    if (DOM.lightboxNext) DOM.lightboxNext.addEventListener('click', nextLightboxImage);

    // Click outside lightbox content to close
    if (DOM.lightboxModal) {
      DOM.lightboxModal.addEventListener('click', (e) => {
        if (e.target === DOM.lightboxModal) {
          closeLightbox();
        }
      });
    }

    // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
    window.addEventListener('keydown', (e) => {
      if (!DOM.lightboxModal || !DOM.lightboxModal.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      }
    });

    // Touch swipe support for mobile lightbox
    if (DOM.lightboxModal) {
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
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;

          const diffX = touchEndX - touchStartX;
          const diffY = touchEndY - touchStartY;

          // Detect horizontal swipe if deltaX is significant and larger than deltaY
          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX < 0) {
              // Swiped left -> next
              nextLightboxImage();
            } else {
              // Swiped right -> prev
              prevLightboxImage();
            }
          }
        },
        { passive: true }
      );
    }
  }

  /**
   * Switch the active previewed gallery image
   */
  function setActiveImage(index) {
    if (index < 0 || index >= galleryImages.length) return;
    currentImageIndex = index;

    const mainImg = document.getElementById('gallery-main-img');
    const captionText = document.getElementById('gallery-caption-text');
    const counterText = document.getElementById('gallery-counter-text');
    const thumbButtons = document.querySelectorAll('.thumb-btn');

    const item = galleryImages[index];

    if (mainImg) {
      mainImg.src = item.src;
      mainImg.alt = item.caption;
    }
    if (captionText) captionText.textContent = item.caption;
    if (counterText) counterText.textContent = `${index + 1} / ${galleryImages.length}`;

    thumbButtons.forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === index);
    });

    // If lightbox is open, keep it in sync
    if (DOM.lightboxModal && DOM.lightboxModal.classList.contains('is-open')) {
      updateLightboxContent();
    }
  }

  /**
   * Open fullscreen Lightbox modal
   */
  function openLightbox() {
    if (!DOM.lightboxModal) return;
    updateLightboxContent();
    DOM.lightboxModal.classList.add('is-open');
    DOM.lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close fullscreen Lightbox modal
   */
  function closeLightbox() {
    if (!DOM.lightboxModal) return;
    DOM.lightboxModal.classList.remove('is-open');
    DOM.lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function prevLightboxImage() {
    const prevIdx = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setActiveImage(prevIdx);
  }

  function nextLightboxImage() {
    const nextIdx = (currentImageIndex + 1) % galleryImages.length;
    setActiveImage(nextIdx);
  }

  function updateLightboxContent() {
    const item = galleryImages[currentImageIndex];
    if (!item) return;

    if (DOM.lightboxImg) {
      DOM.lightboxImg.src = item.src;
      DOM.lightboxImg.alt = item.caption;
    }
    if (DOM.lightboxCaption) {
      DOM.lightboxCaption.textContent = item.caption;
    }
    if (DOM.lightboxCounter) {
      DOM.lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
  }

  /**
   * Friendly "Room Not Found" error state
   */
  function showNotFoundState(reasonText) {
    if (DOM.contentWrapper) DOM.contentWrapper.style.display = 'none';

    if (DOM.notFoundWrapper) {
      DOM.notFoundWrapper.style.display = 'block';
      DOM.notFoundWrapper.innerHTML = `
        <div class="container">
          <div class="room-not-found-card">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h1 class="empty-state-title">Accommodation Not Found</h1>
            <p class="empty-state-desc">
              ${escapeHTML(reasonText)}<br>
              The room you are looking for may have been retired or the address is mistyped.
            </p>
            <a href="rooms.html" class="btn btn--primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Return to All Accommodations
            </a>
          </div>
        </div>
      `;
    }

    document.title = 'Room Not Found — GrandVista Hotel';
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
})();
