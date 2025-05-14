document.addEventListener('DOMContentLoaded', function() {
    // 1. Current Year for Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Navbar Visibility & Mobile Menu
    const header = document.querySelector('header.fixed');
    const parallaxWrapper = document.querySelector('.parallax-wrapper'); // Assuming this is the main scroll container
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.getElementById('main-nav');
    
    let lastScrollY = 0;
    const navbarScrollThreshold = 10; // Show navbar if scrolled less than this from top

    if (header && (parallaxWrapper || window)) { // Ensure header exists and there's a scroll context
        if (parallaxWrapper) {
            lastScrollY = parallaxWrapper.scrollTop;
        } else {
            lastScrollY = window.scrollY;
            console.warn('.parallax-wrapper not found for scroll calculations. Using window.scrollY for navbar.');
        }

        function initializeNavbarState() {
            let currentInitialScroll = 0;
            if (parallaxWrapper) {
                currentInitialScroll = parallaxWrapper.scrollTop;
            } else {
                currentInitialScroll = window.scrollY;
            }

            if (currentInitialScroll <= navbarScrollThreshold) {
                header.classList.remove('navbar-hidden');
                header.classList.add('navbar-visible');
            } else {
                header.classList.add('navbar-hidden');
                header.classList.remove('navbar-visible');
            }
        }
        
        function handleNavbarState() {
            let currentScrollY = 0;
            if (parallaxWrapper) {
                currentScrollY = parallaxWrapper.scrollTop;
            } else {
                currentScrollY = window.scrollY;
            }
            
            const headerHeight = header.offsetHeight;

            if (currentScrollY > lastScrollY && currentScrollY > headerHeight) { // Scrolling down
                header.classList.add('navbar-hidden');
                header.classList.remove('navbar-visible');
                if (mainNav && !mainNav.classList.contains('hidden') && window.innerWidth < 768) {
                    mainNav.classList.add('hidden');
                    if (mobileMenuButton) {
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                    }
                }
            } else if (currentScrollY < lastScrollY || currentScrollY <= navbarScrollThreshold) { // Scrolling up or near top
                header.classList.remove('navbar-hidden');
                header.classList.add('navbar-visible');
            }
            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        }
        
        if (mobileMenuButton && mainNav) {
            mobileMenuButton.addEventListener('click', function() {
                mainNav.classList.toggle('hidden');
                const isExpanded = !mainNav.classList.contains('hidden');
                mobileMenuButton.setAttribute('aria-expanded', isExpanded.toString());
            });
        }

        // Attach scroll listener for navbar
        if (parallaxWrapper) {
            parallaxWrapper.addEventListener('scroll', handleNavbarState, { passive: true });
        } else {
            window.addEventListener('scroll', handleNavbarState, { passive: true });
        }
        
        initializeNavbarState(); // Set initial state
    }


    // 3. Parallax Effect (using data-parallax-speed)
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    if (parallaxBgs.length > 0 && parallaxWrapper) { // Ensure elements and scroll container exist
        let tickingParallax = false;
        
        function updateParallax() {
            parallaxBgs.forEach(bg => {
                if (bg.tagName.toLowerCase() === 'video') return; // Skip videos if they have their own handling or no parallax
                
                const section = bg.closest('.parallax-section');
                if (!section || !bg.dataset.parallaxSpeed) return; 
                
                const rect = section.getBoundingClientRect();
                // Check if the section is roughly in the viewport of the parallaxWrapper
                // This viewport check needs to be relative to the parallaxWrapper, not window, if parallaxWrapper is the scroller.
                // For simplicity, if parallaxWrapper is the main scroller, its clientHeight is the viewport height.
                // If window is the scroller, window.innerHeight is used.
                const viewportHeight = parallaxWrapper ? parallaxWrapper.clientHeight : window.innerHeight;

                if (rect.bottom > 0 && rect.top < viewportHeight) {
                    const speed = parseFloat(bg.dataset.parallaxSpeed);
                    const maxOffset = rect.height * 0.1; // Example max offset
                    // The yPos calculation might need adjustment based on whether rect.top is relative to window or parallaxWrapper
                    // If rect.top is relative to window, and parallaxWrapper scrolls, this is complex.
                    // Assuming rect.top is relative to window viewport for now, common for getBoundingClientRect.
                    // A more robust solution for parallax within a scroller might involve calculating scroll offset within that scroller.
                    // However, the CSS transform `translateZ(-0.5px) scale(1.3)` suggests a 3D parallax setup.
                    // The provided HTML inline scripts use `rect.top * speed` which is simple.
                    let yPos = rect.top * speed; 
                    yPos = Math.max(-maxOffset, Math.min(yPos, maxOffset)); // Clamp the movement
                    
                    // Check if the element already has a 3D transform from CSS
                    // If so, only modify translateY. Otherwise, apply a base transform.
                    // For now, applying the common transform seen in hoat-dong.html's inline script
                    bg.style.transform = `translateZ(-0.5px) scale(1.3) translateY(${yPos}px)`;
                }
            });
            tickingParallax = false;
        }
        
        function requestParallaxTick() {
            if (!tickingParallax) {
                requestAnimationFrame(updateParallax);
                tickingParallax = true;
            }
        }

        parallaxWrapper.addEventListener('scroll', requestParallaxTick, { passive: true });
        requestParallaxTick(); // Initial call
    } else if (parallaxBgs.length > 0 && !parallaxWrapper) {
        console.warn('.parallax-bg elements found, but .parallax-wrapper is missing. Parallax might not work as expected.');
    }

    // 4. Fade-in Elements on Scroll (using IntersectionObserver)
    const fadeElements = document.querySelectorAll('.fade-in-element');
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, { 
            threshold: 0.1, // Trigger when 10% of the element is visible
            // root: parallaxWrapper // Use parallaxWrapper as root if elements are inside it and it's the scroller
        });
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    // 5. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute !== '#') { 
                try {
                    const targetElement = document.querySelector(hrefAttribute);
                    if (targetElement) {
                        e.preventDefault();
                        
                        let headerOffset = 0;
                        if (header && header.classList.contains('navbar-visible')) {
                            headerOffset = header.offsetHeight;
                        }

                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + (parallaxWrapper ? parallaxWrapper.scrollTop : window.pageYOffset) - headerOffset;

                        if (parallaxWrapper) {
                            parallaxWrapper.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        } else {
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }

                        // Close mobile menu if open
                        if (mainNav && !mainNav.classList.contains('hidden') && window.innerWidth < 768) { 
                            mainNav.classList.add('hidden');
                            if (mobileMenuButton) {
                                mobileMenuButton.setAttribute('aria-expanded', 'false');
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`Smooth scroll target not found or invalid selector: ${hrefAttribute}`, err);
                }
            }
        });
    });

    // --- Functions specific to certain pages (like form validation, 3D model) should remain in their respective HTML files ---
    // --- or be conditionally loaded if main.js becomes very complex. ---

    // Example: Form validation for hoat-dong.html (IF you want to move it here)
    // You would need to ensure this only runs on hoat-dong.html, e.g., by checking for the form's existence.
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        // Keep the form validation logic from your original main.js or hoat-dong.html inline script
        // For brevity, I'm not copying the full validation logic here, but this is where it would go.
        // Make sure `validateEmail` and `highlightField` are defined if you move it here.
        console.log("Registration form found on this page. Validation logic can be attached.");
        // Add the event listener and helper functions (highlightField, validateEmail) here
        // registrationForm.addEventListener('submit', function(e) { ... });
        // function highlightField(field, isError) { ... }
        // function validateEmail(email) { ... }
    }

});