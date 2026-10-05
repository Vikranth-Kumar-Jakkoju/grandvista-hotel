/**
 * GrandVista Hotel — Offers Module
 * Handles dynamic loading, client-side category filtering, and fallback rendering
 * File: js/offers.js
 */

(function () {
  'use strict';

  // Fallback offers data if fetch is restricted (e.g. file:// protocol)
  const FALLBACK_OFFERS = [
    {
      id: "weekend-indulgence",
      slug: "weekend-indulgence",
      title: "Weekend Indulgence Getaway",
      category: "weekend",
      category_label: "Weekend Offers",
      discount_tag: "Up to 25% OFF",
      validity: "Valid Friday – Sunday through Dec 2026",
      description: "Escape the weekly routine and surrender to unmatched luxury. Includes decadent champagne breakfast, gourmet high tea, and relaxed late checkout.",
      included_perks: [
        "Lavish buffet breakfast at GrandVista Restaurant",
        "Traditional English Afternoon Tea for two",
        "Complimentary late checkout until 4:00 PM",
        "₹1,500 credit toward Aheli Spa therapies"
      ],
      terms: "*Minimum 2-night stay required across Friday–Sunday. Subject to room allocation.",
      image: "images/offers/weekend.svg"
    },
    {
      id: "early-bird-privilege",
      slug: "early-bird-privilege",
      title: "Early Bird Booking Privilege",
      category: "early-bird",
      category_label: "Early Booking",
      discount_tag: "Save Flat 20%",
      validity: "Book 30+ days in advance",
      description: "Plan ahead and enjoy guaranteed preferred room tiers, elevated welcome amenities, and exceptional rate savings on our premier suites.",
      included_perks: [
        "Guaranteed best available suite rates",
        "Welcome fruit basket & artisanal chocolates",
        "Complimentary high-speed premium Wi-Fi",
        "Flexible date change up to 7 days prior"
      ],
      terms: "*Full prepayment required at time of reservation. Non-refundable cancellation.",
      image: "images/offers/early-bird.svg"
    },
    {
      id: "romantic-rendezvous",
      slug: "romantic-rendezvous",
      title: "Romantic Rendezvous For Two",
      category: "couples",
      category_label: "Couple Packages",
      discount_tag: "From ₹22,000 / night",
      validity: "Valid all year round",
      description: "Celebrate your connection with bespoke romance. Enjoy private candlelit dining, couples hydrotherapy, and a bottle of sparkling wine upon arrival.",
      included_perks: [
        "Chilled sparkling wine & strawberry platter on arrival",
        "4-course candlelit dinner at GrandVista Restaurant or Terrace",
        "60-minute signature couples massage at Aheli Spa",
        "Rose petal bath turndown service & late checkout"
      ],
      terms: "*Valid for double occupancy. Minimum 48-hour advance notice for spa slot.",
      image: "images/offers/couples.svg"
    },
    {
      id: "family-memories-escape",
      slug: "family-memories-escape",
      title: "Family Holiday & Memories Package",
      category: "family",
      category_label: "Family Packages",
      discount_tag: "2nd Room at 50% OFF",
      validity: "Valid during school holidays & weekends",
      description: "Thoughtfully crafted for memorable family moments. Interconnecting suites, kid-friendly welcome surprises, and complimentary dining for young ones.",
      included_perks: [
        "Second adjoining room at 50% published rate",
        "Kids under 12 stay and dine complimentary from children's menu",
        "Daily family pass to the heated infinity pool & games lounge",
        "Complimentary evening movie & popcorn turndown for kids"
      ],
      terms: "*Applicable for 2 adults and up to 2 children. ID verification required at check-in.",
      image: "images/offers/family.svg"
    },
    {
      id: "executive-business-stay",
      slug: "executive-business-stay",
      title: "Executive Corporate Stay",
      category: "business",
      category_label: "Business Stay",
      discount_tag: "Corporate Rate Benefits",
      validity: "Valid Sunday – Thursday stays",
      description: "Designed for demanding business travelers requiring seamless productivity, uninterrupted rest, and flawless concierge assistance.",
      included_perks: [
        "Chauffeured airport transfer (one-way)",
        "Daily 4 pieces of complimentary executive laundry/pressing",
        "2 hours complimentary boardroom access per stay",
        "Express check-in and lounge happy hour cocktail access"
      ],
      terms: "*Corporate business card or corporate ID required at arrival.",
      image: "images/offers/business.svg"
    },
    {
      id: "extended-stay-residence",
      slug: "extended-stay-residence",
      title: "Extended Luxury Residence",
      category: "long-stay",
      category_label: "Long Stay",
      discount_tag: "Save Up to 35%",
      validity: "Valid for stays of 7+ consecutive nights",
      description: "Make GrandVista your premier city residence. Generous discounts, dedicated butler services, and full access to private hotel amenities.",
      included_perks: [
        "Progressive weekly discount up to 35% on suite categories",
        "Complimentary weekly laundry service (up to 20 garments)",
        "20% savings on all hotel dining venues & room service",
        "Dedicated guest relations manager and priority housekeeping"
      ],
      terms: "*Minimum consecutive stay of 7 nights required. Early departure will re-rate to standard pricing.",
      image: "images/offers/long-stay.svg"
    },
    {
      id: "festive-celebration-package",
      slug: "festive-celebration-package",
      title: "Grand Festive Celebration Package",
      category: "festival",
      category_label: "Festival Offers",
      discount_tag: "Special Holiday Inclusions",
      validity: "Valid during National & Cultural Holidays",
      description: "Immerse yourself in festive jubilation with traditional delicacies, cultural performances, and joyful curated experiences for the whole party.",
      included_perks: [
        "Grand festive gala dinner buffet with live culinary stations",
        "Curated artisanal mithai & gourmet festive gift hamper",
        "Exclusive invitations to the evening courtyard celebrations",
        "₹2,500 hotel dining & beverage credit"
      ],
      terms: "*Special holiday cancellation window applies (7 days prior). Subject to festival calendar.",
      image: "images/offers/festival.svg"
    }
  ];

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
    fetch('data/offers.json')
      .then((res) => {
        if (!res.ok) throw new Error('Network error loading offers');
        return res.json();
      })
      .then((data) => {
        allOffers = Array.isArray(data) ? data : FALLBACK_OFFERS;
        renderOffers(container);
      })
      .catch((err) => {
        console.warn('Using fallback offers data:', err);
        allOffers = FALLBACK_OFFERS;
        renderOffers(container);
      });
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
