document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', function() {
            mainNav.classList.toggle('hidden');
        });
    }

    // Handle tab functionality for the library page
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabContainer = this.closest('.tabs-container'); // Assuming tabs are within a container
                if (tabContainer) {
                    tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'bg-primary', 'text-white'));
                    tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.add('bg-gray-100', 'text-dark'));
                    tabContainer.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                    tabContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                } else { // Fallback for global tabs if no container
                    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'bg-primary', 'text-white'));
                    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.add('bg-gray-100', 'text-dark'));
                    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                }
                
                this.classList.add('active', 'bg-primary', 'text-white');
                this.classList.remove('bg-gray-100', 'text-dark');
                const tabId = this.getAttribute('data-tab');
                const activeContent = document.getElementById(tabId);
                if (activeContent) {
                    activeContent.classList.remove('hidden');
                    activeContent.classList.add('active');
                }
            });
        });
        // Ensure initially active tab's content is shown
        const initiallyActiveButton = document.querySelector('.tab-btn.active');
        if (initiallyActiveButton) {
            const initialTabId = initiallyActiveButton.getAttribute('data-tab');
            const initialActiveContent = document.getElementById(initialTabId);
            if (initialActiveContent) {
                initialActiveContent.classList.remove('hidden');
                initialActiveContent.classList.add('active');
            }
        }
    }
    
    // Form validation for the activities page
    const registrationForm = document.getElementById('registration-form'); // Add ID to your form
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const event = document.getElementById('event');
            
            [name, email, phone, event].forEach(field => {
                if (field) { // Ensure field exists
                    if (!field.value.trim() || (field.type === 'email' && !validateEmail(field.value))) {
                        highlightField(field, true);
                        isValid = false;
                    } else {
                        highlightField(field, false);
                    }
                }
            });
            
            if (isValid) {
                const formContainer = registrationForm.parentNode;
                formContainer.innerHTML = `
                    <div class="text-center p-8">
                        <h3 class="text-2xl text-primary font-bold mb-4">Đăng Ký Thành Công!</h3>
                        <p class="text-lg">Cảm ơn bạn đã đăng ký tham gia. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                    </div>
                `;
            }
        });
        
        function highlightField(field, isError) {
            const parentDiv = field.closest('div'); // Assuming input is wrapped in a div
            let errorMsg = parentDiv.querySelector('.error-message');
            if (isError) {
                field.classList.add('border-red-500', 'ring-red-500');
                field.classList.remove('border-gray-300', 'focus:ring-primary');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message text-red-500 text-sm mt-1';
                    parentDiv.appendChild(errorMsg);
                }
                errorMsg.textContent = field.id === 'email' && !validateEmail(field.value) && field.value.trim() ? 'Email không hợp lệ.' : 'Vui lòng điền thông tin này.';
            } else {
                field.classList.remove('border-red-500', 'ring-red-500');
                field.classList.add('border-gray-300', 'focus:ring-primary');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        }
        
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }
    }
    
    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'fixed inset-0 bg-black/90 flex justify-center items-center z-[9999] hidden';
        
        const lightboxContent = document.createElement('div');
        lightboxContent.className = 'relative max-w-[90%] max-h-[90%]';
        
        const lightboxImg = document.createElement('img');
        lightboxImg.className = 'max-w-full max-h-[90vh] block border-4 border-white rounded';
        
        const lightboxCaption = document.createElement('div');
        lightboxCaption.className = 'text-white text-center p-3 text-lg';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'absolute -top-8 right-0 text-4xl text-white bg-transparent border-none cursor-pointer hover:text-gray-300';
        
        lightboxContent.appendChild(lightboxImg);
        lightboxContent.appendChild(lightboxCaption);
        lightboxContent.appendChild(closeBtn);
        lightbox.appendChild(lightboxContent);
        document.body.appendChild(lightbox);
        
        galleryItems.forEach(item => {
            item.classList.add('cursor-pointer');
            item.addEventListener('click', function() {
                const imgElement = this.querySelector('img');
                const captionElement = this.querySelector('.gallery-caption-text'); // Use a specific class for caption text
                
                if (imgElement) lightboxImg.src = imgElement.src;
                if (captionElement) lightboxCaption.textContent = captionElement.textContent;
                else lightboxCaption.textContent = '';

                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1) { // Ensure it's not just "#"
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Parallax scroll effect & Fade-in elements
    const parallaxWrapper = document.querySelector('.parallax-wrapper');
    if (parallaxWrapper) {
        parallaxWrapper.addEventListener('scroll', function() {
            const scrollPosition = this.scrollTop;
            
            document.querySelectorAll('.parallax-bg').forEach(bg => {
                const section = bg.closest('.parallax-section');
                if (section) {
                    // More subtle parallax: adjust speed factor (e.g., 0.3 instead of 0.5)
                    // The translateZ and scale are part of the 3D effect, speed is controlled by how much you alter translateY
                    const speed = parseFloat(bg.dataset.parallaxSpeed) || 0.4; // Slower speed
                    const yPos = -(scrollPosition - section.offsetTop) * speed;
                     // The `translateZ(-10px) scale(2)` is from the CSS, we only adjust Y here based on scroll
                    bg.style.transform = `translateZ(-20px) scale(3) translateY(${yPos}px)`;
                }
            });

            document.querySelectorAll('.fade-in-element').forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                // Check if element is within viewport of the parallax-wrapper
                if (elementTop < parallaxWrapper.clientHeight - 100) { // Trigger when 100px from bottom
                    element.classList.add('visible');
                }
            });
        });
         // Trigger fade-in for elements already in view on load
        document.querySelectorAll('.fade-in-element').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < parallaxWrapper.clientHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
});