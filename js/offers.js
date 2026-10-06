/**
 * GrandVista Hotel — Offers Module
 * Fetches and renders offers from backend/api/offers.php with category filtering
 * File: js/offers.js
 */

(function () {
  'use strict';

  let allOffers = [];
  let activeCategory = 'all';

  function init() {
    const filterButtons = document.querySelectorAll('.offers-filter-btn');
    const container = document.getElementById('offers-container');

    if (!container) return;

    // Check URL query param or hash for initial category
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category') || window.location.hash.replace('#', '');
    if (catParam) {
      activeCategory = catParam.toLowerCase();
    }

    // Set active button
    filterButtons.forEach((btn) => {
      const btnCat = btn.getAttribute('data-category');
      const isActive = btnCat === activeCategory || (activeCategory === '' && btnCat === 'all');
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));

      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        activeCategory = cat;
        filterButtons.forEach((b) => {
          const isCurrent = b === btn;
          b.classList.toggle('is-active', isCurrent);
          b.setAttribute('aria-pressed', String(isCurrent));
        });
        renderOffers(container);
      });
    });

    fetchOffers(container);
  }

  function fetchOffers(container) {
    fetch('backend/api/offers.php')
      .then((res) => {
        if (!res.ok) {
          console.error('Fetch error for backend/api/offers.php, status:', res.status);
          showApiErrorMessage(container, `Server error ${res.status}: Unable to load promotional offers. Please try again later.`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        allOffers = Array.isArray(data) ? data : [];
        renderOffers(container);
      })
      .catch((err) => {
        console.error('Fetch error for backend/api/offers.php:', err);
        showApiErrorMessage(container, 'Network error connecting to offers service. Please check your connection.');
      });
  }

  function showApiErrorMessage(container, message) {
    if (!container) return;
    container.innerHTML = `
      <div class="rooms-empty-state" style="grid-column: 1 / -1; border-color: #ef4444;" role="alert">
        <div class="empty-state-icon" style="color: #ef4444;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 class="empty-state-title" style="color: #b91c1c;">Unable to Load Special Offers</h3>
        <p class="empty-state-desc">${message}</p>
      </div>
    `;
  }

  function renderOffers(container) {
    const filtered = activeCategory === 'all'
      ? allOffers
      : allOffers.filter((o) => o.category === activeCategory);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="rooms-empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h3 class="empty-state-title">No offers in this category</h3>
          <p class="empty-state-desc">Explore other seasonal packages or book directly at our guaranteed best rates.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((offer) => `
      <article class="offer-card" data-category="${offer.category}">
        <div class="offer-card__image-wrap">
          <img src="${offer.image}" alt="${offer.title}" class="offer-card__img" loading="lazy">
          <span class="offer-card__discount-tag">${offer.discount_tag}</span>
          <span class="offer-card__category-badge">${offer.category_label}</span>
        </div>
        <div class="offer-card__body">
          <h3 class="offer-card__title">${offer.title}</h3>
          <div class="offer-card__validity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${offer.validity}</span>
          </div>
          <p class="offer-card__desc">${offer.description}</p>

          <ul class="offer-card__perks-list" aria-label="Included perks">
            ${offer.included_perks.map((perk) => `
              <li class="offer-card__perk-item">
                <span class="offer-card__perk-icon">✓</span>
                <span>${perk}</span>
              </li>
            `).join('')}
          </ul>

          <p class="offer-card__terms">${offer.terms}</p>

          <div class="offer-card__footer">
            <a href="booking.html" class="btn btn--primary btn--block">Book Package</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
