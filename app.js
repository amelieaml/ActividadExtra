
let localProducts = [];       
let premiumProductsMock = []; 

async function loadProductsFromAPI() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
            throw new Error(`Error en el servidor de la API: ${response.status}`);
        }
        
        const apiData = await response.json();
        
        localProducts = apiData.map(product => {
            let backupImage = product.image;
            if (product.id === 1) backupImage = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60";
            if (product.id === 2) backupImage = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60";
            if (product.id === 3) backupImage = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60";
            if (product.id === 4) backupImage = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60";

            return {
                id: product.id,
                title: product.title,
                price: product.price,
                category: product.category, 
            };
        });

        premiumProductsMock = localProducts.slice(0, 4);

        renderHomeCatalog();
        populateCategoriesFilter();
        renderCatalog();

    } catch (error) {
        console.error("Fallo crítico al conectar con la API, activando modo de contingencia local:", error);
        localProducts = [
            { id: 1, title: "Nexus Backpack Explorer", price: 89.50, category: "bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60" },
            { id: 2, title: "Chaqueta Aviador Cyber-Fit", price: 124.99, category: "clothing", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60" },
            { id: 3, title: "Anillo Auténtico Solitario", price: 450.00, category: "jewelery", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60" },
            { id: 4, title: "Monitor UltraWide 34'' Curvo", price: 599.99, category: "electronics", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60" }
        ];
        premiumProductsMock = [...localProducts];
        renderHomeCatalog();
        populateCategoriesFilter();
        renderCatalog();
    }
}


const views = {
    landing: document.getElementById('landing-container'),
    auth: document.getElementById('auth-container'),
    profile: document.getElementById('profile-container'),
    catalog: document.getElementById('catalog-container'),
    checkout: document.getElementById('checkout-container')
};

const authCards = {
    login: document.getElementById('login-card'),
    register: document.getElementById('register-card'),
    recover: document.getElementById('recover-card')
};

const cartDrawer = document.getElementById('cart-drawer');

function showView(viewName) {
    const pagesMap = { landing: 'index.html', catalog: 'catalogo.html', profile: 'perfil.html', auth: 'perfil.html' };
    
    if (!views[viewName]) {
        if (pagesMap[viewName]) {
            window.location.href = pagesMap[viewName];
        }
        return;
    }

    Object.keys(views).forEach(key => {
        if (views[key]) {
            views[key].style.display = (key === viewName) ? 'block' : 'none';
        }
    });
    
    if (viewName === 'landing') window.scrollTo(0, 0);
}

function showAuthCard(cardName) {
    Object.keys(authCards).forEach(key => {
        if (authCards[key]) {
            authCards[key].style.display = (key === cardName) ? 'block' : 'none';
        }
    });
}

const goHomeLogo = document.getElementById('go-to-home');
if (goHomeLogo) goHomeLogo.addEventListener('click', () => showView('landing'));

document.querySelectorAll('.nav-link-landing').forEach(link => {
    link.addEventListener('click', (e) => { e.preventDefault(); showView('landing'); });
});

const registerLink = document.getElementById('go-to-register');
if (registerLink) registerLink.addEventListener('click', (e) => { e.preventDefault(); showAuthCard('register'); });

const loginLink = document.getElementById('go-to-login');
if (loginLink) loginLink.addEventListener('click', (e) => { e.preventDefault(); showAuthCard('login'); });

const recoverLink = document.getElementById('go-to-recover');
if (recoverLink) recoverLink.addEventListener('click', (e) => { e.preventDefault(); showAuthCard('recover'); });

const backLoginLink = document.getElementById('back-to-login-from-recover');
if (backLoginLink) backLoginLink.addEventListener('click', (e) => { e.preventDefault(); showAuthCard('login'); });

const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);
if (themeToggle) updateBtnThemeIcon(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = (theme === 'dark') ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateBtnThemeIcon(newTheme);
    });
}

function updateBtnThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

const statusIndicator = document.getElementById('connection-status');
const statusText = document.getElementById('status-text');

