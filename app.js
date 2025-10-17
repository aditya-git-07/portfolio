// Global variables
let isLoading = true;
const typingTexts = [
    'Full Stack Developer',
    'UI/UX Designer', 
    'Problem Solver',
    'Tech Enthusiast',
    'Creative Thinker'
];
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

// DOM elements
const loadingScreen = document.getElementById('loadingScreen');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const typingElement = document.querySelector('.typing-text');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
const particles = document.getElementById('particles');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    setupEventListeners();
    createParticles();
    setupScrollAnimations();
    startTypingAnimation();
    setupCustomCursor();
    setupTheme();
    animateSkillBars();
    animateCounters();
}

// Hide loading screen
function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    isLoading = false;
    document.body.style.overflow = 'visible';
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation toggle
    navToggle.addEventListener('click', toggleNavigation);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Contact form
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            toggleNavigation();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
}

// Toggle mobile navigation
function toggleNavigation() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'visible';
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save theme preference in memory
    window.currentTheme = newTheme;
    
    // Add animation class
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
}

// Setup initial theme
function setupTheme() {
    let savedTheme;
    
    // Try to get saved theme from memory
    savedTheme = window.currentTheme;
    
    // Use saved theme or system preference
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!document.documentElement.getAttribute('data-theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Handle smooth scrolling
function handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            toggleNavigation();
        }
        
        // Update active nav link
        updateActiveNavLink(targetId);
    }
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

// Create floating particles
function createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 4 + 4;
        const delay = Math.random() * 2;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        particles.appendChild(particle);
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars when skills section is visible
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                // Animate counters when about section is visible
                if (entry.target.id === 'about') {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Observe individual elements
    document.querySelectorAll('.skill-item, .creative-skill, .project-card').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Typing animation
function startTypingAnimation() {
    if (!typingElement) return;
    
    function type() {
        const currentText = typingTexts[currentTextIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentCharIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
            typeSpeed = 500; // Pause before starting new text
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// Animate skill bars
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const skillLevel = item.getAttribute('data-skill');
        const progressBar = item.querySelector('.skill-progress');
        
        if (progressBar && !progressBar.style.width) {
            setTimeout(() => {
                progressBar.style.width = skillLevel + '%';
            }, 300);
        }
    });
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        if (counter.classList.contains('animated')) return;
        
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                counter.classList.add('animated');
            }
        };
        
        updateCounter();
    });
}

// Custom cursor
function setupCustomCursor() {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorOutline.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    document.querySelectorAll('a, button, .btn, .project-card, .skill-item').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
        });
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const formData = new FormData(e.target);
    
    // Validate form
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject').trim();
    const message = formData.get('message').trim();
    
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Reset form
        e.target.reset();
        
        // Show success modal
        showSuccessModal();
        
        // Reset form labels
        setTimeout(() => {
            document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                input.blur();
            });
        }, 100);
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success modal
function showSuccessModal() {
    successModal.classList.add('show');
}

// Close modal
function closeModal() {
    successModal.classList.remove('show');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: var(--bg-glass);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        color: var(--text-primary);
        font-weight: 500;
        backdrop-filter: blur(20px);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'error') {
        notification.style.borderColor = 'var(--error-500)';
        notification.style.background = 'rgba(239, 68, 68, 0.1)';
    } else if (type === 'success') {
        notification.style.borderColor = 'var(--success-500)';
        notification.style.background = 'rgba(34, 197, 94, 0.1)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    // Close modal with Escape
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        closeModal();
    }
    
    // Close mobile menu with Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleNavigation();
    }
}

// Handle window resize
function handleWindowResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleNavigation();
    }
    
    // Recreate particles on significant resize
    if (Math.abs(window.innerWidth - window.lastWidth) > 200) {
        particles.innerHTML = '';
        createParticles();
        window.lastWidth = window.innerWidth;
    }
}

// Store initial width
window.lastWidth = window.innerWidth;

// Prevent default touch behaviors on iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }, { passive: false });
}

// Add loading class to body initially
document.body.classList.add('loading');

// Remove loading class when everything is ready
window.addEventListener('load', function() {
    document.body.classList.remove('loading');
});

// Performance optimization: Throttle scroll events
let scrollTimeout;
function throttleScroll() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            handleNavbarScroll();
            scrollTimeout = null;
        }, 16); // ~60fps
    }
}

window.addEventListener('scroll', throttleScroll, { passive: true });

// Preload images and fonts
function preloadAssets() {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);
    
    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);
}

// Initialize asset preloading
preloadAssets();

// Add smooth reveal animation for elements
function addRevealAnimation() {
    const revealElements = document.querySelectorAll('.about-card, .skills-category, .project-card, .contact-card');
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        revealObserver.observe(element);
    });
}

// Initialize reveal animations after DOM is loaded
document.addEventListener('DOMContentLoaded', addRevealAnimation);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});