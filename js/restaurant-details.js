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

  // Fallback venue data for offline / file:// protocol
  const FALLBACK_RESTAURANTS = [
    {
      id: "grandvista-restaurant",
      slug: "grandvista-restaurant",
      name: "GrandVista Restaurant",
      subtitle: "Contemporary Fine Dining & Royal Indian Heritage",
      hero_image: "images/dining/restaurant.svg",
      gallery: [
        {
          src: "images/dining/restaurant.svg",
          caption: "The Grand Dining Hall with crystal chandeliers and intimate banquette seating",
          alt: "GrandVista Restaurant Grand Dining Room"
        },
        {
          src: "images/dining/signature-dish.svg",
          caption: "Signature Pan-Seared Himalayan Trout with Saffron Infusion",
          alt: "Signature Culinary Dish"
        },
        {
          src: "images/dining/dessert.svg",
          caption: "Grand Chocolate Sphere with Gold Dust and Fresh Berry Coulis",
          alt: "Artisan Dessert"
        },
        {
          src: "images/dining/patio.svg",
          caption: "Courtyard Al Fresco Verandah overlooking the garden fountains",
          alt: "Verandah Al Fresco Seating"
        }
      ],
      cuisine: [
        "Modern Indian",
        "European Contemporary",
        "Awadhi Royal Cuisine"
      ],
      hours: "Breakfast: 7:00 AM – 10:30 AM | Lunch: 12:30 PM – 3:30 PM | Dinner: 7:00 PM – 11:30 PM",
      dress_code: "Smart Casual / Elegant Evening (Collared shirts, no athletic wear)",
      location: "Main Lobby Level, East Wing Atrium",
      description: "GrandVista Restaurant presents an epicurean journey marrying centuries-old royal culinary heritage with progressive global gastronomy. Under the guidance of our Master Executive Chef, each recipe honors heritage spices, sustainable farm-to-table produce, and theatrical table-side presentations.",
      signature_dishes: [
        {
          name: "Royal Saffron Dum Biryani",
          description: "Slow-cooked aged basmati rice layered with aromatic saffron, marinated meat or royal wild mushrooms, sealed with artisanal whole wheat dough.",
          price: 1450,
          is_veg: false,
          image: "images/dining/signature-dish.svg"
        },
        {
          name: "Truffled Morel & Paneer Tikka",
          description: "Charcoal-smoked cottage cheese stuffed with Kashmiri morels, glazed in black truffle butter and hung curd marinade.",
          price: 1250,
          is_veg: true,
          image: "images/dining/signature-dish.svg"
        },
        {
          name: "Grand Cru Chocolate Sphere",
          description: "70% Valrhona dark chocolate dome melted table-side with warm Madagascar bourbon vanilla ganache and raspberry coulis.",
          price: 850,
          is_veg: true,
          image: "images/dining/dessert.svg"
        }
      ]
    },
    {
      id: "sky-lounge",
      slug: "sky-lounge",
      name: "Sky Lounge & Rooftop Bar",
      subtitle: "Panoramic Skyline Views, Tapas & Mixology",
      hero_image: "images/dining/sky-lounge.svg",
      gallery: [
        {
          src: "images/dining/sky-lounge.svg",
          caption: "Rooftop observation terrace with illuminated skyline vistas",
          alt: "Sky Lounge Rooftop Observation View"
        },
        {
          src: "images/dining/cocktail.svg",
          caption: "Bespoke Oak-Smoked Bourbon Cocktail crafted by our Resident Mixologist",
          alt: "Handcrafted Rooftop Cocktail"
        },
        {
          src: "images/dining/patio.svg",
          caption: "Starlit lounge cabanas with fire pits and plush lounge sofas",
          alt: "Rooftop Starlit Cabana"
        },
        {
          src: "images/dining/signature-dish.svg",
          caption: "Gourmet Robata Skewers and Mediterranean mezze platters",
          alt: "Rooftop Tapas Platter"
        }
      ],
      cuisine: [
        "Artisanal Tapas",
        "Wood-Fired Robata Grill",
        "Craft Mixology & Rare Spirits"
      ],
      hours: "Evening & Nightly: 5:00 PM – 1:00 AM (Live DJ from 8:00 PM)",
      dress_code: "Chic Evening / Glamour (Collared shirts for gentlemen)",
      location: "Rooftop Terrace (14th Floor)",
      description: "Perched on the 14th floor commanding uninterrupted 360-degree vistas across the capital skyline, Sky Lounge is the city's premier evening sanctuary. Sip bespoke barrel-aged concoctions, rare vintage malts, and sample artisanal small plates while listening to soothing deep ambient house grooves under the open sky.",
      signature_dishes: [
        {
          name: "Smoked Hickory Old Fashioned",
          description: "Single barrel bourbon infused with orange zest, Angostura bitters, served under a cloche with fresh hickory wood smoke.",
          price: 950,
          is_veg: true,
          image: "images/dining/cocktail.svg"
        },
        {
          name: "Glazed Pork Belly / Tofu Robata Skewers",
          description: "Slow-braised skewers caramelized over binchotan charcoal with yuzu honey reduction and toasted sesame.",
          price: 1100,
          is_veg: false,
          image: "images/dining/signature-dish.svg"
        },
        {
          name: "Truffle Edamame & Parmesan Dumplings",
          description: "Steamed crystal dumplings filled with crushed edamame, shaved black truffles, and aged parmesan broth.",
          price: 980,
          is_veg: true,
          image: "images/dining/signature-dish.svg"
        }
      ]
    },
    {
      id: "the-grand-cafe",
      slug: "the-grand-cafe",
      name: "The Grand Café",
      subtitle: "Artisanal Boulangerie, Viennoiserie & Single-Origin Roasts",
      hero_image: "images/dining/cafe.svg",
      gallery: [
        {
          src: "images/dining/cafe.svg",
          caption: "Sunlit European brass & marble café atrium with fresh morning pastry displays",
          alt: "The Grand Café Marble Atrium"
        },
        {
          src: "images/dining/dessert.svg",
          caption: "Handcrafted Parisian Macarons and seasonal French fruit tartlets",
          alt: "Artisan Pastry & Tarts"
        },
        {
          src: "images/dining/patio.svg",
          caption: "Sun-dappled courtyard garden patio for relaxed morning coffee and books",
          alt: "Courtyard Café Patio"
        },
        {
          src: "images/dining/signature-dish.svg",
          caption: "Freshly baked sourdough tartines with avocado, smoked salmon, and poached egg",
          alt: "Artisan Sourdough Tartine"
        }
      ],
      cuisine: [
        "French Boulangerie & Viennoiserie",
        "Specialty Single-Origin Coffees",
        "Gourmet Sandwiches & High Tea"
      ],
      hours: "Daily: 6:30 AM – 10:00 PM (Oven bakes fresh 3 times daily)",
      dress_code: "Casual / Relaxed Comfort",
      location: "Lobby Level, North Courtyard Colonnade",
      description: "The Grand Café is an intimate, sun-dappled haven evoking Parisian boulevards. Savor morning sourdough croissants baked fresh throughout the day, pour-over specialty Arabica coffees from Chikmagalur estates, and bespoke afternoon high tea tiered stands served in bone china.",
      signature_dishes: [
        {
          name: "Chikmagalur Pour-Over Single Origin",
          description: "Shade-grown specialty coffee brewed manually table-side with citrus and bittersweet dark cocoa undertones.",
          price: 420,
          is_veg: true,
          image: "images/dining/cafe.svg"
        },
        {
          name: "Almond Croissant & Wild Berry Tart",
          description: "Flaky hand-laminated butter croissant filled with frangipane cream, paired with fresh seasonal berries.",
          price: 480,
          is_veg: true,
          image: "images/dining/dessert.svg"
        },
        {
          name: "Avocado & Burrata Sourdough Tartine",
          description: "Crusty wood-fired sourdough toast topped with Hass avocado, creamy artisanal burrata, heirloom cherry tomatoes, and basil oil.",
          price: 750,
          is_veg: true,
          image: "images/dining/signature-dish.svg"
        }
      ]
    }
  ];

  // Fallback menu items
  const FALLBACK_MENUS = {
    "grandvista-restaurant": [
      { id: "gvr-1", name: "Kashmiri Morel & Truffle Tikka", category: "starters", description: "Charcoal-tandoor smoked cottage cheese morsels stuffed with wild Himalayan morels, brushed with black truffle butter.", price: 1250, is_veg: true },
      { id: "gvr-2", name: "Galouti Kebab on Sheermal", category: "starters", description: "Melt-in-mouth Awadhi spiced lamb patties seasoned with 24 royal herbs, served atop miniature saffron milk breads.", price: 1400, is_veg: false },
      { id: "gvr-3", name: "Burrata with Charred Fig & Kasundi", category: "starters", description: "Fresh artisan burrata paired with wood-roasted figs, Bengal mustard Kasundi dressing, and roasted walnuts.", price: 950, is_veg: true },
      { id: "gvr-4", name: "Pan-Seared Sea Bass with Saffron Jus", category: "mains", description: "Wild-caught Chilean sea bass filet on a bed of curried leeks, served with fragrant Kashmiri saffron emulsion.", price: 1850, is_veg: false },
      { id: "gvr-5", name: "Dal GrandVista — 36-Hour Simmered", category: "mains", description: "Our legendary black lentils slowly simmered over woodfire embers for 36 hours with churned white butter and tomato puree.", price: 890, is_veg: true },
      { id: "gvr-6", name: "Dum Pukht Awadhi Nalli Nihari", category: "mains", description: "Slow-braised tender lamb shanks in an aromatic spiced marrow gravy, topped with ginger juliennes and fresh mint.", price: 1650, is_veg: false },
      { id: "gvr-7", name: "Grand Cru Valrhona Chocolate Sphere", category: "desserts", description: "Dark chocolate dome filled with salted caramel mousse and hazelnut praline, melted table-side with hot berry coulis.", price: 850, is_veg: true },
      { id: "gvr-8", name: "Rosewater & Pistachio Kulfi Tasting", category: "desserts", description: "Slow-reduced clotted milk ice cream scented with Persian rosewater and edible 24K silver leaf.", price: 680, is_veg: true },
      { id: "gvr-9", name: "The Royal Viceroy — Signature Concoction", category: "drinks", description: "Rare scotch whisky infused with Darjeeling First Flush tea, smoked clove mist, and spiced demerara syrup.", price: 1100, is_veg: true },
      { id: "gvr-10", name: "Saffron Cardamom Lassi Shrub (Mocktail)", category: "drinks", description: "Hand-churned organic yogurt shaken with organic saffron honey, crushed green cardamom, and rose petal infusion.", price: 550, is_veg: true }
    ],
    "sky-lounge": [
      { id: "sky-1", name: "Robata Glazed Shiitake & Asparagus", category: "starters", description: "Charcoal-grilled mountain asparagus and jumbo shiitake mushrooms glazed with sweet yuzu soy reduction.", price: 890, is_veg: true },
      { id: "sky-2", name: "Crispy Calamari & Tiger Prawns", category: "starters", description: "Lightly tempura-dusted squid rings and wild prawns tossed in Togarashi spice with citrus wasabi aioli.", price: 1200, is_veg: false },
      { id: "sky-3", name: "Truffle & Edamame Crystal Dumplings", category: "starters", description: "Delicate steamed translucent parcels filled with crushed edamame beans and aromatic black truffle oil.", price: 980, is_veg: true },
      { id: "sky-4", name: "Wagyu & Truffle Brioche Sliders (2 pcs)", category: "mains", description: "Premium wagyu patties seared rare on toasted mini brioche buns with aged Gruyère and onion jam.", price: 1650, is_veg: false },
      { id: "sky-5", name: "Artisanal Mezze & Flatbread Platter", category: "mains", description: "Roasted beet hummus, smoked baba ganoush, muhammara, marinated kalamata olives, and fresh wood-fired za'atar lavash.", price: 1150, is_veg: true },
      { id: "sky-6", name: "Smoked Hickory Old Fashioned", category: "drinks", description: "Kentucky bourbon, aromatic bitters, brown sugar cube, presented in cut crystal with captured hickory smoke.", price: 950, is_veg: true },
      { id: "sky-7", name: "GrandVista Twilight Sky Martini", category: "drinks", description: "Empress 1908 botanical gin, elderflower liqueur, freshly squeezed lime juice, and a lavender mist float.", price: 900, is_veg: true },
      { id: "sky-8", name: "Yuzu Citrus Posset & Matcha Crisp", category: "desserts", description: "Velvety Japanese yuzu cream chilled and crowned with candied citrus peels and delicate matcha tuile cookies.", price: 750, is_veg: true }
    ],
    "the-grand-cafe": [
      { id: "tgc-1", name: "Avocado & Burrata Sourdough Tartine", category: "starters", description: "Artisan country loaf rubbed with garlic, crushed Hass avocado, creamy Puglia burrata, and basil oil drizzle.", price: 750, is_veg: true },
      { id: "tgc-2", name: "Smoked Salmon & Capers Bagel", category: "starters", description: "House-baked everything bagel with Norwegian smoked salmon, herbed cream cheese, capers, and shaved red onion.", price: 890, is_veg: false },
      { id: "tgc-3", name: "Truffled Forest Mushroom Quiche", category: "mains", description: "Flaky butter pastry filled with wild sautéed morels, porcini, Gruyère cheese custard, and organic petite salad.", price: 820, is_veg: true },
      { id: "tgc-4", name: "GrandVista Club Sandwich", category: "mains", description: "Triple-deck toasted brioche layered with herb-roasted chicken breast, applewood smoked bacon, farm eggs, and Dijon mayo.", price: 950, is_veg: false },
      { id: "tgc-5", name: "Warm Hand-Laminated Pain Au Chocolat", category: "desserts", description: "French Normandy butter laminated pastry filled with double batons of 64% Valrhona dark chocolate.", price: 380, is_veg: true },
      { id: "tgc-6", name: "Madagascar Vanilla Bean Mille-Feuille", category: "desserts", description: "Crisp caramelized puff pastry sheets layered with light Tahitian vanilla diplomat cream and fresh raspberries.", price: 540, is_veg: true },
      { id: "tgc-7", name: "Single-Origin Chikmagalur Pour-Over", category: "drinks", description: "Specialty estate roast prepared via V60 filter, revealing bright citrus notes and a velvety bittersweet chocolate finish.", price: 420, is_veg: true },
      { id: "tgc-8", name: "Iced Spanish Saffron Latte", category: "drinks", description: "Double espresso shot layered over condensed milk, chilled oat milk, and a delicate pinch of real saffron threads.", price: 490, is_veg: true }
    ]
  };

  let allVenues = FALLBACK_RESTAURANTS;
  let currentVenue = null;
  let currentMenuItems = [];
  let activeMenuCategory = 'all';
  let lightboxGallery = [];
  let lightboxIndex = 0;

  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = (urlParams.get('restaurant') || 'grandvista-restaurant').toLowerCase();

    currentVenue = allVenues.find((v) => v.slug === slug) || allVenues[0];
    loadVenueData(slug);
    initReservationForm();
  }

  function loadVenueData(slug) {
    Promise.all([
      fetch('data/restaurants.json').then((r) => r.json()).catch(() => FALLBACK_RESTAURANTS),
      fetch('data/menu-items.json').then((r) => r.json()).catch(() => FALLBACK_MENUS)
    ])
      .then(([restaurants, menus]) => {
        allVenues = Array.isArray(restaurants) ? restaurants : FALLBACK_RESTAURANTS;
        currentVenue = allVenues.find((v) => v.slug === slug) || allVenues[0];
        const allMenus = menus || FALLBACK_MENUS;
        currentMenuItems = allMenus[currentVenue.slug] || [];

        renderVenue(currentVenue);
        renderGallery(currentVenue);
        renderSignatureDishes(currentVenue);
        renderDigitalMenu();
        initMenuFilters();
        prefillReservationVenue(currentVenue);
      })
      .catch((err) => {
        console.warn('Fallback rendering for restaurant-details:', err);
        allVenues = FALLBACK_RESTAURANTS;
        currentVenue = allVenues.find((v) => v.slug === slug) || allVenues[0];
        currentMenuItems = FALLBACK_MENUS[currentVenue.slug] || [];

        renderVenue(currentVenue);
        renderGallery(currentVenue);
        renderSignatureDishes(currentVenue);
        renderDigitalMenu();
        initMenuFilters();
        prefillReservationVenue(currentVenue);
      });
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

    form.addEventListener('submit', (e) => {
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

      // Generate Reference Code
      const refNumber = 'GVR-' + Math.floor(10000 + Math.random() * 90000);

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
        if (confirmationBox) confirmationBox.style.display = 'none';
        form.style.display = 'block';
      });
    }
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