function updateNetworkStatus() {
    if (!statusIndicator || !statusText) return;
    if (navigator.onLine) {
        statusIndicator.className = "status-indicator online";
        statusText.textContent = "Sistema En Línea";
    } else {
        statusIndicator.className = "status-indicator offline";
        statusText.textContent = "Modo Offline Activo";
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

const navAuthBtn = document.getElementById('nav-auth-btn');
const navProfileLink = document.getElementById('nav-profile-link');

if (!localStorage.getItem('users')) {
    const defaultUsers = [
        { name: "Admin UCAB", email: "admin@ucab.edu.ve", password: "123", role: "admin", avatar: "", address: "Módulo 4, Laboratorio de Informática" },
        { name: "Estudiante Cliente", email: "cliente@ucab.edu.ve", password: "123", role: "cliente", avatar: "", address: "Caracas, Venezuela" }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

function checkSession() {
    const currentUser = JSON.parse(sessionStorage.getItem('activeUser'));
    const navLinkAdmin = document.getElementById('nav-link-admin');
    
    if (views.auth) views.auth.style.display = 'none';
    if (views.profile) views.profile.style.display = 'none';
    
    if (currentUser) {
        if (navAuthBtn) navAuthBtn.textContent = "Mi Cuenta"; 
        if (navProfileLink) navProfileLink.style.display = "inline-block";
        
        const userRole = currentUser.role ? currentUser.role.toLowerCase() : '';
        
        if (userRole === 'admin' || currentUser.email === 'admin@ucab.edu.ve') {
            if (navLinkAdmin) navLinkAdmin.style.display = "inline-block";
        } else {
            if (navLinkAdmin) navLinkAdmin.style.display = "none";
            
            if (window.location.pathname.includes('admin.html')) {
                alert('🚫 Acceso denegado. Esta zona está reservada para administradores.');
                window.location.href = 'catalogo.html';
                return;
            }
        }
        
        const dispName = document.getElementById('profile-display-name');
        const dispRole = document.getElementById('profile-display-role');
        const inpName = document.getElementById('profile-name');
        const inpAvatar = document.getElementById('profile-avatar-url');
        const inpAddress = document.getElementById('profile-address');
        const imgAvatar = document.getElementById('profile-avatar-img');

        if (dispName) dispName.textContent = currentUser.name;
        
        if (dispRole) {
            dispRole.textContent = `Rol: ${(userRole === 'admin') ? 'Administrador' : 'Cliente'}`;
        }
        
        if (inpName) inpName.value = currentUser.name;
        if (inpAvatar) inpAvatar.value = currentUser.avatar || '';
        if (inpAddress) inpAddress.value = currentUser.address || '';
        
        if (imgAvatar) {
            imgAvatar.src = currentUser.avatar ? currentUser.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.name)}`;
        }

        if (window.location.pathname.includes('perfil.html')) {
            if (views.profile) views.profile.style.display = 'block';
        }

    } else {
        if (navAuthBtn) navAuthBtn.textContent = "Mi Cuenta";
        if (navProfileLink) navProfileLink.style.display = "none";
        if (navLinkAdmin) navLinkAdmin.style.display = "none";
        
        if (window.location.pathname.includes('perfil.html')) {
            if (views.auth) {
                views.auth.style.display = 'block';
                showAuthCard('login');
            }
        }
        
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'perfil.html';
            return;
        }
    }
}

if (navAuthBtn) {
    navAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentUser = sessionStorage.getItem('activeUser');
        
        window.location.href = 'perfil.html';
    });
}

if (navProfileLink) navProfileLink.addEventListener('click', (e) => { e.preventDefault(); showView('profile'); });

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const role = document.getElementById('reg-role').value; // 'cliente' o 'admin'

        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email)) {
            alert('Error: Este correo electrónico ya se encuentra registrado.');
            return;
        }

        const newUser = { name, email, password, role, avatar: "", address: "" };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('¡Registro exitoso! Ya puedes iniciar sesión con tu nueva cuenta.');
        e.target.reset();
        showAuthCard('login');
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (email === 'admin@ucab.edu.ve' && password === '123') {
            const adminUser = {
                name: 'Administrador UCAB',
                email: email,
                role: 'admin',
                avatar: '',
                address: 'Módulo 4, Laboratorio de Informática'
            };
            sessionStorage.setItem('activeUser', JSON.stringify(adminUser));
            alert('👋 ¡Bienvenido al sistema, Administrador!');
            e.target.reset();
            window.location.href = 'admin.html';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const matchedUser = users.find(user => user.email === email && user.password === password);

        if (matchedUser) {
            sessionStorage.setItem('activeUser', JSON.stringify(matchedUser));
            alert(`¡Conexión establecida! Bienvenido ${matchedUser.name}.`);
            e.target.reset();
            
            checkSession();
            
            const userRole = matchedUser.role ? matchedUser.role.toLowerCase() : '';
            if (userRole === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'catalogo.html';
            }
        } else {
            alert('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        }
    });
}

const recoverForm = document.getElementById('recover-form');
if (recoverForm) {
    recoverForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('recover-email').value.trim();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const matchedUser = users.find(user => user.email === email);

        if (matchedUser) {
            alert(`[Flujo de Recuperación]: Se ha restablecido el acceso. Tu contraseña registrada es: ${matchedUser.password}`);
            showAuthCard('login');
        } else {
            alert('No se encontró ningún usuario registrado con ese correo electrónico.');
        }
        e.target.reset();
    });
}

const profileForm = document.getElementById('profile-edit-form');
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let currentUser = JSON.parse(sessionStorage.getItem('activeUser'));
        let users = JSON.parse(localStorage.getItem('users')) || [];

        const newName = document.getElementById('profile-name').value.trim();
        const newAvatar = document.getElementById('profile-avatar-url').value.trim();
        const newAddress = document.getElementById('profile-address').value.trim();

        users = users.map(user => {
            if (user.email === currentUser.email) {
                user.name = newName;
                user.avatar = newAvatar;
                user.address = newAddress;
            }
            return user;
        });
        localStorage.setItem('users', JSON.stringify(users));

        currentUser.name = newName;
        currentUser.avatar = newAvatar;
        currentUser.address = newAddress;
        sessionStorage.setItem('activeUser', JSON.stringify(currentUser));

        checkSession();
        alert('¡Tus cambios han sido guardados con éxito!');
    });
}

const logoutBtn = document.getElementById('btn-logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('activeUser');
        checkSession();
        alert('Sesión finalizada correctamente.');
        window.location.href = 'index.html';
    });
}

function renderHomeCatalog() {
    const grid = document.getElementById('featured-products');
    if (!grid) return;
    grid.innerHTML = '';

    premiumProductsMock.forEach(prod => {
        const item = document.createElement('div');
        item.className = 'product-card';
        item.innerHTML = `
            <div class="img-container"><img src="${prod.image}" alt="${prod.title}"></div>
            <h3>${prod.title}</h3>
            <p class="price">$${prod.price.toFixed(2)}</p>
            <button class="btn-action-card" onclick="window.location.href='catalogo.html'">Adquirir Pieza</button>
        `;
        grid.appendChild(item);
    });
}

const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const priceValue = document.getElementById('price-value');

if (searchInput) searchInput.addEventListener('input', () => renderCatalog());
if (categoryFilter) categoryFilter.addEventListener('change', () => renderCatalog());
if (priceFilter) {
    priceFilter.addEventListener('input', (e) => {
        if (priceValue) priceValue.textContent = `$${e.target.value}`;
        renderCatalog();
    });
}

function populateCategoriesFilter() {
    if (!categoryFilter) return;
    const categories = ['all', ...new Set(localProducts.map(p => p.category))];
    categoryFilter.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat === 'all' ? 'Todas las categorías' : cat.charAt(0).toUpperCase() + cat.slice(1);
        categoryFilter.appendChild(option);
    });
}

function renderCatalog() {
    const grid = document.getElementById('main-catalog-grid');
    if (!grid) return;

    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const maxPrice = priceFilter ? parseFloat(priceFilter.value) : 1000;

    const filtered = localProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const counter = document.getElementById('catalog-counter-text');
    if (counter) counter.textContent = `Mostrando ${filtered.length} productos coincidentes`;
    
    grid.innerHTML = filtered.length === 0 ? '<p class="auth-subtitle">No se encontraron productos.</p>' : '';

    const allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};

    filtered.forEach(product => {
        const productReviews = allReviews[product.id] || [];
        let starsHTML = '✨ Sin calificaciones';
        if (productReviews.length > 0) {
            const sum = productReviews.reduce((acc, rev) => acc + rev.rating, 0);
            const avg = Math.round(sum / productReviews.length);
            starsHTML = `<span style="color: #f59e0b;">${'★'.repeat(avg)}${'☆'.repeat(5 - avg)}</span> (${productReviews.length})`;
        }

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="img-container" onclick="openFeedbackModal(${product.id})" style="cursor:pointer;">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <h3 onclick="openFeedbackModal(${product.id})" style="cursor:pointer; hover:underline;">${product.title}</h3>
            <div class="product-rating-badge" style="font-size:0.85rem; margin-bottom:0.5rem;">
                ${starsHTML}
            </div>
            <p class="price">$${product.price.toFixed(2)}</p>
            <div style="display:flex; gap:0.5rem;">
                <button class="btn-action-card" style="flex:1;" onclick="addToCart(${product.id})">Añadir 🛒</button>
                <button class="btn-theme" style="padding:0.5rem;" onclick="openFeedbackModal(${product.id})">💬 Ver Opiniones</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

let cart = JSON.parse(sessionStorage.getItem('storeCart')) || [];

const navCartBtn = document.getElementById('nav-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
if (navCartBtn && cartDrawer) navCartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
if (closeCartBtn && cartDrawer) closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));

window.addToCart = function(productId) {
    const product = localProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartState();
    if (cartDrawer) cartDrawer.classList.add('open'); 
};

window.changeQuantity = function(productId, delta) {
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartState();
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartState();
};

function updateCartState() {
    sessionStorage.setItem('storeCart', JSON.stringify(cart));
    renderCartDrawer();     
    renderMainCartSection(); 
}

function renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    if (!container) return;

    container.innerHTML = cart.length === 0 ? '<p class="auth-subtitle" style="text-align:center; padding: 2rem 0;">Tu carrito está vacío.</p>' : '';
    
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="btn-qty" onclick="changeQuantity(${item.id}, -1)">-</button>
                <button class="btn-qty" onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="btn-qty" style="background: rgba(239,68,68,0.15); color:#ef4444; border:none;" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        `;
        container.appendChild(div);
    });

    if (badge) badge.textContent = totalItems;
    
    const taxFactor = 0.16; 
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${(subtotal * (1 + taxFactor)).toFixed(2)}`;
}

function renderMainCartSection() {
    const mainContainer = document.getElementById('main-cart-items-page');
    if (!mainContainer) return;

    if (cart.length === 0) {
        mainContainer.innerHTML = `
            <div style="text-align:center; padding: 3rem 1rem;">
                <p class="auth-subtitle">No tienes productos en tu lista de compra actual.</p>
                <a href="catalogo.html" class="btn-cta primary" style="display:inline-block; margin-top:1rem; text-decoration:none;">Explorar Catálogo</a>
            </div>
        `;
        updateMainTotals(0);
        return;
    }

    mainContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        const row = document.createElement('div');
        row.className = 'main-cart-row';
        row.innerHTML = `
            <div class="main-cart-product-info">
                <img src="${item.image}" alt="${item.title}" class="main-cart-img">
                <div>
                    <h4>${item.title}</h4>
                    <p class="price">$${item.price.toFixed(2)} c/u</p>
                </div>
            </div>
            <div class="main-cart-controls">
                <button class="btn-qty" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span class="main-cart-qty-number">${item.quantity}</span>
                <button class="btn-qty" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="main-cart-subtotal-item">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="btn-delete-link" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        `;
        mainContainer.appendChild(row);
    });

    updateMainTotals(subtotal);
}

function updateMainTotals(subtotal) {
    const taxFactor = 0.16;
    const subtotalEl = document.getElementById('page-cart-subtotal');
    const taxEl = document.getElementById('page-cart-tax');
    const totalEl = document.getElementById('page-cart-total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${(subtotal * taxFactor).toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${(subtotal * (1 + taxFactor)).toFixed(2)}`;
}

function processCheckoutValidation() {
    if (cart.length === 0) {
        alert("El carrito está vacío. Añade algunos productos primero.");
        return;
    }
    
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    if (!activeUser) {
        alert("🔒 Acceso Protegido: Debes iniciar sesión para procesar el pago de tu orden.");
        window.location.href = 'perfil.html';
        return;
    }
    
    showView('checkout');
}

const btnGoToCheckout = document.getElementById('btn-go-to-checkout');
if (btnGoToCheckout) btnGoToCheckout.addEventListener('click', processCheckoutValidation);

const btnConfirmPagePayment = document.getElementById('btn-confirm-page-payment');
if (btnConfirmPagePayment) btnConfirmPagePayment.addEventListener('click', processCheckoutValidation);

const btnCancelCheckout = document.getElementById('btn-cancel-checkout');
if (btnCancelCheckout) {
    btnCancelCheckout.addEventListener('click', () => showView('catalog'));
}

const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
        const totalCartPrice = document.getElementById('page-cart-total')?.textContent || "$0.00";
        
        const purchasedItems = cart.map(item => ({
            title: item.title,
            quantity: item.quantity
        }));
        
        const newOrder = {
            id: 'NEX-' + Math.floor(100000 + Math.random() * 900000),
            clientName: activeUser.name,
            clientEmail: activeUser.email,
            date: new Date().toLocaleDateString('es-ES'),
            total: totalCartPrice,
            items: purchasedItems,
            status: 'Pendiente'
        };
        
        let currentSales = JSON.parse(localStorage.getItem('salesHistory')) || [];
        currentSales.push(newOrder);
        localStorage.setItem('salesHistory', JSON.stringify(currentSales));
        
        alert(`🎉 ¡Pago Autorizado con éxito!\nTu orden ${newOrder.id} ha sido enviada al Panel de Administración.`);
        
        cart = [];
        updateCartState();
        showView('catalog');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromAPI();
    checkSession();
    updateCartState();

    if (window.location.pathname.includes('admin.html')) {
        initAdminPanel();
    }
});

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Suscripción procesada. ¡Bienvenido al Club Nexus!');
        e.target.reset();
    });
}


