/**
 * GrandVista Hotel — Location & Attractions Module
 * File: js/location.js
 */

(function () {
  'use strict';

  const attractionsData = [
    {
      id: 1,
      name: 'Golden Promenade Beach & Pier',
      category: 'Nature & Coastal',
      distance: '2.5 km',
      travelTime: '8 mins by private car',
      openingHours: 'Open 24 hours daily',
      image: 'images/attractions/beach.svg',
      description: 'A serene coastline promenade lined with heritage lampposts, pristine golden sands, and fresh ocean breezes. Perfect for sunrise strolls, jogging, and sunset dining.'
    },
    {
      id: 2,
      name: 'The Imperial Luxury Galleria',
      category: 'Shopping & Leisure',
      distance: '1.2 km',
      travelTime: '4 mins by car / 12 mins walk',
      openingHours: '10:00 AM – 10:00 PM daily',
      image: 'images/attractions/shopping-mall.svg',
      description: 'An architectural marvel featuring over 150 international haute couture boutiques, fine watchmakers, curated artisan jewelers, and gourmet confectionery salons.'
    },
    {
      id: 3,
      name: 'National Heritage Museum & Gallery',
      category: 'Arts & Culture',
      distance: '3.8 km',
      travelTime: '12 mins by car / metro',
      openingHours: '9:30 AM – 5:30 PM (Closed Mondays)',
      image: 'images/attractions/museum.svg',
      description: 'Houses five centuries of neoclassical sculpture, royal Mughal textiles, classical oil portraits, and archaeological treasures with English audio guides.'
    },
    {
      id: 4,
      name: 'Central Business & Financial District',
      category: 'Business & Commerce',
      distance: '4.0 km',
      travelTime: '10 mins by car / express shuttle',
      openingHours: 'Commercial hours (8:00 AM – 8:00 PM)',
      image: 'images/attractions/business-district.svg',
      description: 'The premier commercial hub featuring global corporate headquarters, the Stock Exchange, international banking houses, and rooftop executive lounges.'
    },
    {
      id: 5,
      name: 'Historic Imperial Heritage Citadel',
      category: 'History & Architecture',
      distance: '5.5 km',
      travelTime: '15 mins by car',
      openingHours: 'Sunrise to Sunset daily',
      image: 'images/attractions/imperial-fort.svg',
      description: 'A 16th-century red sandstone fortress boasting regal gates, courtyards, marble pavilions, and evening sound-and-light heritage spectacles.'
    },
    {
      id: 6,
      name: 'Royal Victorian Botanical Gardens',
      category: 'Parks & Recreation',
      distance: '2.0 km',
      travelTime: '6 mins by car / 18 mins walk',
      openingHours: '6:00 AM – 7:00 PM daily',
      image: 'images/attractions/botanical-gardens.svg',
      description: 'Spanning over 60 verdant acres with manicured rose gardens, century-old tropical palm groves, tranquil lotus ponds, and a Victorian glass conservatory.'
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
