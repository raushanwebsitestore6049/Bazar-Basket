let cart = [];
let currentUser = null; // Variable to store logged-in user data

function switchPage(pageId, navId = null) {
    document.querySelectorAll('.page-view').forEach(page => {
        page.classList.remove('active-page');
    });

    const targetPage = document.getElementById(pageId);
    targetPage.classList.add('active-page');

    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });
    if (navId) {
        document.getElementById(navId).classList.add('active');
    }

    // If switching to cart page, render the cart
    if (pageId === 'cartPage') {
        renderCart();
    }
    // If switching to account page, populate user data
    if (pageId === 'myAccountPage') {
        populateAccountPage();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let map, marker;
let terrainLayer, satelliteLayer;
const defaultLat = 24.7955;
const defaultLng = 85.0002;

function openLocationModal() {
    document.getElementById('locationModal').classList.add('active');
    
    if (!map) {
        setTimeout(() => {
            map = L.map('map').setView([defaultLat, defaultLng], 13);

            terrainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            });

            satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles © Esri'
            });

            terrainLayer.addTo(map);

            marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

            marker.on('dragend', function(e) {
                const coords = e.target.getLatLng();
                reverseGeocodeCoords(coords.lat, coords.lng);
            });

            map.on('click', function(e) {
                marker.setLatLng(e.latlng);
                reverseGeocodeCoords(e.latlng.lat, e.latlng.lng);
            });
        }, 200);
    } else {
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }
}

function switchMapView(mode) {
    if (!map) return;

    const terrainBtn = document.getElementById('terrainBtn');
    const satelliteBtn = document.getElementById('satelliteBtn');

    if (mode === 'satellite') {
        map.removeLayer(terrainLayer);
        satelliteLayer.addTo(map);
        satelliteBtn.classList.add('active');
        terrainBtn.classList.remove('active');
    } else {
        map.removeLayer(satelliteLayer);
        terrainLayer.addTo(map);
        terrainBtn.classList.add('active');
        satelliteBtn.classList.remove('active');
    }
}