const mainCartSection = document.getElementById('seccion-carrito');
const mainCartDivider = document.getElementById('cart-divider');
const closeMainCartBtn = document.getElementById('close-main-cart-section-btn');
const navLinkCartPage = document.getElementById('nav-link-cart-page');

if (closeMainCartBtn && mainCartSection) {
    closeMainCartBtn.addEventListener('click', () => {
        mainCartSection.style.display = 'none';
        if (mainCartDivider) mainCartDivider.style.display = 'none';
    });
}

if (navLinkCartPage && mainCartSection) {
    navLinkCartPage.addEventListener('click', () => {
        mainCartSection.style.display = 'block';
        if (mainCartDivider) mainCartDivider.style.display = 'block';
    });
}

function initAdminPanel() {
    renderAdminInventory();
    renderAdminSales();
    renderAdminMetrics(); 

    const crudForm = document.getElementById('crud-product-form');
    const cancelEditBtn = document.getElementById('btn-crud-cancel');

    if (crudForm) crudForm.addEventListener('submit', handleCrudSubmit);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', clearCrudForm);
}

function renderAdminInventory() {
    const tbody = document.getElementById('admin-inventory-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    localProducts.forEach(prod => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid var(--border-color)";
        tr.innerHTML = `
            <td style="padding: 0.8rem 1rem;"><img src="${prod.image}" style="width:40px; height:40px; object-fit:cover; border-radius:6px;"></td>
            <td style="padding: 0.8rem 1rem; font-weight:500; color:var(--text-primary); max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${prod.title}</td>
            <td style="padding: 0.8rem 1rem; color:var(--text-secondary); font-size:0.9rem;">${prod.category}</td>
            <td style="padding: 0.8rem 1rem; font-weight:700; color:var(--accent);">$${prod.price.toFixed(2)}</td>
            <td style="padding: 0.8rem 1rem; text-align:center;">
                <button class="btn-qty" style="background:rgba(59,130,246,0.15); color:#3b82f6; border:none; margin-right:4px;" onclick="editProduct(${prod.id})">✏️</button>
                <button class="btn-qty" style="background:rgba(239,68,68,0.15); color:#ef4444; border:none;" onclick="deleteProduct(${prod.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAdminSales() {
    const tbody = document.getElementById('admin-sales-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const sales = JSON.parse(localStorage.getItem('salesHistory')) || [];

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-secondary);">No se registran transacciones en el historial de pasarela.</td></tr>';
        return;
    }

    sales.forEach(order => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid var(--border-color)";
        tr.innerHTML = `
            <td style="padding: 0.8rem 1rem; font-family:monospace; font-weight:700; color:var(--text-primary);">${order.id}</td>
            <td style="padding: 0.8rem 1rem; color:var(--text-primary);">${order.clientName} <br><small style="color:var(--text-secondary); opacity:0.7;">${order.clientEmail}</small></td>
            <td style="padding: 0.8rem 1rem; color:var(--text-secondary); font-size:0.9rem;">${order.date}</td>
            <td style="padding: 0.8rem 1rem; font-weight:700; color:#10b981;">${order.total}</td>
            <td style="padding: 0.8rem 1rem; text-align:center;">
                <select class="btn-theme" style="padding:0.4rem; border-radius:8px; font-size:0.85rem;" onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                    <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>📦 Enviado</option>
                    <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>✅ Entregado</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAdminMetrics() {
    const sales = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    let totalIncome = 0;
    sales.forEach(order => {
        const value = parseFloat(order.total.replace('$', '')) || 0;
        totalIncome += value;
    });
    
    const incomeEl = document.getElementById('metric-total-income');
    if (incomeEl) incomeEl.textContent = `$${totalIncome.toFixed(2)}`;

    const totalUsers = users.length;
    const activeUsers = sessionStorage.getItem('activeUser') ? 1 : 0; 
    const usersEl = document.getElementById('metric-users-count');
    if (usersEl) usersEl.textContent = `${totalUsers} Registrados / ${activeUsers} Activo(s)`;

    const productCounts = {};
    sales.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                productCounts[item.title] = (productCounts[item.title] || 0) + item.quantity;
            });
        }
    });

    const sortedProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const topListEl = document.getElementById('metric-top-products');
    if (topListEl) {
        topListEl.innerHTML = '';
        if (sortedProducts.length === 0) {
            topListEl.innerHTML = '<li>No se registran ventas aún</li>';
        } else {
            sortedProducts.forEach(([title, qty]) => {
                const li = document.createElement('li');
                li.innerHTML = `<span style="color: var(--accent); font-weight:700;">${qty} uds</span> - ${title}`;
                li.style.marginBottom = "0.3rem";
                topListEl.appendChild(li);
            });
        }
    }
}

function handleCrudSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('crud-prod-id').value;
    const title = document.getElementById('crud-prod-title').value.trim();
    const price = parseFloat(document.getElementById('crud-prod-price').value);
    const category = document.getElementById('crud-prod-category').value.trim();
    const image = document.getElementById('crud-prod-image').value.trim();

    if (id) {
        localProducts = localProducts.map(p => p.id === parseInt(id) ? { id: parseInt(id), title, price, category, image } : p);
        alert('Producto actualizado con éxito en el inventario local.');
    } else {
        const newProd = {
            id: localProducts.length > 0 ? Math.max(...localProducts.map(p => p.id)) + 1 : 1,
            title,
            price,
            category,
            image
        };
        localProducts.unshift(newProd); 
        alert('Nuevo producto inyectado correctamente en el catálogo global.');
    }

    clearCrudForm();
    renderAdminInventory();
    renderCatalog();
    renderAdminMetrics();
}

window.editProduct = function(id) {
    const prod = localProducts.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('crud-prod-id').value = prod.id;
    document.getElementById('crud-prod-title').value = prod.title;
    document.getElementById('crud-prod-price').value = prod.price;
    document.getElementById('crud-prod-category').value = prod.category;
    document.getElementById('crud-prod-image').value = prod.image;

    document.getElementById('form-crud-title').textContent = "✏️ Editar Producto Seleccionado";
    document.getElementById('btn-crud-cancel').style.display = "inline-block";
};

