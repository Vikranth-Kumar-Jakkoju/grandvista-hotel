/**
 * GrandVista Hotel — FAQ Accessible Accordion
 * File: js/faq.js
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-question-btn');
      const pane = item.querySelector('.faq-answer-pane');

      if (!btn || !pane) return;

      const toggle = () => {
        const isOpen = item.classList.contains('is-open');

        // Optional: close other items for accordion mode
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-open');
            const otherBtn = other.querySelector('.faq-question-btn');
            const otherPane = other.querySelector('.faq-answer-pane');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherPane) otherPane.setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle current item
        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
        pane.setAttribute('aria-hidden', String(isOpen));
      };

      btn.addEventListener('click', toggle);

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  });
})();
