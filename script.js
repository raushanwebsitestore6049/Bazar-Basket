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
        otpInputs[0].focus();
    }

    // --- Mobile Navigation ---
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navClose = document.querySelector('.nav-close-btn');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.add('nav-open');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            nav.classList.remove('nav-open');
        });
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
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 1) {
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

});