window.deleteProduct = function(id) {
    if (confirm('¿Seguro que deseas eliminar este ítem del inventario global?')) {
        localProducts = localProducts.filter(p => p.id !== id);
        renderAdminInventory();
        renderCatalog();
        renderAdminMetrics();
    }
};

function clearCrudForm() {
    document.getElementById('crud-product-form').reset();
    document.getElementById('crud-prod-id').value = '';
    document.getElementById('form-crud-title').textContent = "📦 Agregar Nuevo Producto";
    document.getElementById('btn-crud-cancel').style.display = "none";
}

window.updateOrderStatus = function(orderId, newStatus) {
    let sales = JSON.parse(localStorage.getItem('salesHistory')) || [];
    sales = sales.map(order => order.id === orderId ? { ...order, status: newStatus } : order);
    
    localStorage.setItem('salesHistory', JSON.stringify(sales));
    renderAdminSales();
    renderAdminMetrics(); 
};

let currentSelectedRating = 5;

window.openFeedbackModal = function(productId) {
    const modal = document.getElementById('feedback-modal');
    const product = localProducts.find(p => p.id === productId);
    if (!modal || !product) return;

    document.getElementById('feedback-product-id').value = productId;
    document.getElementById('feedback-product-title').textContent = product.title;
    
    const detailContainer = document.getElementById('feedback-product-detail');
    detailContainer.innerHTML = `
        <img src="${product.image}" style="max-height: 120px; background: white; padding: 0.5rem; border-radius: 8px; margin-bottom: 0.5rem;">
        <p class="price" style="font-weight: 800; color: var(--accent);">$${product.price.toFixed(2)}</p>
    `;

    setRating(5); 
    document.getElementById('feedback-comment').value = '';
    
    renderProductReviews(productId);
    modal.style.right = '0'; 
};

