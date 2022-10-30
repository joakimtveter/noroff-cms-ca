import { showToast } from './toast.js';

// WISHLIST UTILITY FUNCTIONS

function updateWishlistBadge() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (!wishlist) return;
    document.querySelectorAll('.wishlist-btn').forEach((button) => {
        if (wishlist.includes(parseInt(button.dataset.gameid))) {
            button.dataset.active = 'true';
        } else {
            button.dataset.active = 'false';
        }
    });
}

function toggleWhishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (!wishlist) {
        wishlist = [];
    }
    const i = wishlist.indexOf(+id);
    if (i > -1) {
        wishlist.splice(i, 1);
        showToast('Game removed from wishlist!', 'info');
    } else {
        wishlist.push(+id);
        showToast('Game added to wishlist!', 'success');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    if (window.location.pathname === '/wishlist.html') {
        location.reload();
    } else {
        updateWishlistBadge();
    }
}

function enableWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            toggleWhishlist(parseInt(e.target.dataset.gameid));
        });
    });
}

// PRODUCT UTILITY FUNCTIONS
function productImageEventlistner() {
    document.querySelectorAll('.product__image').forEach((img) => {
        img.addEventListener('click', (e) => {
            handleImageClicks(e);
        });
    });

    document.querySelectorAll('.product-image').forEach((img) => {
        img.addEventListener('click', (e) => {
            handleImageClicks(e);
        });
    });
}

function handleImageClicks(e) {
    window.open(`/game.html?gameid=${e.target.dataset.gameid}`, '_self');
}

// CART UTILITY FUNCTIONS
function enableAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', (e) => {
            addToCart(parseInt(e.target.dataset.gameid), true);
        });
    });
}

function addToCart(gameId) {
    if (!gameId) return;
    let cartContent = sessionStorage.getItem('cart');
    if (cartContent) {
        cartContent = JSON.parse(cartContent);
        let obj = cartContent.find((o) => o.id === gameId);
        if (obj) {
            obj.quantity++;
        } else {
            cartContent.push({ id: parseInt(gameId), quantity: 1 });
        }
    } else {
        cartContent = [];
        cartContent.push({ id: parseInt(gameId), quantity: 1 });
    }
    let itemsInCart = 0;
    cartContent.forEach((item) => {
        itemsInCart + item.quantity;
    });
    sessionStorage.setItem('cart', JSON.stringify(cartContent));
    updateCartBadge();
    showToast('Game added to cart!', 'success');
}
function updateCartBadge() {
    const indicator = document.getElementById('basket-indicator');
    let itemsInCart = 0;
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    indicator.classList.add('hidden');
    if (!cartContent) return;
    cartContent.forEach((item) => {
        if (item.id) {
            itemsInCart += item.quantity;
        }
    });
    if (itemsInCart > 0) {
        indicator.innerText = itemsInCart;
        indicator.classList.remove('hidden');
    }
}

// URL UTILITY FUNCTIONS

function getValueFromURLParameter(parameter) {
    const urlParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return urlParams[parameter];
}

function setUrlParameterWithoutReload(parameter = '', value = '') {
    const currentPath = window.location.pathname;
    if (parameter.length > 0 && value.length > 0) {
        window.history.pushState({}, '', `${currentPath}?${parameter}=${value}`);
    } else {
        window.history.pushState({}, '', currentPath);
    }
}

// DOM UTILITY FUNCTIONS

function loadingSpinner(location) {
    if (location) {
        location.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span>Loading...</span>
        </div>`;
    }
}

function openMenu() {
    const mobileMenu = document.querySelector('#mobile-menu');
    mobileMenu.classList.add('active');
}

function closeMenu() {
    const mobileMenu = document.querySelector('#mobile-menu');
    mobileMenu.classList.remove('active');
}

function enableMenuButtons() {
    document.querySelectorAll('.hamburger').forEach((button) => {
        button.addEventListener('click', (e) => {
            openMenu();
        });
    });

    document.querySelectorAll('.hamburger-close').forEach((button) => {
        button.addEventListener('click', (e) => {
            closeMenu();
        });
    });
}

export {
    toggleWhishlist,
    updateWishlistBadge,
    enableAddToCartButtons,
    productImageEventlistner,
    enableWishlistButtons,
    addToCart,
    updateCartBadge,
    getValueFromURLParameter,
    setUrlParameterWithoutReload,
    loadingSpinner,
    enableMenuButtons,
};
