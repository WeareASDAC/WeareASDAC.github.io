// --- DOM Elements ---
const navbar = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
const subscribeForm = document.getElementById('subscribe-form');
const formMessageContainer = document.getElementById('form-message');
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

// --- Copyright Year ---
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Calculate position considering potential fixed header height
            const headerOffset = navbar.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open after clicking a link
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
});

// --- Mobile Menu Toggle ---
hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
});

// Close mobile menu when clicking a link inside it
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
});

// Close mobile menu if clicking outside of it
document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !hamburgerBtn.contains(event.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
});


// --- Intersection Observer for Animations ---
const animateOnScroll = (elements, animationClass = 'fade-in', threshold = 0.1, rootMargin = '0px 0px -100px 0px') => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: threshold,
        rootMargin: rootMargin
    });

    elements.forEach(el => {
        // Initialize styles for animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)'; // Start slightly lower
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
};

// Apply animations with staggered delays
const sectionsToAnimate = document.querySelectorAll('section > .container > *, section > *:not(.container)'); // Select direct children or elements within containers
const cardsToAnimate = document.querySelectorAll('.feature-card, .team-member, .client-card, .testimonial-card');

// Apply basic fade-in to sections/titles
animateOnScroll(document.querySelectorAll('.section-title, .about-text, .team-intro, .app-preview > p, .device-mockup'));

// Apply fade-in with stagger to cards
cardsToAnimate.forEach((card, index) => {
     card.style.transitionDelay = `${index * 0.1}s`; // Add stagger
});
animateOnScroll(cardsToAnimate);


// --- Subscribe Form Handling ---
subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim(); // Trim whitespace
    const submitButton = this.querySelector('button[type="submit"]');

    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
         displayFormMessage('Please enter a valid email address.', 'error');
         emailInput.focus();
         return;
    }

    // Simulate form submission (replace with actual API call)
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    displayFormMessage('Submitting your request...', 'loading'); // Indicate loading


    // --- SIMULATED API CALL ---
    setTimeout(() => {
        // Simulate success
        const success = Math.random() > 0.1; // 90% success rate for demo

        if (success) {
            displayFormMessage(`
                <p>
                    <span class="icon">✓</span>
                    Thank you! <strong>${email}</strong> is on the waitlist. We'll notify you at launch!
                </p>`,
                'success'
            );
            this.reset(); // Clear the form on success
        } else {
            // Simulate error
             displayFormMessage('Oops! Something went wrong. Please try again later.', 'error');
        }

        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'Join Waitlist';

    }, 1500); // Simulate network delay
});

// Function to display messages in the form container
function displayFormMessage(message, type = 'info') {
     formMessageContainer.innerHTML = `<div class="form-message ${type}">${message}</div>`;
     formMessageContainer.style.marginTop = '1rem'; // Add space

    // Optional: Auto-clear message after some time (except for loading)
     if (type !== 'loading') {
         setTimeout(() => {
            if (formMessageContainer.firstChild && formMessageContainer.firstChild.textContent.includes(message.substring(0, 50))) { // Basic check if message is still the same
                 formMessageContainer.innerHTML = '';
                 formMessageContainer.style.marginTop = '0';
            }
         }, 6000); // Clear after 6 seconds
     }
}

// --- Custom Cursor Movement (Desktop Only) ---
if (window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener('mousemove', e => {
        if (cursor) cursor.style.left = e.clientX + 'px';
        if (cursor) cursor.style.top = e.clientY + 'px';
        if (cursorDot) cursorDot.style.left = e.clientX + 'px';
        if (cursorDot) cursorDot.style.top = e.clientY + 'px';
    });

    // Add hover effects for cursor
    document.querySelectorAll('a, button, .feature-card, .client-card, .team-member').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            if(cursor) cursor.style.background = 'var(--accent)';
            if(cursor) cursor.style.opacity = '0.3';
        });
        el.addEventListener('mouseleave', () => {
            if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            if(cursor) cursor.style.background = 'transparent';
            if(cursor) cursor.style.opacity = '1';
        });
    });
} 