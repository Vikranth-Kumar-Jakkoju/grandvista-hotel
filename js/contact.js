/**
 * GrandVista Hotel — Contact Form Validation & Feedback
 * File: js/contact.js
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const alertBox = document.getElementById('contact-alert');

    if (!contactForm || !alertBox) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const phoneInput = document.getElementById('contact-phone');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Validate required fields
      if (!nameVal) {
        showError('Please enter your full name.', nameInput);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showError('Please provide a valid email address (e.g. name@example.com).', emailInput);
        return;
      }

      if (!subjectVal) {
        showError('Please select or specify the subject of your inquiry.', subjectInput);
        return;
      }

      if (!messageVal || messageVal.length < 10) {
        showError('Please enter a message of at least 10 characters so we may assist you.', messageInput);
        return;
      }

      // Success State Simulation
      alertBox.textContent = `✓ Thank you, ${nameVal}! Your message regarding "${subjectVal}" has been sent to our concierge desk. We will respond to ${emailVal} within 4 business hours.`;
      alertBox.className = 'booking-alert is-success';
      alertBox.style.display = 'flex';

      contactForm.reset();

      // Clear alert after 10s
      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 10000);
    });

    function showError(msg, inputEl) {
      alertBox.textContent = msg;
      alertBox.className = 'booking-alert is-error';
      alertBox.style.display = 'flex';
      if (inputEl) inputEl.focus();
    }
  });
})();
