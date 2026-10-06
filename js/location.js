/**
 * GrandVista Hotel — Location & Attractions Module
 * File: js/location.js
 */

(function () {
  'use strict';

  const attractionsData = [
    {
      id: 1,
      name: 'Ramakrishna Beach',
      category: 'Nature & Coastal',
      distance: '0.8 km',
      travelTime: '5 mins by car / 10 mins walk',
      openingHours: 'Open 24 hours daily',
      image: 'images/attractions/beach.svg',
      description: 'A popular Visakhapatnam beachfront for seaside walks, ocean views, and local food stalls.'
    },
    {
      id: 2,
      name: 'INS Kursura Submarine Museum',
      category: 'Maritime History',
      distance: '1.5 km',
      travelTime: '5 mins by car / 20 mins walk',
      openingHours: 'Hours vary; check before visiting',
      image: 'images/attractions/museum.svg',
      description: 'A decommissioned Indian Navy submarine converted into a museum on the Visakhapatnam waterfront.'
    },
    {
      id: 3,
      name: 'Visakha Museum',
      category: 'Arts & Culture',
      distance: '1.5 km',
      travelTime: '5 mins by car',
      openingHours: 'Hours vary; check before visiting',
      image: 'images/attractions/museum.svg',
      description: 'A city museum showcasing regional history, maritime heritage, and cultural exhibits.'
    },
    {
      id: 4,
      name: 'Kailasagiri Hill Park',
      category: 'Parks & Views',
      distance: 'Approx. 8 km',
      travelTime: '20–30 mins by car',
      openingHours: 'Hours vary; check before visiting',
      image: 'images/attractions/botanical-gardens.svg',
      description: 'A hilltop park with panoramic views of Visakhapatnam and the Bay of Bengal.'
    },
    {
      id: 5,
      name: 'Simhachalam Temple',
      category: 'History & Architecture',
      distance: 'Approx. 18 km',
      travelTime: '40–50 mins by car',
      openingHours: 'Hours vary; check before visiting',
      image: 'images/attractions/imperial-fort.svg',
      description: 'A historic hilltop temple dedicated to Lord Narasimha, located within Visakhapatnam.'
    },
    {
      id: 6,
      name: 'Tenneti Park',
      category: 'Parks & Recreation',
      distance: 'Approx. 6 km',
      travelTime: '15–20 mins by car',
      openingHours: 'Open daily; hours may vary',
      image: 'images/attractions/botanical-gardens.svg',
      description: 'A coastal park with walking paths and views over the Bay of Bengal.'
    }
  ];

  function renderAttractions() {
    const container = document.getElementById('attractions-container');
    if (!container) return;

    container.innerHTML = attractionsData
      .map(
        (att) => `
        <article class="attraction-card">
          <div class="attraction-card__image-wrap">
            <img src="${att.image}" alt="${att.name}" loading="lazy" />
            <span class="attraction-card__distance-badge">${att.distance}</span>
          </div>
          <div class="attraction-card__content">
            <span class="attraction-card__category">${att.category}</span>
            <h3 class="attraction-card__title">${att.name}</h3>
            <p class="attraction-card__desc">${att.description}</p>
            <div class="attraction-card__meta">
              <div class="attraction-meta-row">
                <span class="meta-label">⏱️ Travel Time:</span>
                <span class="meta-value">${att.travelTime}</span>
              </div>
              <div class="attraction-meta-row">
                <span class="meta-label">🕒 Opening Hours:</span>
                <span class="meta-value">${att.openingHours}</span>
              </div>
            </div>
          </div>
        </article>
      `
      )
      .join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAttractions);
  } else {
    renderAttractions();
  }
})();