async function reverseGeocodeCoords(lat, lng) {
    const locInput = document.getElementById('locSearchInput');
    locInput.value = "Fetching address, please wait...";

    try {
        // Adding addressdetails=1 to get more granular data
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
        const data = await response.json();
        
        if (data && data.display_name) {
            // The display_name often provides a well-formatted, detailed address.
            locInput.value = data.display_name;
        } else {
            // Fallback if display_name is not available
            locInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    } catch (err) {
        console.error("Error fetching address:", err);
        locInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

function closeLocationModal() {
    document.getElementById('locationModal').classList.remove('active');
}

function detectGPSLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                if (map && marker) {
                    map.invalidateSize();
                    map.setView([lat, lng], 15);
                    marker.setLatLng([lat, lng]);
                    reverseGeocodeCoords(lat, lng);
                }
            },
            (error) => {
                console.error("Geolocation access was denied or failed. Please check browser location permissions.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        console.error("Geolocation is not supported by your browser.");
    }
}

function confirmLocation() {
    const searchVal = document.getElementById('locSearchInput').value;
    if (searchVal.trim() !== "") {
        const newLocation = searchVal.split(',')[0];
        document.getElementById('currentLocText').innerText = newLocation;
        document.querySelector('#mobileCurrentLocText > strong').innerText = newLocation;
    } else {
        document.getElementById('currentLocText').innerText = "Gaya, Bihar";
    }
    closeLocationModal();
}

let currentSlide = 0;
const totalSlides = 5;

function updateDots() {
    const dots = document.querySelectorAll('#dotsIndicator .dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function moveSlide(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    goToSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    document.getElementById('sliderWrapper').style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
}

setInterval(() => { moveSlide(1); }, 4000);

const backToTopBtn = document.getElementById('backToTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTopBtn.classList.add('visible');
    else backToTopBtn.classList.remove('visible');
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================
   NEW CART PAGE JAVASCRIPT
=========================================== */

function renderCart() {
    // This function will be filled out later to build the cart from the `cart` array.
    // For now, we just call recalculate to ensure totals are correct for the static items.
    recalculate();
}
function recalculate() {
    let subtotal = 0;
    let totalCount = 0;
    const items = document.querySelectorAll('#cartPage .cart-item');

    if (!items.length) {
        showEmptyState();
        return;
    }

    items.forEach(item => {
        const price = parseFloat(item.getAttribute('data-price'));
        const qty = parseInt(item.querySelector('.qty-number').innerText);
        const itemTotal = price * qty;
        
        item.querySelector('.item-total').innerText = itemTotal;
        subtotal += itemTotal;
        totalCount += qty;
    });

    document.getElementById('subtotalVal').innerText = subtotal;
    document.getElementById('cartBadge').innerText = `${totalCount} Items`;
    
    const taxes = subtotal > 0 ? 15 : 0;
    const grandTotal = subtotal + taxes;

    document.getElementById('grandTotalVal').innerText = grandTotal;
    document.getElementById('btnTotalVal').innerText = grandTotal;
}

function updateQty(itemId, change) {
    const item = document.getElementById(itemId);
    const qtySpan = document.getElementById(`qty-${itemId}`);
    let currentQty = parseInt(qtySpan.innerText);

    currentQty += change;

    if (currentQty <= 0) {
        item.remove();
    } else {
        qtySpan.innerText = currentQty;
    }

    recalculate();
}

function clearCart() {
    document.getElementById('cartList').innerHTML = '';
    showEmptyState();
}

function showEmptyState() {
    document.getElementById('cartLeftSection').style.display = 'none';
    document.getElementById('cartRightSection').style.display = 'none';
    document.getElementById('emptyCartState').style.display = 'flex';
    document.getElementById('cartBadge').innerText = '0 Items';
    document.querySelector('.clear-btn').style.display = 'none';
}

function applyPromo() {
    console.log('Promo code applied successfully!');
}

/* ==========================================
   NEW OFFERS PAGE JAVASCRIPT
=========================================== */
function filterCategory(category, btnElement) {
    // Update active state on buttons
    document.querySelectorAll('#offersPage .filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // Filter product items
    const products = document.querySelectorAll('#offersPage .product-card');
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'flex';
        } else {
            product.style.display = 'none';
        }
    });
}

/* ==========================================
   DYNAMIC CART & QUICK VIEW LOGIC
=========================================== */

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.qty += product.qty;
    } else {
        cart.push(product);
    }
    console.log('Cart updated:', cart);
    // You can add a visual confirmation here, like a toast notification.
}

function handleProductGridClick(event) {
    const target = event.target;
    const productCard = target.closest('.product-card');
    if (!productCard) return;

    const product = {
        id: productCard.dataset.id,
        name: productCard.dataset.name,
        price: parseFloat(productCard.dataset.price),
        icon: productCard.dataset.icon,
        iconBg: productCard.dataset.iconBg,
        qty: 1
    };

    if (target.classList.contains('btn-add')) {
        addToCart(product);
        target.textContent = 'Added!';
        target.classList.add('added');
        setTimeout(() => {
            target.textContent = 'Add';
            target.classList.remove('added');
        }, 1500);
    }

    if (target.classList.contains('quick-view-btn')) {
        openQuickView(product);
    }
}

function openQuickView(product) {
    document.getElementById('qvProductImg').className = `qv-product-img ${product.iconBg}`;
    document.getElementById('qvProductImg').textContent = product.icon;
    document.getElementById('qvProductName').textContent = product.name;
    document.getElementById('qvProductPrice').textContent = `₹${product.price}`;
    document.getElementById('qvQty').textContent = '1';

    const qvBtnAdd = document.getElementById('qvBtnAdd');
    qvBtnAdd.onclick = () => {
        const qty = parseInt(document.getElementById('qvQty').textContent);
        addToCart({ ...product, qty });
        closeQuickView();
        // Add a visual confirmation on the main page if desired
        console.log(`${qty} x ${product.name} added to cart!`);
    };

    document.getElementById('quickViewModal').classList.add('active');
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
}

function updateQvQty(change) {
    const qtyEl = document.getElementById('qvQty');
    let currentQty = parseInt(qtyEl.textContent);
    currentQty += change;
    if (currentQty < 1) {
        currentQty = 1;
    }
    qtyEl.textContent = currentQty;
}

