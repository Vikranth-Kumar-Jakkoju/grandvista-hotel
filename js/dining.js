/**
 * GrandVista Hotel — Dining Module
 * Fetches and renders dining venues from data/restaurants.json with fallback support
 * File: js/dining.js
 */

(function () {
  'use strict';

  const FALLBACK_RESTAURANTS = [
    {
      id: "grandvista-restaurant",
      slug: "grandvista-restaurant",
      name: "GrandVista Restaurant",
      subtitle: "Contemporary Fine Dining & Royal Indian Heritage",
      hero_image: "images/dining/restaurant.svg",
      cuisine: [
        "Modern Indian",
        "European Contemporary",
        "Awadhi Royal Cuisine"
      ],
      hours: "Breakfast: 7:00 AM – 10:30 AM | Lunch: 12:30 PM – 3:30 PM | Dinner: 7:00 PM – 11:30 PM",
      dress_code: "Smart Casual / Elegant Evening",
      location: "Main Lobby Level, East Wing Atrium",
      description: "GrandVista Restaurant presents an epicurean journey marrying centuries-old royal culinary heritage with progressive global gastronomy. Under the guidance of our Master Executive Chef, each recipe honors heritage spices, sustainable farm-to-table produce, and theatrical table-side presentations."
    },
    {
      id: "sky-lounge",
      slug: "sky-lounge",
      name: "Sky Lounge & Rooftop Bar",
      subtitle: "Panoramic Skyline Views, Tapas & Mixology",
      hero_image: "images/dining/sky-lounge.svg",
      cuisine: [
        "Artisanal Tapas",
        "Wood-Fired Robata Grill",
        "Craft Mixology & Rare Spirits"
      ],
      hours: "Evening & Nightly: 5:00 PM – 1:00 AM (Live DJ from 8:00 PM)",
      dress_code: "Chic Evening / Glamour",
      location: "Rooftop Terrace (14th Floor)",
      description: "Perched on the 14th floor commanding uninterrupted 360-degree vistas across the capital skyline, Sky Lounge is the city's premier evening sanctuary. Sip bespoke barrel-aged concoctions, rare vintage malts, and sample artisanal small plates while listening to soothing deep ambient house grooves under the open sky."
    },
    {
      id: "the-grand-cafe",
      slug: "the-grand-cafe",
      name: "The Grand Café",
      subtitle: "Artisanal Boulangerie, Viennoiserie & Single-Origin Roasts",
      hero_image: "images/dining/cafe.svg",
      cuisine: [
        "French Boulangerie & Viennoiserie",
        "Specialty Single-Origin Coffees",
        "Gourmet Sandwiches & High Tea"
      ],
      hours: "Daily: 6:30 AM – 10:00 PM (Oven bakes fresh 3 times daily)",
      dress_code: "Casual / Relaxed Comfort",
      location: "Lobby Level, North Courtyard Colonnade",
      description: "The Grand Café is an intimate, sun-dappled haven evoking Parisian boulevards. Savor morning sourdough croissants baked fresh throughout the day, pour-over specialty Arabica coffees from Chikmagalur estates, and bespoke afternoon high tea tiered stands served in bone china."
    }
  ];

  function init() {
    const container = document.getElementById('dining-container');
    if (!container) return;

    fetch('data/restaurants.json')
      .then((res) => {
        if (!res.ok) throw new Error('Network error loading restaurants');
        return res.json();
      })
      .then((data) => {
        renderVenues(Array.isArray(data) ? data : FALLBACK_RESTAURANTS, container);
      })
      .catch((err) => {
        console.warn('Using fallback restaurants data:', err);
        renderVenues(FALLBACK_RESTAURANTS, container);
      });
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
