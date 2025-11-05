// ============================================
// Mobile Navigation Toggle
// ============================================
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !nav) return;

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });

  // Close menu when nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
})();

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
(function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Handle special cases like #book that should open modal
      if (href === '#book') {
        e.preventDefault();
        openModal();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();

// ============================================
// Booking Modal Management
// ============================================
const modal = document.getElementById('bookingModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const successClose = document.getElementById('successClose');
const heroBookBtn = document.getElementById('heroBookBtn');
const contactBookBtn = document.getElementById('contactBookBtn');

// Focusable elements for focus trap
let focusableElements = [];
let firstFocusable = null;
let lastFocusable = null;
let previouslyFocusedElement = null;

function updateFocusableElements() {
  focusableElements = modal.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  firstFocusable = focusableElements[0];
  lastFocusable = focusableElements[focusableElements.length - 1];
}

function openModal() {
  previouslyFocusedElement = document.activeElement;
  modal.removeAttribute('hidden');
  bookingForm.removeAttribute('hidden');
  bookingSuccess.setAttribute('hidden', '');
  document.body.style.overflow = 'hidden';
  updateFocusableElements();
  
  // Focus first input after brief delay for animation
  setTimeout(() => {
    const firstInput = bookingForm.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeModal() {
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  bookingForm.reset();
  clearFormErrors();
  
  // Restore focus to element that opened modal
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }
}

// Open modal event listeners
if (heroBookBtn) {
  heroBookBtn.addEventListener('click', openModal);
}
if (contactBookBtn) {
  contactBookBtn.addEventListener('click', openModal);
}

// Close modal event listeners
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}
if (modalOverlay) {
  modalOverlay.addEventListener('click', closeModal);
}
if (successClose) {
  successClose.addEventListener('click', closeModal);
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
    closeModal();
  }
});

// Focus trap inside modal
modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  if (e.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
});

// ============================================
// Form Validation & Submission
// ============================================
function clearFormErrors() {
  const inputs = bookingForm.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.classList.remove('error');
    const errorSpan = document.getElementById(`${input.id}Error`);
    if (errorSpan) errorSpan.textContent = '';
  });
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorSpan = document.getElementById(`${fieldId}Error`);
  
  if (field) field.classList.add('error');
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.setAttribute('role', 'alert');
  }
}

function validateForm() {
  clearFormErrors();
  let isValid = true;

  // Name validation
  const name = document.getElementById('name');
  if (!name.value.trim()) {
    showFieldError('name', 'Please enter your name');
    isValid = false;
  }

  // Phone validation
  const phone = document.getElementById('phone');
  const phonePattern = /^[0-9]{10,}$/;
  if (!phone.value.trim()) {
    showFieldError('phone', 'Please enter your phone number');
    isValid = false;
  } else if (!phonePattern.test(phone.value.replace(/\D/g, ''))) {
    showFieldError('phone', 'Please enter a valid 10-digit phone number');
    isValid = false;
  }

  // Email validation
  const email = document.getElementById('email');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showFieldError('email', 'Please enter your email');
    isValid = false;
  } else if (!emailPattern.test(email.value)) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  }

  // Service validation
  const service = document.getElementById('service');
  if (!service.value) {
    showFieldError('service', 'Please select a service');
    isValid = false;
  }

  // Date/time validation
  const datetime = document.getElementById('datetime');
  if (!datetime.value) {
    showFieldError('datetime', 'Please select a preferred date and time');
    isValid = false;
  }

  return isValid;
}

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus first error field
      const firstError = bookingForm.querySelector('.form-input.error');
      if (firstError) firstError.focus();
      return;
    }

    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      service: document.getElementById('service').value,
      datetime: document.getElementById('datetime').value,
      message: document.getElementById('message').value.trim()
    };

    // Format datetime for display
    const dateObj = new Date(formData.datetime);
    const formattedDate = dateObj.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Show success message
    showSuccess(formData, formattedDate);
  });
}

function showSuccess(formData, formattedDate) {
  // Hide form, show success
  bookingForm.setAttribute('hidden', '');
  bookingSuccess.removeAttribute('hidden');

  // Populate success details
  const successDetails = document.getElementById('successDetails');
  successDetails.innerHTML = `
    <p><strong>Name:</strong> ${escapeHtml(formData.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(formData.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(formData.email)}</p>
    <p><strong>Service:</strong> ${escapeHtml(formData.service)}</p>
    <p><strong>Preferred Date/Time:</strong> ${formattedDate}</p>
    ${formData.message ? `<p><strong>Message:</strong> ${escapeHtml(formData.message)}</p>` : ''}
  `;

  // Create mailto and sms links
  const emailSubject = encodeURIComponent('Booking Request - Slayed by Sia');
  const emailBody = encodeURIComponent(
    `New booking request:\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nService: ${formData.service}\nPreferred Date/Time: ${formattedDate}\n${formData.message ? `Message: ${formData.message}` : ''}`
  );
  const mailtoLink = `mailto:annahokyere72@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  const smsBody = encodeURIComponent(
    `Booking request from ${formData.name} for ${formData.service} on ${formattedDate}. Contact: ${formData.phone}, ${formData.email}`
  );
  const smsLink = `sms:6479157652?body=${smsBody}`;

  // Update links
  document.getElementById('emailLink').href = mailtoLink;
  document.getElementById('smsLink').href = smsLink;

  // Update focusable elements and focus success close button
  updateFocusableElements();
  setTimeout(() => {
    successClose.focus();
  }, 100);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// Reduced Motion Helper (Accessibility)
// ============================================
(function checkReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
  }
})();