window.closeFeedbackModal = function() {
    const modal = document.getElementById('feedback-modal');
    if (modal) modal.style.right = '-450px';
};

window.setRating = function(rating) {
    currentSelectedRating = rating;
    document.getElementById('feedback-rating-value').value = rating;
    const stars = document.querySelectorAll('.star-rating-input span');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#f59e0b';
        } else {
            star.style.color = 'var(--text-secondary)';
        }
    });
};

function renderProductReviews(productId) {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    container.innerHTML = '';

    const pId = String(productId);
    let allReviews = {};
    
    try {
        allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
    } catch(e) {
        allReviews = {};
    }
    
    const reviews = allReviews[pId] || [];

    if (reviews.length === 0) {
        container.innerHTML = '<p class="auth-subtitle" style="text-align:center; padding:1rem 0; font-style: italic;">Aún no hay reseñas de este producto. ¡Sé el primero!</p>';
        return;
    }

    reviews.forEach(rev => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'flex-start';
        div.style.gap = '0.25rem';
        div.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        div.style.padding = '0.75rem 0';
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%; font-size:0.85rem;">
                <strong style="color: var(--text-primary);">${rev.user}</strong>
                <span style="color:var(--text-secondary); font-size:0.75rem;">${rev.date}</span>
            </div>
            <div style="color: #f59e0b; font-size:0.9rem;">${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}</div>
            <p style="color: var(--text-secondary); font-size:0.9rem; margin-top:0.25rem; font-style:italic; word-break: break-word;">"${rev.comment}"</p>
        `;
        container.appendChild(div);
    });
}

function inicializarFormularioFeedback() {
    const feedbackForm = document.getElementById('feedback-form');
    if (!feedbackForm) return;

    feedbackForm.removeAttribute('onsubmit'); 
    
    feedbackForm.onsubmit = function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('feedback-product-id').value;
        const rating = parseInt(document.getElementById('feedback-rating-value').value) || 5;
        const comment = document.getElementById('feedback-comment').value.trim();
        
        if (!comment) {
            alert('Por favor, escribe un comentario antes de enviar.');
            return;
        }

        const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
        const userName = activeUser ? (activeUser.name || activeUser.username) : 'Usuario Anónimo';

        const newReview = {
            user: userName,
            rating: rating,
            comment: comment,
            date: new Date().toLocaleDateString('es-ES')
        };

        let allReviews = {};
        try {
            allReviews = JSON.parse(localStorage.getItem('productReviews')) || {};
        } catch(error) {
            allReviews = {};
        }

        if (!allReviews[productId]) {
            allReviews[productId] = [];
        }
        
        allReviews[productId].unshift(newReview); 
        
        localStorage.setItem('productReviews', JSON.stringify(allReviews));

        document.getElementById('feedback-comment').value = '';
        setRating(5);
        
        renderProductReviews(productId); 
        if (typeof renderCatalog === 'function') {
            renderCatalog(); 
        }

        alert('🎉 ¡Reseña guardada con éxito en LocalStorage!');
    };
}

document.addEventListener('DOMContentLoaded', inicializarFormularioFeedback);


function verificarRolYAccesos() {
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    const adminBtn = document.getElementById('nav-admin-btn');

    const userRole = (activeUser && activeUser.role) ? activeUser.role.toLowerCase() : '';

    if (activeUser && userRole === 'admin') {
        if (adminBtn) adminBtn.style.display = 'inline-block';
        console.log("🔓 Modo Administrador Activo. Acceso concedido al CRUD.");
    } else {
        if (adminBtn) adminBtn.style.display = 'none';
        
        window.openAdminPanel = function() {
            alert("🚫 Error de Autorización: No tienes permisos de administrador para acceder a este panel.");
            return false;
        };
    }
}