// Initial setup for event listeners on the home page
document.addEventListener('DOMContentLoaded', () => {
    const homeProductGrid = document.querySelector('#homePage .product-grid');
    if (homeProductGrid) {
        // This is a placeholder. For full functionality, home page products
        // would also need data attributes and this handler would be more generic.
        homeProductGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add')) {
                console.log('Item added to cart! (Home page functionality is illustrative)');
            }
        });
    }

    // Attach listener for the offers page product grid
    const offersProductGrid = document.querySelector('#offersPage #productGrid');
    if (offersProductGrid) {
        offersProductGrid.addEventListener('click', handleProductGridClick);
    }
});

function populateAccountPage() {
    if (!currentUser) {
        // If no user is logged in, redirect to login page
        switchPage('loginPage');
        return;
    }

    const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
    const initials = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();

    document.getElementById('account-name').textContent = fullName;
    document.getElementById('account-avatar').textContent = initials;
    document.getElementById('account-phone').textContent = currentUser.phone;
    document.getElementById('account-email').textContent = currentUser.email;
}


// We need to ensure the event listener is attached when the offers page is loaded.
// The best place is after the content is fetched and inserted.
// Let's modify the script in index.html for this.

document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIN FORM LOGIC ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const phoneInput = document.getElementById('loginPhoneNumber');
        const phoneError = document.getElementById('loginPhoneError');
        const passwordInput = document.getElementById('loginPassword');
        const passwordError = document.getElementById('loginPasswordError');
        const togglePassword = document.getElementById('toggleLoginPassword');

        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
        });

        function validateLoginPhone() {
            const rawVal = phoneInput.value.trim();
            const cleanVal = rawVal.replace(/[\s\-+()]/g, '');
            const phonePattern = /^[0-9]{7,15}$/;

            if (rawVal === '') {
                phoneInput.classList.remove('valid', 'invalid');
                phoneError.classList.remove('show');
                return false;
            }

            const isValid = phonePattern.test(cleanVal);
            if (isValid) {
                phoneInput.classList.remove('invalid');
                phoneInput.classList.add('valid');
                phoneError.classList.remove('show');
            } else {
                phoneInput.classList.remove('valid');
                phoneInput.classList.add('invalid');
                phoneError.classList.add('show');
            }
            return isValid;
        }

        function validateLoginPassword() {
            if (passwordInput.value.length > 0) {
                passwordInput.classList.remove('invalid');
                passwordError.classList.remove('show');
                return true;
            }
            return false;
        }

        phoneInput.addEventListener('input', validateLoginPhone);
        passwordInput.addEventListener('input', validateLoginPassword);

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    async function handleLogin() {
        const phoneInput = document.getElementById('loginPhoneNumber');
        const passwordInput = document.getElementById('loginPassword');
        const phoneError = document.getElementById('loginPhoneError');
        const passwordError = document.getElementById('loginPasswordError');

        const isPhoneFormatValid = validateLoginPhone();
        const isPasswordEntered = validateLoginPassword();

        if (!isPhoneFormatValid || !isPasswordEntered) {
            if (!isPasswordEntered) {
                passwordInput.classList.add('invalid');
                passwordError.classList.add('show');
            }
            return;
        }

        const db = firebase.database();
        // Assuming +91 is the primary country code for your users
        const fullPhoneNumber = "+91" + phoneInput.value.trim();
        const enteredPassword = passwordInput.value;

        try {
            const snapshot = await db.ref('Customers Details/' + fullPhoneNumber).once('value');
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.password === enteredPassword) {
                    // Login successful
                    currentUser = {
                        phone: fullPhoneNumber,
                        ...userData
                    };
                    localStorage.setItem('bazarBasketUser', JSON.stringify(currentUser)); // Store user in localStorage for persistence
                    updateLoginState(true);
                    console.log(`Welcome back, ${userData.firstName}!`);
                    switchPage('homePage', 'navHome');
                } else {
                    // Incorrect password
                    passwordInput.classList.add('invalid');
                    passwordError.textContent = 'Incorrect password. Please try again.';
                    passwordError.classList.add('show');
                }
            } else {
                // User not found
                phoneInput.classList.add('invalid');
                phoneError.textContent = 'This mobile number is not registered.';
                phoneError.classList.add('show');
            }
        } catch (error) {
            console.error("Login error:", error);
            // Optionally, show an inline error message here
        }
    }

    function updateLoginState(isLoggedIn) {
        const loggedOutView = document.getElementById('profile-logged-out');
        const loggedInView = document.getElementById('profile-logged-in');

        if (isLoggedIn) {
            loggedOutView.style.display = 'none';
            loggedInView.style.display = 'block';
        } else {
            loggedOutView.style.display = 'block';
            loggedInView.style.display = 'none';
        }
    }

    // --- SIGNUP FORM LOGIC ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const countryCodeSelect = document.getElementById('countryCode');

        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const phoneInput = document.getElementById('signupPhoneNumber');
        const phoneError = document.getElementById('signupPhoneError');
        const passwordInput = document.getElementById('signupPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const matchError = document.getElementById('matchError');
        const matchSuccess = document.getElementById('matchSuccess');
        const toggleSignupPassword = document.getElementById('toggleSignupPassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

        const rules = {
            length: { el: document.getElementById('rule-length'), test: (val) => val.length >= 8 },
            upper: { el: document.getElementById('rule-upper'), test: (val) => /[A-Z]/.test(val) },
            lower: { el: document.getElementById('rule-lower'), test: (val) => /[a-z]/.test(val) },
            number: { el: document.getElementById('rule-number'), test: (val) => /[0-9]/.test(val) },
            special: { el: document.getElementById('rule-special'), test: (val) => /[@$!%*?&#]/.test(val) }
        };

        function validateEmail() {
            const emailVal = emailInput.value.trim();
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailVal === "") { emailInput.classList.remove('valid', 'invalid'); emailError.classList.remove('show'); return false; }
            const isValid = emailPattern.test(emailVal);
            emailInput.classList.toggle('valid', isValid);
            emailInput.classList.toggle('invalid', !isValid);
            emailError.classList.toggle('show', !isValid);
            return isValid;
        }

        function validatePhone() {
            const phoneVal = phoneInput.value.trim();
            const phonePattern = /^[0-9]{7,15}$/;
            if (phoneVal === "") { phoneInput.classList.remove('valid', 'invalid'); phoneError.classList.remove('show'); return false; }
            const isValid = phonePattern.test(phoneVal.replace(/\s+/g, ''));
            phoneInput.classList.toggle('valid', isValid);
            phoneInput.classList.toggle('invalid', !isValid);
            phoneError.classList.toggle('show', !isValid);
            return isValid;
        }

        function validatePassword() {
            const val = passwordInput.value;
            let allValid = true;
            for (const key in rules) {
                const passed = rules[key].test(val);
                rules[key].el.classList.toggle('valid', passed);
                if (!passed) allValid = false;
            }
            if (val.length === 0) { passwordInput.classList.remove('valid', 'invalid'); }
            else { passwordInput.classList.toggle('valid', allValid); passwordInput.classList.toggle('invalid', !allValid); }
            // Re-validate confirm password whenever the main password changes
            if (confirmPasswordInput.value.length > 0) validatePasswordMatch();
            return allValid;
        }

        function validatePasswordMatch() {
            const pwd = passwordInput.value;
            const confirmPwd = confirmPasswordInput.value;
            if (confirmPwd.length === 0) {
                confirmPasswordInput.classList.remove('valid', 'invalid');
                matchError.classList.remove('show');
                matchSuccess.classList.remove('show');
                return false;
            }
            const isMatch = pwd === confirmPwd && pwd !== '';
            confirmPasswordInput.classList.toggle('valid', isMatch);
            confirmPasswordInput.classList.toggle('invalid', !isMatch);
            matchError.classList.toggle('show', !isMatch);
            matchSuccess.classList.toggle('show', isMatch);
            return isMatch;
        }

        async function checkMobileExists() {
            const isFormatValid = validatePhone();
            if (!isFormatValid) return; // Don't check if format is wrong

            const db = firebase.database();
            const fullPhoneNumber = countryCodeSelect.value + phoneInput.value.trim();
            
            // Reset DB-specific error before checking
            if (phoneError.textContent === 'This mobile number is already registered.') {
                phoneError.textContent = 'Please enter a valid mobile number (7–15 digits).'; // Reset to default format error
                phoneInput.classList.remove('invalid');
                phoneError.classList.remove('show');
                validatePhone(); // Re-run format validation to get correct state
            }

            try {
                const snapshot = await db.ref('Customers Details/' + fullPhoneNumber).once('value');
                if (snapshot.exists()) {
                    phoneError.textContent = 'This mobile number is already registered.';
                    phoneInput.classList.add('invalid');
                    phoneError.classList.add('show');
                }
            } catch (error) {
                console.error("Error checking mobile number:", error);
            }
        }

        async function checkEmailExists() {
            const isFormatValid = validateEmail();
            if (!isFormatValid) return; // Don't check if format is wrong

            const db = firebase.database();
            const emailVal = emailInput.value.trim();

            // Reset DB-specific error before checking
            if (emailError.textContent === 'This email address is already in use.') {
                emailError.textContent = 'Please enter a valid email format (e.g. user@domain.com).';
                emailInput.classList.remove('invalid');
                emailError.classList.remove('show');
                validateEmail(); // Re-run format validation
            }

            const snapshot = await db.ref('Customers Details').orderByChild('email').equalTo(emailVal).once('value');
            if (snapshot.exists()) {
                emailError.textContent = 'This email address is already in use.';
                emailInput.classList.add('invalid');
                emailError.classList.add('show');
            }
        }

        emailInput.addEventListener('input', validateEmail);
        phoneInput.addEventListener('input', validatePhone);
        passwordInput.addEventListener('input', validatePassword);
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);

        // Add blur listeners for real-time DB checks
        phoneInput.addEventListener('blur', checkMobileExists);
        emailInput.addEventListener('blur', checkEmailExists);

        // Add listeners for password toggles
        toggleSignupPassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            toggleSignupPassword.textContent = type === 'password' ? 'Show' : 'Hide';
        });

        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            toggleConfirmPassword.textContent = type === 'password' ? 'Show' : 'Hide';
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Re-run checks on submit to be absolutely sure
            checkMobileExists();
            checkEmailExists();

            // Manually validate all fields on submit to catch empty required fields
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isPasswordValid = validatePassword();
            const isMatchValid = validatePasswordMatch();
            const isFirstNameValid = firstNameInput.value.trim() !== '';
            const isLastNameValid = lastNameInput.value.trim() !== '';

            // Add UI feedback for empty first/last name if they are invalid
            firstNameInput.classList.toggle('invalid', !isFirstNameValid);
            lastNameInput.classList.toggle('invalid', !isLastNameValid);

            // Final check to ensure no error messages are showing
            const isMobileAvailable = !phoneError.classList.contains('show');
            const isEmailAvailable = !emailError.classList.contains('show');


            if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isPasswordValid && isMatchValid && isMobileAvailable && isEmailAvailable) {
                // --- Firebase Integration ---
                const db = firebase.database();
                const fullPhoneNumber = countryCodeSelect.value + phoneInput.value.trim();

                const customerData = {
                    firstName: firstNameInput.value.trim(),
                    lastName: lastNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    // WARNING: Storing passwords in plaintext is a major security risk.
                    password: passwordInput.value
                };

                // Use the mobile number as the key under "Customers Details"
                db.ref('Customers Details/' + fullPhoneNumber).set(customerData)
                    .then(() => {
                        console.log('Account created successfully and data saved!');
                        
                        // Reset form and UI on success
                        signupForm.reset();
                        document.querySelectorAll('.input-field').forEach(input => input.classList.remove('valid', 'invalid'));
                        document.querySelectorAll('.check-item').forEach(item => item.classList.remove('valid'));
                        matchSuccess.classList.remove('show');
                        
                        // Navigate to home page
                        switchPage('homePage', 'navHome');
                    })
                    .catch((error) => {
                        console.error("Error saving data to Firebase: ", error);
                        // Optionally, show an inline error message here
                    });
            } else {
                console.log('Please fill out all required fields correctly.');
            }
        });
    }

    function handleLogout() {
        document.getElementById('logoutConfirmModal').classList.add('active');
    }

    // Add logout listener
    const logoutButton = document.getElementById('logoutButton');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener('click', () => {
            document.getElementById('logoutConfirmModal').classList.remove('active');
        });
    }
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('bazarBasketUser');
            updateLoginState(false);
            document.getElementById('logoutConfirmModal').classList.remove('active');
            switchPage('homePage', 'navHome');
        });
    }

    // Check for a logged-in user on page load
    const storedUser = localStorage.getItem('bazarBasketUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateLoginState(true);
    }
});
