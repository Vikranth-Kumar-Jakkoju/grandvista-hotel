/**
 * GrandVista Hotel — Wishlist State & UI Integration
 * File: js/wishlist.js
 * 
 * Features:
 * 1. Persistent localStorage storage for saved rooms
 * 2. Injects / updates "Wishlist (count)" badge into desktop and mobile navigation
 * 3. Provides global helper window.GrandVistaWishlist for toggling room slugs
 * 4. Listens for custom 'wishlist:updated' events to synchronize states in real time
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'grandvista_wishlist';

  const Wishlist = {
    /**
     * Get array of saved room slugs from localStorage
     */
    getAll() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.warn('Could not read wishlist from localStorage:', e);
        return [];
      }
    },

    /**
     * Check if a room slug is in the wishlist
     */
    has(slug) {
      if (!slug) return false;
      const list = this.getAll();
      return list.includes(slug.toLowerCase());
    },

    /**
     * Toggle a room slug in the wishlist (add if missing, remove if present)
     */
    toggle(slug) {
      if (!slug) return false;
      const cleanSlug = slug.toLowerCase();
      let list = this.getAll();
      let isNowSaved = false;

      if (list.includes(cleanSlug)) {
        list = list.filter((s) => s !== cleanSlug);
        isNowSaved = false;
      } else {
        list.push(cleanSlug);
        isNowSaved = true;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Could not save wishlist to localStorage:', e);
      }

      this.updateNavBadge();
      window.dispatchEvent(
        new CustomEvent('wishlist:updated', { detail: { slug: cleanSlug, isSaved: isNowSaved } })
      );

      return isNowSaved;
    },

    /**
     * Remove a room slug from wishlist
     */
    remove(slug) {
      if (!slug) return;
      const cleanSlug = slug.toLowerCase();
      let list = this.getAll().filter((s) => s !== cleanSlug);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Could not update wishlist in localStorage:', e);
      }

      this.updateNavBadge();
      window.dispatchEvent(
        new CustomEvent('wishlist:updated', { detail: { slug: cleanSlug, isSaved: false } })
      );
    },

    /**
     * Get count of saved rooms
     */
    getCount() {
      return this.getAll().length;
    },

    /**
     * Update or inject the Wishlist navigation item and count badge
     */
    updateNavBadge() {
      const count = this.getCount();
      const badgeElements = document.querySelectorAll('.wishlist-count-badge');
      badgeElements.forEach((el) => {
        el.textContent = count;
      });

      // Inject into desktop nav if not already present
      const desktopNavList = document.querySelector('.nav-list');
      if (desktopNavList && !document.getElementById('nav-item-wishlist')) {
        const li = document.createElement('li');
        li.id = 'nav-item-wishlist';
        const isCurrentPage = window.location.pathname.endsWith('wishlist.html');
        li.innerHTML = `
          <a href="wishlist.html" class="nav-link nav-wishlist-link ${isCurrentPage ? 'active' : ''}" aria-label="View saved rooms wishlist">
            Wishlist <span class="wishlist-count-badge">${count}</span>
          </a>
        `;
        desktopNavList.appendChild(li);
      }

      // Inject into mobile drawer if not already present
      const mobileNavList = document.querySelector('.mobile-nav-list');
      if (mobileNavList && !document.getElementById('mobile-nav-item-wishlist')) {
        const li = document.createElement('li');
        li.id = 'mobile-nav-item-wishlist';
        const isCurrentPage = window.location.pathname.endsWith('wishlist.html');
        li.innerHTML = `
          <a href="wishlist.html" class="mobile-nav-link ${isCurrentPage ? 'active' : ''}">
            ❤️ Saved Wishlist (${count})
          </a>
        `;
        mobileNavList.appendChild(li);
      }
    },

    /**
     * Generate HTML for heart button on any room card
     */
    renderHeartButton(slug, extraClass = '') {
      const isSaved = this.has(slug);
      return `
        <button 
          type="button" 
          class="wishlist-toggle-btn ${isSaved ? 'is-saved' : ''} ${extraClass}" 
          data-wishlist-slug="${slug}" 
          aria-label="${isSaved ? 'Remove from wishlist' : 'Save to wishlist'}"
          title="${isSaved ? 'Remove from wishlist' : 'Save to wishlist'}"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? '#e11d48' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      `;
    },

    /**
     * Initialize click delegation for wishlist buttons
     */
    initListeners() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-wishlist-slug]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();

        const slug = btn.dataset.wishlistSlug;
        const isNowSaved = Wishlist.toggle(slug);

        // Update all buttons with this slug
        document.querySelectorAll(`[data-wishlist-slug="${slug}"]`).forEach((b) => {
          b.classList.toggle('is-saved', isNowSaved);
          b.setAttribute('aria-label', isNowSaved ? 'Remove from wishlist' : 'Save to wishlist');
          b.setAttribute('title', isNowSaved ? 'Remove from wishlist' : 'Save to wishlist');
          const svg = b.querySelector('svg');
          if (svg) svg.setAttribute('fill', isNowSaved ? '#e11d48' : 'none');
        });
      });
    },
  };

  // Expose globally
  window.GrandVistaWishlist = Wishlist;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      Wishlist.updateNavBadge();
      Wishlist.initListeners();
    });
  } else {
    Wishlist.updateNavBadge();
    Wishlist.initListeners();
  }
})();
