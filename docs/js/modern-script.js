// ===================================
// Modern Portfolio - Interactive Scripts
// ===================================

(function() {
    'use strict';

    // ===================================
    // Smooth Scroll for Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===================================
    // Intersection Observer for Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('.about-section, .stats-section, .social-section, .contact-section, .media-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // ===================================
    // Stats Counter Animation
    // ===================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.dataset.suffix || '');
            }
        }, 16);
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const number = entry.target.querySelector('.stat-number');
                const text = number.textContent;
                const value = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                number.dataset.suffix = suffix;
                number.textContent = '0';
                
                setTimeout(() => {
                    animateCounter(number, value);
                }, 200);
                
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===================================
    // Navigation Cards Parallax Effect
    // ===================================
    let lastScrollTop = 0;
    const navCards = document.querySelector('.nav-cards');
    
    // Navigation cards check
    if (!navCards) return;

    // Only apply parallax effect on desktop
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                navCards.style.transform = 'translateY(-10px)';
                navCards.style.opacity = '0.9';
            } else {
                // Scrolling up
                navCards.style.transform = 'translateY(0)';
                navCards.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });
    }

    // ===================================
    // Add hover effect to social links
    // ===================================
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });


    // ===================================
    // Page Load Animation
    // ===================================
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        
        // Stagger animation for content
        const elements = document.querySelectorAll('.brand, .about-section, .stats-section, .social-section, .contact-section, .media-section');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });


    // ===================================
    // Hamburger Menu Toggle
    // ===================================
    const hamburger = document.querySelector('.hamburger');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    if (hamburger && navCards) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navCards.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-card');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navCards.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navCards.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ===================================
    // Video Carousel (show/hide approach)
    // ===================================
    const carousel = document.querySelector('.video-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.closest('.media-embed-card').querySelector('.carousel-dots');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.style.cssText = 'width: 12px; height: 12px; border-radius: 50%; background: #2a2a2a; border: none; cursor: pointer; transition: all 0.3s ease;';
            if (index === 0) {
                dot.classList.add('active');
                dot.style.background = '#00d4ff';
            }
            dot.setAttribute('aria-label', `Go to video ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        
        function updateCarousel() {
            // Show/hide slides
            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    slide.style.display = 'block';
                    slide.classList.add('active');
                } else {
                    slide.style.display = 'none';
                    slide.classList.remove('active');
                }
            });
            
            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                    dot.style.background = '#00d4ff';
                } else {
                    dot.classList.remove('active');
                    dot.style.background = '#2a2a2a';
                }
            });
            
            // Update button opacity
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.3' : '1';
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Initialize
        updateCarousel();
    }

    // ===================================
    // Initialize
    // ===================================
    document.body.style.transition = 'opacity 0.3s ease-in-out';

})();
