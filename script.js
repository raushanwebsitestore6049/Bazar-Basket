let cart = [];

function switchPage(pageId, navId) {
    document.querySelectorAll('.page-view').forEach(page => {
        page.classList.remove('active-page');
    });

    const targetPage = document.getElementById(pageId);
    targetPage.classList.add('active-page');

    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });
    document.getElementById(navId).classList.add('active');

    // If switching to cart page, render the cart
    if (pageId === 'cartPage') {
        renderCart();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleProfileMenu(e) {
    e.stopPropagation();
    document.getElementById('profileDropdown').classList.toggle('show');
}

window.addEventListener('click', () => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

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
                alert("Geolocation access was denied or failed. Please check browser location permissions.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
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
    alert('Promo code applied successfully!');
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
        alert(`${qty} x ${product.name} added to cart!`);
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
                alert('Item added to cart! (Home page functionality is illustrative)');
            }
        });
    }

    // Attach listener for the offers page product grid
    const offersProductGrid = document.querySelector('#offersPage #productGrid');
    if (offersProductGrid) {
        offersProductGrid.addEventListener('click', handleProductGridClick);
    }
});

// We need to ensure the event listener is attached when the offers page is loaded.
// The best place is after the content is fetched and inserted.
// Let's modify the script in index.html for this.
