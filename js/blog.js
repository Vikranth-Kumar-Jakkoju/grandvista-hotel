/**
 * GrandVista Hotel — Journal & Travel Blog Module
 * File: js/blog.js
 */

(function () {
  'use strict';

  const blogArticles = [
    {
      id: 1,
      slug: 'things-to-do-near-the-hotel',
      title: 'Things to Do Near the Hotel',
      category: 'Things to Do',
      categorySlug: 'things-to-do',
      author: 'Julian Vance, Chief Concierge',
      publishedDate: 'October 2, 2026',
      readMinutes: 6,
      image: 'images/blog/things-to-do.svg',
      excerpt: 'From private art viewings at heritage galleries to tranquil morning walks through Mughal gardens, discover the finest cultural experiences steps from GrandVista.',
      content: `
        <p>Stepping out of the serene marble corridors of GrandVista Hotel, guests find themselves nestled in the most prestigious and culturally vibrant neighborhood of the capital. The Diplomatic Enclave pairs quiet tree-lined boulevards with instantaneous access to the city's finest monuments, museums, and artisanal markets.</p>

        <h2>Morning: Stroll the Imperial Botanical Groves</h2>
        <p>Begin your morning just after sunrise with a short six-minute stroll to the historic Victorian Botanical Gardens. Over 60 acres of heritage flora, tranquil lotus ponds, and a cast-iron glasshouse conservatory offer a refreshing sanctuary before the city awakens. The morning air is filled with the scent of blossoming jasmine and exotic orchids.</p>

        <blockquote>"The beauty of our enclave lies in its duality: serene seclusion within our gates, with historic landmarks just beyond the threshold."</blockquote>

        <h2>Midday: Private Viewings at National Heritage Gallery</h2>
        <p>Art connoisseurs will relish spending midday exploring the National Heritage Museum &amp; Gallery, located less than four kilometers from the hotel. Housing over five centuries of classical Indian miniature paintings, royal textiles, and neoclassical sculpture, the gallery offers curated audio guides. Our concierge team can arrange private after-hours viewing access upon request.</p>

        <h2>Afternoon: Haute Couture at The Imperial Galleria</h2>
        <p>A short chauffeured ride brings you to The Imperial Luxury Galleria, the city’s landmark luxury shopping destination. Here, international fashion houses sit alongside bespoke master tailors and artisanal perfumeries. Savor an afternoon cup of single-origin Darjeeling tea in the central atrium before returning to GrandVista for sunset cocktails at Sky Lounge.</p>
      `,
      relatedService: {
        title: 'Chauffeured City Excursions',
        desc: 'Book a bespoke Mercedes-Benz chauffeured tour curated by our Concierge.',
        link: 'contact.html',
        linkText: 'Inquire with Concierge'
      }
    },
    {
      id: 2,
      slug: 'weekend-travel-guide',
      title: 'Weekend Travel Guide: A 48-Hour Luxury Escape',
      category: 'Weekend Trips',
      categorySlug: 'weekend-trips',
      author: 'Aria Montgomery, Travel Editor',
      publishedDate: 'September 28, 2026',
      readMinutes: 5,
      image: 'images/blog/weekend-guide.svg',
      excerpt: 'How to experience the ultimate rejuvenating 48 hours in the capital, combining bespoke suite indulgence, award-winning spa treatments, and fine dining.',
      content: `
        <p>A weekend escape should feel like a timeless pause—an immersion into uncompromising comfort, sublime gastronomy, and peaceful revitalization. Whether you are visiting from abroad or enjoying a mindful weekend staycation, this 48-hour itinerary is designed to maximize relaxation and cultural discovery.</p>

        <h2>Friday Evening: Check-In &amp; Skyline Welcome</h2>
        <p>Check into your Executive Suite where chilled champagne and artisanal hand-rolled truffles await. After settling into your spacious residential salon, head up to the 14th-floor Sky Lounge &amp; Rooftop Bar. Watch the evening sky ignite with hues of amber and violet while savoring handcrafted botanical gin cocktails and Spanish tapas.</p>

        <h2>Saturday: Wellness, Culture &amp; Cellar Dining</h2>
        <p>Awaken refreshed to sunrise views over the city skyline. Enjoy breakfast on your private balcony before your morning session at the GrandVista Spa. Indulge in our 60-minute signature Ayurvedic aromatherapy massage with warm sandalwood oils.</p>
        <p>Spend the afternoon exploring nearby heritage citadels before dining at GrandVista Restaurant, where Chef Julian Vance prepares an exquisite 5-course degustation menu paired with cellar vintages.</p>

        <blockquote>"A true luxury weekend isn't rushed; it allows moments to breathe, savor, and be fully present in elegance."</blockquote>

        <h2>Sunday: Leisurely Brunch &amp; Late Check-Out</h2>
        <p>Take full advantage of our Weekend Escapes package offering guaranteed late check-out until 4:00 PM. Relish an opulent Sunday champagne brunch featuring live sushi counters, imported cheeses, and wood-fired artisanal breads.</p>
      `,
      relatedService: {
        title: 'Weekend Indulgence Package',
        desc: 'Enjoy complimentary breakfast, 20% spa credits, and late checkout with our Weekend Package.',
        link: 'offers.html',
        linkText: 'Explore Weekend Offers'
      }
    },
    {
      id: 3,
      slug: 'best-local-food-to-try',
      title: 'Best Local Food to Try: An Epicurean Culinary Journey',
      category: 'Food',
      categorySlug: 'food',
      author: 'Executive Chef Julian Vance',
      publishedDate: 'September 22, 2026',
      readMinutes: 7,
      image: 'images/blog/local-food.svg',
      excerpt: 'Discover the rich culinary tapestry of our historic city, from fragrant slow-cooked biryanis and clay-oven kebabs to refined street delicacies and artisan desserts.',
      content: `
        <p>Our capital city is globally celebrated as an unrivaled culinary crossroad. Century-old recipes handed down through generations of imperial royal chefs converge with contemporary gastronomy. For discerning epicures, every alley and dining room tells a story through aroma, spice, and craft.</p>

        <h2>1. The Art of Galouti &amp; Kakori Kebabs</h2>
        <p>Originally perfected for royalty who demanded meltingly tender meats, these kebabs are infused with over twenty-five proprietary ground spices, rose water, and raw papaya. Seared over copper griddles, they melt upon contact with the palate.</p>

        <h2>2. Heritage Dum Biryani</h2>
        <p>Slow-cooked in sealed earthen handis over fragrant charcoal embers, layers of aged basmati rice, tender spiced cuts, saffron milk, and caramelized shallots harmonize to create an aromatic masterpiece. Savor our signature recipe prepared daily at GrandVista Restaurant.</p>

        <blockquote>"Food in our city is poetry written with saffron, cardamom, and patience. True luxury lies in honoring ancestral culinary heritage."</blockquote>

        <h2>3. Saffron-Infused Shahi Tukda &amp; Artisan Kulfi</h2>
        <p>Conclude your culinary explorations with quintessential royal desserts. Golden fried brioche steeped in cardamom syrup and blanketed in thick clotted rabri and pistachios, followed by churned malai kulfi, provides an unforgettable finale to your meal.</p>
      `,
      relatedService: {
        title: 'Reserve a Fine Dining Experience',
        desc: 'Experience royal culinary heritage firsthand at GrandVista Restaurant & Lounges.',
        link: 'dining.html',
        linkText: 'View Dining & Menus'
      }
    },
    {
      id: 4,
      slug: 'business-travel-guide',
      title: 'Business Travel Guide: Efficiency & Comfort in the Capital',
      category: 'Business Travel',
      categorySlug: 'business-travel',
      author: 'Aria Montgomery, Corporate Affairs',
      publishedDate: 'September 15, 2026',
      readMinutes: 5,
      image: 'images/blog/business-travel.svg',
      excerpt: 'Essential tips for high-performing executives navigating business trips, executive workstations, airport expressways, and hosting corporate dinners.',
      content: `
        <p>Modern corporate travel demands seamless productivity without sacrificing well-being. When high-stakes board meetings, diplomatic summits, and contract negotiations are on your schedule, having an intuitive home base equipped with enterprise technology and dedicated concierge support makes all the difference.</p>

        <h2>Executive Accommodations with Ergonomic Workstations</h2>
        <p>GrandVista's Executive Suites feature dedicated work salons with high-speed fiber-optic Wi-Fi, multi-country universal charging hubs, ergonomic Herman Miller leather seating, and soundproof double-glazed acoustic windows. Conduct international videoconferences with total clarity and zero ambient disruption.</p>

        <h2>Effortless Transit &amp; Strategic Positioning</h2>
        <p>Located only 14.5 kilometers from Indira Gandhi International Airport and 4.0 kilometers from the Central Business District, executives avoid peak-hour gridlock. Pre-book hotel chauffeured transfers for smooth door-to-door transit equipped with chilled water and daily international financial broadsheets.</p>

        <blockquote>"A successful business journey is defined by zero friction. Our executive services are engineered to anticipate every executive need before it arises."</blockquote>

        <h2>Hosting Clients: Private Dining &amp; Conference Facilities</h2>
        <p>For executive meetings and client entertainment, GrandVista offers private dining salons in GrandVista Restaurant as well as our state-of-the-art Conference Hall, fully outfitted with 4K laser projection and dedicated technical support.</p>
      `,
      relatedService: {
        title: 'Executive Suites & Business Rates',
        desc: 'Book our Executive Suite with lounge access, high-speed Wi-Fi, and pressing services.',
        link: 'rooms.html',
        linkText: 'View Executive Suites'
      }
    },
    {
      id: 5,
      slug: 'family-attractions-nearby',
      title: 'Family Attractions Nearby: Creating Timeless Memories',
      category: 'Family Travel',
      categorySlug: 'family-travel',
      author: 'Elena Rostova, Guest Experience',
      publishedDate: 'September 10, 2026',
      readMinutes: 6,
      image: 'images/blog/family-attractions.svg',
      excerpt: 'A curated parent’s guide to enriching, kid-friendly adventures near GrandVista—from science centers and botanical conservatories to interactive puppet theatres.',
      content: `
        <p>Traveling with children and multi-generational family parties is an enriching adventure when balanced with thoughtfully curated activities and spacious accommodations. The neighborhood surrounding GrandVista Hotel offers a treasure trove of engaging attractions that ignite children's curiosity while keeping parents completely relaxed.</p>

        <h2>1. National Science Center &amp; Planetarium</h2>
        <p>Located just eight minutes from the hotel, this world-class science museum features interactive robotics galleries, ancient prehistoric exhibits, and a 360-degree digital planetarium dome. Children of all ages can participate in hands-on physics demonstrations and space exploration workshops.</p>

        <h2>2. Royal Botanical Gardens &amp; Butterfly Conservatory</h2>
        <p>A lush outdoor haven where young explorers can spot exotic butterflies, feed resident koi fish in stone ponds, and run freely through shaded picnic lawns. The hotel concierge can prepare a gourmet family picnic basket with fresh fruit, sandwiches, and chilled juices.</p>

        <blockquote>"Family vacations shouldn't require compromise. When children are delighted and parents are pampered, true magic happens."</blockquote>

        <h2>3. Traditional Puppet Shows at Crafts Museum</h2>
        <p>Introduce your children to authentic folk puppetry and clay toy making at the nearby National Crafts Village. Children can watch master artisans weave colorful textiles, shape clay pots on traditional wheels, and take home handcrafted wooden toys.</p>
      `,
      relatedService: {
        title: 'Spacious Family Rooms',
        desc: 'Our Family Room features twin plush queen beds, interconnecting options, and child amenities.',
        link: 'rooms.html',
        linkText: 'Explore Family Rooms'
      }
    },
    {
      id: 6,
      slug: 'hotel-guide-restful-stays',
      title: 'The Art of Restful Stays: An Insider’s Hotel Guide',
      category: 'Hotel Guide',
      categorySlug: 'hotel-guide',
      author: 'GrandVista Editorial Team',
      publishedDate: 'September 05, 2026',
      readMinutes: 4,
      image: 'images/blog/hotel-guide.svg',
      excerpt: 'Explore the bespoke wellness rituals, artisan pillow menus, and acoustic architecture that make a night at GrandVista deeply rejuvenating.',
      content: `
        <p>In a world of constant motion and digital demands, the ultimate luxury is deep, undisturbed, restorative sleep. At GrandVista Hotel, rest is an intentional discipline—engineered through acoustic mastery, organic botanicals, and bespoke bedtime amenities.</p>

        <h2>The Bespoke Pillow Menu &amp; 800-Thread-Count Linens</h2>
        <p>Every GrandVista suite is outfitted with custom plush pillowtop mattresses crafted exclusively for our property. Guests can select from our complimentary pillow menu: lavender-infused down, contouring memory foam, hypoallergenic buckwheat, or cooling silk gel pillows.</p>

        <h2>Evening Aromatherapy Turndown Ritual</h2>
        <p>Each evening between 6:00 PM and 8:00 PM, housekeeping performs our signature turndown ritual. Blackout velvet drapery is drawn, soft jazz or ambient chimes fill the room, and essential oils of French lavender and chamomile are gently diffused.</p>

        <blockquote>"Hospitality is more than shelter; it is the craft of sending guests back into the world lighter, restored, and deeply centered."</blockquote>

        <h2>Hydrotherapy &amp; Evening Soaking Tubs</h2>
        <p>End your night in an Italian marble soaking bathtub with artisan bath salts harvested from the Himalayas. Pair your soak with a pot of organic caffeine-free chamomile herbal infusion delivered by 24-hour room service.</p>
      `,
      relatedService: {
        title: 'Spa & Wellness Sanctuary',
        desc: 'Complement your restful stay with therapeutic treatments at our Ayurvedic day spa.',
        link: 'amenities.html',
        linkText: 'Discover Hotel Amenities'
      }
    }
  ];

  // Expose on window for easy access
  window.GrandVistaBlog = {
    getAll: () => blogArticles,
    getBySlug: (slug) => blogArticles.find((a) => a.slug === slug),
    getByCategory: (cat) => {
      if (!cat || cat === 'all') return blogArticles;
      return blogArticles.filter((a) => a.categorySlug === cat || a.category.toLowerCase() === cat.toLowerCase());
    },
    getRelated: (currentSlug, count = 3) => {
      const current = blogArticles.find((a) => a.slug === currentSlug);
      const others = blogArticles.filter((a) => a.slug !== currentSlug);
      if (!current) return others.slice(0, count);
      // Prioritize same category
      const sameCategory = others.filter((a) => a.categorySlug === current.categorySlug);
      const diffCategory = others.filter((a) => a.categorySlug !== current.categorySlug);
      return [...sameCategory, ...diffCategory].slice(0, count);
    }
  };

  /**
   * Render blog listing page (blog.html)
   */
  function initBlogListing() {
    const container = document.getElementById('blog-container');
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    if (!container) return;

    let activeCategory = 'all';

    // Read URL param or hash if set
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category') || window.location.hash.replace('#', '');
    if (catParam) {
      activeCategory = catParam.toLowerCase();
    }

    function renderCards() {
      const articles = window.GrandVistaBlog.getByCategory(activeCategory);
      if (articles.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
            <p style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-primary);">No Articles Found in this Category</p>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">Please select "All Articles" to browse our complete collection of travel stories.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = articles
        .map(
          (art) => `
          <article class="blog-card" data-category="${art.categorySlug}">
            <div class="blog-card__image-wrap">
              <a href="blog-details.html?slug=${art.slug}" aria-label="Read ${escapeHTML(art.title)}">
                <img src="${art.image}" alt="${escapeHTML(art.title)}" loading="lazy" />
              </a>
              <span class="blog-card__category-tag">${art.category}</span>
            </div>
            <div class="blog-card__content">
              <div class="blog-card__meta">
                <span>🗓️ ${art.publishedDate}</span>
                <span>&bull;</span>
                <span>⏱️ ${art.readMinutes} min read</span>
              </div>
              <h2 class="blog-card__title">
                <a href="blog-details.html?slug=${art.slug}">${escapeHTML(art.title)}</a>
              </h2>
              <p class="blog-card__excerpt">${escapeHTML(art.excerpt)}</p>
              <div class="blog-card__footer">
                <span style="font-size: 0.8rem; color: var(--color-text-muted);">${escapeHTML(art.author)}</span>
                <a href="blog-details.html?slug=${art.slug}" class="blog-card__read-link">
                  Read Article &rarr;
                </a>
              </div>
            </div>
          </article>
        `
        )
        .join('');
    }

    // Set active button and click handler
    filterButtons.forEach((btn) => {
      const btnCat = btn.getAttribute('data-category');
      const isActive = btnCat === activeCategory || (activeCategory === '' && btnCat === 'all');
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));

      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-category');
        filterButtons.forEach((b) => {
          const isCurr = b === btn;
          b.classList.toggle('is-active', isCurr);
          b.setAttribute('aria-pressed', String(isCurr));
        });
        renderCards();
      });
    });

    renderCards();
  }

  /**
   * Render blog details page (blog-details.html?slug=...)
   */
  function initBlogDetails() {
    const detailsContainer = document.getElementById('blog-details-view');
    if (!detailsContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug') || '';
    const article = window.GrandVistaBlog.getBySlug(slug);

    if (!article) {
      document.title = 'Article Not Found — GrandVista Journal';
      detailsContainer.innerHTML = `
        <div style="text-align: center; padding: var(--space-4xl) var(--space-md); max-width: 650px; margin: 0 auto;">
          <span style="font-size: 3rem;">📖</span>
          <h1 style="font-family: var(--font-serif); font-size: 2.2rem; color: var(--color-primary); margin: var(--space-sm) 0;">Article Not Found</h1>
          <p style="color: var(--color-text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: var(--space-xl);">
            The travel journal entry you are looking for does not exist or may have been moved.
          </p>
          <a href="blog.html" class="btn btn--primary">&larr; Return to All Articles</a>
        </div>
      `;
      return;
    }

    // Update document title and meta description
    document.title = `${article.title} — GrandVista Journal`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', article.excerpt);

    // Update breadcrumb
    const breadcrumbTitle = document.getElementById('article-breadcrumb-title');
    if (breadcrumbTitle) breadcrumbTitle.textContent = article.title;

    // Get 3 related articles
    const related = window.GrandVistaBlog.getRelated(article.slug, 3);
    const relatedHtml = related
      .map(
        (r) => `
        <article class="blog-card">
          <div class="blog-card__image-wrap">
            <a href="blog-details.html?slug=${r.slug}">
              <img src="${r.image}" alt="${escapeHTML(r.title)}" loading="lazy" />
            </a>
            <span class="blog-card__category-tag">${r.category}</span>
          </div>
          <div class="blog-card__content">
            <div class="blog-card__meta">
              <span>🗓️ ${r.publishedDate}</span>
              <span>&bull;</span>
              <span>⏱️ ${r.readMinutes} min read</span>
            </div>
            <h3 class="blog-card__title">
              <a href="blog-details.html?slug=${r.slug}">${escapeHTML(r.title)}</a>
            </h3>
            <p class="blog-card__excerpt">${escapeHTML(r.excerpt)}</p>
            <div class="blog-card__footer">
              <a href="blog-details.html?slug=${r.slug}" class="blog-card__read-link">Read Story &rarr;</a>
            </div>
          </div>
        </article>
      `
      )
      .join('');

    detailsContainer.innerHTML = `
      <article>
        <header class="article-header">
          <div style="display: flex; gap: var(--space-sm); align-items: center; justify-content: center; margin-bottom: var(--space-xs);">
            <span class="room-card__view-tag" style="font-size: 0.8rem;">${article.category}</span>
            <span style="font-size: 0.85rem; color: var(--color-text-muted);">⏱️ ${article.readMinutes} min read</span>
          </div>
          <h1 style="font-family: var(--font-serif); font-size: clamp(2rem, 4vw, 2.85rem); color: var(--color-primary); line-height: 1.25; margin-bottom: var(--space-md);">
            ${escapeHTML(article.title)}
          </h1>
          <div style="font-size: 0.9rem; color: var(--color-text-muted); display: flex; gap: var(--space-md); justify-content: center; align-items: center; flex-wrap: wrap;">
            <span>By <strong>${escapeHTML(article.author)}</strong></span>
            <span>&bull;</span>
            <span>Published ${article.publishedDate}</span>
          </div>
        </header>

        <img src="${article.image}" alt="${escapeHTML(article.title)}" class="article-hero-image" />

        <div class="article-body-content">
          ${article.content}
        </div>

        <!-- Related Hotel Service Callout Card -->
        ${
          article.relatedService
            ? `
          <div style="max-width: 780px; margin: var(--space-3xl) auto 0; background: var(--color-bg-card); border: 1px solid var(--color-border-gold); border-radius: var(--radius-md); padding: var(--space-xl); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-md);">
            <div>
              <span class="section-eyebrow" style="margin-bottom: 2px;">Experience This At GrandVista</span>
              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-primary); margin: 0 0 4px 0;">
                ${escapeHTML(article.relatedService.title)}
              </h3>
              <p style="font-size: 0.875rem; color: var(--color-text-muted); margin: 0; max-width: 480px;">
                ${escapeHTML(article.relatedService.desc)}
              </p>
            </div>
            <a href="${article.relatedService.link}" class="btn btn--primary btn--sm">
              ${escapeHTML(article.relatedService.linkText)} &rarr;
            </a>
          </div>
        `
            : ''
        }

        <!-- Related Articles Section -->
        <div style="margin-top: var(--space-4xl); border-top: 1px solid var(--color-border); padding-top: var(--space-3xl);">
          <div class="section-header" style="text-align: left; margin-bottom: var(--space-xl);">
            <span class="section-eyebrow">Continue Reading</span>
            <h2 class="section-title" style="font-size: 1.85rem;">Related Stories &amp; Guides</h2>
          </div>
          <div class="blog-grid">
            ${relatedHtml}
          </div>
        </div>
      </article>
    `;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initBlogListing();
    initBlogDetails();
  });
})();
