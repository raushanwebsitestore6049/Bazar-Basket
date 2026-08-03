document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Store original text
            const originalText = this.innerHTML;

            // Change button text and style
            this.innerHTML = 'Added!';
            this.style.backgroundColor = 'var(--secondary-color)';

            // Revert back after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = ''; // Reverts to CSS color
            }, 2000);
        });
    });

    // --- OTP Auto-Focus Functionality ---
    const otpInputs = document.querySelectorAll('.otp-group input');

    if (otpInputs.length > 0) {
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                // If a character is entered and there's a next input, focus it
                if (input.value.length === 1 && index + 1 < otpInputs.length) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                // If backspace is pressed on an empty input, focus the previous one
                if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        // Optional: Focus the first input on page load
    }

    // --- Logout Confirmation Modal ---
    const logoutBtn = document.getElementById('logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const cancelLogoutBtn = document.getElementById('cancel-logout');

    if (logoutBtn && logoutModal && cancelLogoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            logoutModal.classList.add('active');
        });

        cancelLogoutBtn.addEventListener('click', () => {
            logoutModal.classList.remove('active');
        });

        // Also close modal if user clicks on the overlay
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.classList.remove('active');
            }
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // --- Quick View Modal ---
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const quickViewModal = document.getElementById('quick-view-modal');
    const quickViewCloseBtn = quickViewModal ? quickViewModal.querySelector('.modal-close-btn') : null;

    if (quickViewBtns.length > 0 && quickViewModal) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                quickViewModal.classList.add('active');
            });
        });

        if (quickViewCloseBtn) {
            quickViewCloseBtn.addEventListener('click', () => {
                quickViewModal.classList.remove('active');
            });
        }

        // Also close modal if user clicks on the overlay
        quickViewModal.addEventListener('click', (e) => {
            if (e.target === quickViewModal) {
                quickViewModal.classList.remove('active');
            }
        });
    }

    // --- Location Selector Modal ---
    const locationSelector = document.getElementById('header-location-selector');
    const locationModal = document.getElementById('location-selection-modal');
    const locationCloseBtn = locationModal ? locationModal.querySelector('.modal-close-btn') : null;
    const selectedLocationText = document.getElementById('selected-location-text');
    const detectLocationBtn = document.getElementById('detect-current-location-btn');
    const locationSearchInput = document.getElementById('location-search-input');
    const locationResultsList = locationModal ? locationModal.querySelector('.location-modal-results ul') : null;

    if (locationSelector && locationModal && locationCloseBtn) {
        // Open modal
        locationSelector.addEventListener('click', () => {
            locationModal.classList.add('active');
        });

        // Close modal with button
        locationCloseBtn.addEventListener('click', () => {
            locationModal.classList.remove('active');
        });

        // Close modal by clicking overlay
        locationModal.addEventListener('click', (e) => {
            if (e.target === locationModal) {
                locationModal.classList.remove('active');
            }
        });

        // --- Detect Current Location ---
        detectLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                detectLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
                detectLocationBtn.disabled = true;

                // Simulate fetching location
                setTimeout(() => {
                    const newLocation = "Navi Mumbai, 400703";
                    // Update all location display elements
                    document.querySelectorAll('#selected-location-text').forEach(el => {
                        el.textContent = newLocation;
                    });
                    detectLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Detect Current Location';
                    detectLocationBtn.disabled = false;
                    locationModal.classList.remove('active');
                }, 2000);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        });

        // --- Search Location (Simulated) ---
        const handleLocationSearch = debounce((query) => {
            if (!locationResultsList) return;
            locationResultsList.innerHTML = ''; // Clear previous results

            if (query.length < 2) {
                return; // Don't search for very short strings
            }

            // Simulated search results from a "Google Maps API"
            const fakeResults = [
                `${query} Street, Mumbai, 400001`,
                `New ${query} Area, Mumbai, 400050`,
                `${query} Landmark Building, Bandra, 400052`,
                `Old ${query} Road, Thane, 400601`
            ];

            fakeResults.forEach(resultText => {
                const li = document.createElement('li');
                li.textContent = resultText;
                locationResultsList.appendChild(li);
            });
        }, 300);

        locationSearchInput.addEventListener('input', (e) => handleLocationSearch(e.target.value));
    }

    // Debounce function for search input
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // --- Wishlist Button Toggle ---
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const heartIcon = btn.querySelector('i');
            if (btn.classList.contains('active')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas'); // 'fas' for solid heart
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far'); // 'far' for regular heart
            }
        });
    });

    // --- Hero Slider ---
    const slides = document.querySelectorAll('.hero-slide');
    const slider = document.querySelector('.hero-slider');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const paginationContainer = document.getElementById('slider-pagination');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Handle slide index looping
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentSlide) {
                slide.classList.add('active');
            }
        });

        // Update pagination dots
        if (paginationContainer) {
            const dots = paginationContainer.querySelectorAll('.pagination-dot');
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === currentSlide) dot.classList.add('active');
            });
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    if (slides.length > 1) {
        // Create pagination dots
        if (paginationContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('pagination-dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);

                dot.addEventListener('click', () => {
                    showSlide(i);
                    stopSlider(); // Stop autoplay on manual navigation
                });
                paginationContainer.appendChild(dot);
            });
        }

        startSlider(); // Start autoplay

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopSlider(); // Stop autoplay on manual navigation
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopSlider(); // Stop autoplay on manual navigation
            });
        }

        // Optional: Pause on hover
        slider.addEventListener('mouseenter', stopSlider);
        slider.addEventListener('mouseleave', startSlider);
    }

    // --- Profile Dropdown ---
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileBtn = profileDropdown ? profileDropdown.querySelector('.profile-btn') : null;
    const profileDropdownContent = profileDropdown ? profileDropdown.querySelector('.profile-dropdown-content') : null;

    if (profileBtn && profileDropdownContent) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent this click from being caught by the document listener
            profileDropdownContent.classList.toggle('active');
        });

        // Close dropdown if clicking outside
        document.addEventListener('click', () => {
            profileDropdownContent.classList.remove('active');
        });

        // Close dropdown on scroll
        window.addEventListener('scroll', () => {
            profileDropdownContent.classList.remove('active');
        });
    }

// OTP auto-focus (moved here to ensure it's within DOMContentLoaded scope)
if (otpInputs.length > 0) {
    otpInputs[0].focus();
}

}); // Correct closing for DOMContentLoaded
