/**
 * GrandVista Hotel — Dining Module
 * Fetches and renders dining venues from backend/api/restaurants.php
 * File: js/dining.js
 */

(function () {
  'use strict';

  function init() {
    const container = document.getElementById('dining-container');
    if (!container) return;

    fetch('backend/api/restaurants.php')
      .then((res) => {
        if (!res.ok) {
          console.error('Fetch error for backend/api/restaurants.php, status:', res.status);
          showApiErrorMessage(container, `Server error ${res.status}: Unable to load dining venues. Please try again later.`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        renderVenues(Array.isArray(data) ? data : [], container);
      })
      .catch((err) => {
        console.error('Fetch error for backend/api/restaurants.php:', err);
        showApiErrorMessage(container, 'Network error connecting to dining service. Please check your connection.');
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
        <h3 class="empty-state-title" style="color: #b91c1c;">Unable to Load Dining Venues</h3>
        <p class="empty-state-desc">${message}</p>
      </div>
    `;
  }

  function renderVenues(venues, container) {
    container.innerHTML = venues.map((venue) => `
      <article class="dining-card">
        <div class="dining-card__image-wrap">
          <img src="${venue.hero_image}" alt="${venue.name}" class="dining-card__img" loading="lazy">
        </div>
        <div class="dining-card__body">
          <h2 class="dining-card__title">${venue.name}</h2>
          <p class="dining-card__subtitle">${venue.subtitle}</p>

          <div class="dining-card__cuisines" aria-label="Cuisine types">
            ${venue.cuisine.map((c) => `<span class="dining-cuisine-pill">${c}</span>`).join('')}
          </div>

          <div class="dining-card__meta-list">
            <div class="dining-card__meta-item">
              <svg class="dining-card__meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span><strong>Hours:</strong> ${venue.hours}</span>
            </div>
            <div class="dining-card__meta-item">
              <svg class="dining-card__meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"></path>
              </svg>
              <span><strong>Attire:</strong> ${venue.dress_code}</span>
            </div>
            <div class="dining-card__meta-item">
              <svg class="dining-card__meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span><strong>Location:</strong> ${venue.location}</span>
            </div>
          </div>

          <p class="dining-card__desc">${venue.description}</p>

          <div class="dining-card__actions">
            <a href="restaurant-details.html?restaurant=${venue.slug}" class="btn btn--outline btn--sm">View Menu</a>
            <a href="restaurant-details.html?restaurant=${venue.slug}#reserve" class="btn btn--primary btn--sm">Reserve Table</a>
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
