/* 
 * =============================================================================
 * PROJECT: Flower of the Valleys — Student Blog
 * FILE: scripts.js
 * AUTHOR: Mark Gabriel Susim
 * DESCRIPTION: Handles interactive elements like theme switching, mobile 
 *              navigation, scroll reveal animations, and reading progress.
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Fire up all the UI enhancements
    initTheme();          // Light/Dark mode toggle
    initProgressBar();    // Top reading progress bar
    initScrollTop();      // "Back to top" button logic
    initMobileNav();      // Hamburger menu for mobile/tablet
    initScrollReveal();   // Staggered reveal animations on scroll
    initMagneticButtons();// Subtle hover effect for interactive elements
    initContactForm();    // Form validation for contact.html
    initGallery();        // Filter and Lightbox for gallery.html
});

/**
 * THEME TOGGLE
 * Handles the logic for Light/Dark mode and persists choice in localStorage.
 */
function initTheme() {
    const navInner = document.querySelector('.nav-inner');
    if (!navInner || document.querySelector('.theme-switch-wrapper')) return;

    // Create the toggle switch element dynamically to keep HTML clean
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-switch-wrapper';
    wrapper.innerHTML = `
        <i class="fas fa-sun"></i>
        <label class="theme-switch" for="checkbox">
            <input type="checkbox" id="checkbox" />
            <div class="slider round"></div>
        </label>
        <i class="fas fa-moon"></i>
    `;
    navInner.appendChild(wrapper);

    const checkbox = document.querySelector('#checkbox');
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') checkbox.checked = true;

    checkbox.addEventListener('change', (e) => {
        const targetTheme = e.target.checked ? 'dark' : 'light';
        setTheme(targetTheme);
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

/**
 * MAGNETIC BUTTONS
 * Adds a small "pull" effect to buttons when the mouse is nearby.
 * Feels premium and increases interactivity.
 */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .theme-switch, .nav-links a');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the button slightly towards the cursor (30% intensity)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            // Snap back to original position
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}

/**
 * READING PROGRESS BAR
 * Shows a thin green line at the top of the viewport indicating scroll depth.
 */
function initProgressBar() {
    if (document.querySelector('.progress-container')) return;

    const container = document.createElement('div');
    container.className = 'progress-container';
    container.innerHTML = '<div class="progress-bar" id="myBar"></div>';
    document.body.prepend(container);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            document.getElementById("myBar").style.width = scrolled + "%";
        }
    });
}

/**
 * SCROLL TO TOP
 * Displays a button when the user has scrolled down significantly.
 */
function initScrollTop() {
    if (document.querySelector('.scroll-top')) return;

    const btn = document.createElement('div');
    btn.className = 'scroll-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        // Show after 400px of scrolling
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * SCROLL REVEAL
 * Uses IntersectionObserver to animate elements as they enter the viewport.
 */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Slight delay based on index for a "staggered" appearance
                setTimeout(() => {
                    entry.target.classList.add('reveal-visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    // Target all main content blocks
    document.querySelectorAll('.card, section, .gallery-item, .sidebar-widget, .variety-card, .season-card').forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
}

/**
 * MOBILE NAVIGATION
 * Simple toggle logic for the hamburger menu.
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const icon = navToggle.querySelector('i');
            if (icon) {
                // Swap between bars and 'X' icon
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

/**
 * CONTACT FORM VALIDATION
 * Handles the contact form on contact.html
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMessage');
    if (!form) return;

    const showError = (id, msg) => {
        const el = document.getElementById(id + 'Error');
        if (el) el.textContent = msg;
        const input = document.getElementById(id);
        if (input) input.classList.add('invalid');
    };

    const clearError = (id) => {
        const el = document.getElementById(id + 'Error');
        if (el) el.textContent = '';
        const input = document.getElementById(id);
        if (input) input.classList.remove('invalid');
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    ['firstName', 'lastName', 'email', 'subject', 'message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => clearError(id));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        const agreed = document.getElementById('agreeTerms').checked;

        ['firstName', 'lastName', 'email', 'subject', 'message', 'terms'].forEach(clearError);

        if (!firstName) { showError('firstName', 'Please enter your first name.'); valid = false; }
        if (!lastName) { showError('lastName', 'Please enter your last name.'); valid = false; }
        if (!email || !validateEmail(email)) { showError('email', 'Please enter a valid email.'); valid = false; }
        if (!subject) { showError('subject', 'Please select a topic.'); valid = false; }
        if (!message || message.length < 20) { showError('message', 'Please write at least 20 chars.'); valid = false; }
        if (!agreed) { showError('terms', 'Please check the box.'); valid = false; }

        if (valid) {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

/**
 * GALLERY FILTER & LIGHTBOX
 * Handles filtering and full-screen view on gallery.html
 */
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const emptyState = document.getElementById('emptyState');
    const lightbox = document.getElementById('lightbox');
    if (!galleryItems.length || !lightbox) return;

    const lbImg = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lbCount = document.getElementById('lbCount');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');

    let activeItems = [];
    let currentIdx = 0;

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            let visibleCount = 0;
            galleryItems.forEach(item => {
                const show = filter === 'all' || item.dataset.cat === filter;
                item.classList.toggle('hidden', !show);
                if (show) visibleCount++;
            });
            if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        });
    });

    // Lightbox Logic
    const getVisible = () => [...document.querySelectorAll('.gallery-item:not(.hidden)')];
    
    const showSlide = (idx) => {
        const item = activeItems[idx];
        lbImg.src = item.dataset.src;
        lbImg.alt = item.dataset.title;
        lbCaption.textContent = item.dataset.caption;
        lbCount.textContent = `${idx + 1} / ${activeItems.length}`;
    };

    const openLightbox = (idx) => {
        activeItems = getVisible();
        currentIdx = idx;
        showSlide(currentIdx);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const visible = getVisible();
            openLightbox(visible.indexOf(item));
        });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    if (lbPrev) lbPrev.addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + activeItems.length) % activeItems.length;
        showSlide(currentIdx);
    });

    if (lbNext) lbNext.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % activeItems.length;
        showSlide(currentIdx);
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') { currentIdx = (currentIdx - 1 + activeItems.length) % activeItems.length; showSlide(currentIdx); }
        if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % activeItems.length; showSlide(currentIdx); }
    });
}