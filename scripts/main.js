import { showToast } from './toast.js';
import { PRODUCTS } from '../backend/db.js';

const currentLocation = window.location.pathname;

// ENABLE BUTTONS WITH EVENTLISTENERS
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

function enableAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', (e) => {
            addToCart(parseInt(e.target.dataset.gameid), true);
        });
    });
}

function enableRemoveFromCartButtons() {
    document.querySelectorAll('.remove-from-cart-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            removeFromCart(parseInt(e.currentTarget.dataset.gameid), true);
        });
    });
}

function enableWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            toggleWhishlist(parseInt(e.target.dataset.gameid));
        });
    });
}

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

// HANDLER FUNCTIONS
function handleUpdateCartQty(e) {
    if (e.target.value === '') return;
    updateCartQty(+e.target.attributes['data-gameid'].value, +e.target.value);
}
function handleImageClicks(e) {
    window.open(`/game.html?gameid=${e.target.dataset.gameid}`, '_self');
}

// RENDER FUNCTIONS
function renderCartItems() {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    const cart = document.getElementById('cart-body');
    const checkOutBtn = document.getElementById('check-out-btn');
    let cartItems = '';
    let cartTotal = 0;
    if (!cartContent || cartContent.length === 0) {
        cartItems = ` 
        <tr id="empty-cart">
          <td style="width: 100%; margin-block: 5rem; padding-left: 1rem;">The cart is empty!</td>
        </tr>`;
        cart.innerHTML = cartItems;
        document.querySelector('#cart-total').innerText = cartTotal + 'kr';
        checkOutBtn.classList.add('disabled');
        return;
    }
    cartContent.forEach((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        cartTotal += product.price * item.quantity;
        cartItems += `
        <tr>
          <td class="product-image-cell">
              <img
              class="product-image"
              src="${product?.image}"
              alt="Cover"
              height="150"
              />
          </td>
          <td class="product-item-cell">
              <h2 class="title">${product?.title}</h2>
          </td>
          <td class="product-qty-cell">
                <label for="qty-${item?.id}" class="sr-only">Quantity</label>
              <input 
                id="qty-${item?.id}" 
                class="cart-qty"
                type="number" 
                name="qty" 
                min="0"
                max="99" 
                value="${item?.quantity}" 
                data-gameid="${item?.id}"
              />
          </td>
          <td class="product-price-cell">${product?.price} kr</td>
          <td class="product-total-cell">${product?.price * item?.quantity} kr</td>
          <td class="product-delete-cell">
            <button class="remove-from-cart-btn" data-gameid="${product?.id}">
                <span class="sr-only">Remove ${product?.title} from the cart</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/>
                </svg>
            </button>
          </td>
        </tr>
        `;
        cart.innerHTML = cartItems;
    });
    document.querySelector('#cart-total').innerText = cartTotal + 'kr';
    document.querySelectorAll('.cart-qty').forEach((input) => {
        input.addEventListener('input', (e) => {
            handleUpdateCartQty(e);
        });
    });
}

function renderWishlistItems() {
    const wishlistContainer = document.getElementById('wishlist-container');
    let wishlist = JSON.parse(localStorage.getItem('wishlist'));
    let wishlistItems = '';
    if (!wishlist || wishlist.length === 0) {
        wishlistContainer.innerHTML = `
          <p style="width: 100%; margin-block: 5rem">The wishlist is empty!</p>
        `;
        return;
    }
    wishlist.forEach((item) => {
        const product = PRODUCTS.find((p) => p.id === item);
        wishlistItems += `
        <li>
            <div class="card-large">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.title} Cover"
                    data-gameid="${product.id}"
                />
                <div class="card-body">
                    <div class="flex flex-center">
                        <a href="/game.html?gameid=${product.id}"><h2 class="title">${product.title}</h2></a>
                    </div>
                    <div class="reviews">
                        <div class="review-container dark">
                            <div
                                class="rating-stars"
                                style="--rating: ${product.rating}"
                                role="tooltip"
                                aria-label="${product.title} has a rating of ${product.rating} out of 5."
                            ></div>
                            <div class="rating">${product.rating}</div>
                        </div>
                        <a href="/review.html?gameid=${product.id}">Write a review</a>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque unde expedita
                        accusantium aliquam ducimus, quasi velit officiis. Illum dolor ea enim mollitia
                        delectus expedita explicabo.
                    </p>
                </div>
                <div class="buy-product">
                    <div class="price-stock">
                        <p class="price">${product.price} kr</p>
                        <p class="stock"><i class="fas fa-box stock-indicator"></i> ${product.stock} in stock</p>
                    </div>
                    <button class="btn primary add-to-cart" data-gameid="${product.id}">Add to cart</button>
                    <button class="link remove-from-wishlist-btn" data-gameid="${product.id}">Remove from wishlist</button>
                </div>
            </div>
        </li>
        `;
    });
    updateWishlistBadge();
    wishlistContainer.innerHTML = wishlistItems;
}

function uptateSearchPageTitleAndSearchBox() {
    const term = window.location.search.substring(3).replace(/\+/g, ' ');
    document.title = `Search results for ${term} | Gamehub - The universe of games`;
    document.querySelector('#searchbox').setAttribute('value', term);
}

function renderSearchResults() {
    const term = window.location.search.substring(3).replace(/\+/g, ' ');
    const searchResultsContainer = document.getElementById('search-results');
    const searchResults = PRODUCTS.filter(function (game) {
        return game.title.toLowerCase().indexOf(term.toLowerCase()) !== -1;
    });

    let searchResultsHTML = `<p>Your search for "${term}" gave ${searchResults.length} results...</p>`;
    if (searchResults.length > 0) {
        searchResultsHTML += '<ul class="search-results">';
        searchResults.map((result) => {
            searchResultsHTML += `
                <li>
                    <div class="card-large">
                        <img class="product-image" src="${result.image}" alt="${result.title} cover" />
                        <div class="card-body">
                        <div class="flex flex-center">
                        <a href="/game.html?${result.id}"><h2 class="title">${result.title}</h2></a>
                        <button class="wishlist-btn sm" data-active="false" data-gameid="${result.id}">
                            <svg class="wishlist-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.05 448.77" >
                                <path class="wishlist-toggle-full" d="M458.35,65c-57.8-48.6-147.1-41.3-202.4,15-55.3-56.3-144.6-63.7-202.4-15-75.2,63.3-64.2,166.5-10.6,221.2l175.4,178.7a52.52,52.52,0,0,0,75.2.1L469,286.25C522.45,231.55,533.65,128.35,458.35,65Z" transform="translate(0.05 -31.98)" />
                                <path class="wishlist-toggle-line" d="M458.4,64.3C400.6,15.7,311.3,23,256,79.3,200.7,23,111.4,15.6,53.6,64.3-21.6,127.6-10.6,230.8,43,285.5L218.4,464.2a52.52,52.52,0,0,0,75.2.1L469,285.6C522.5,230.9,533.7,127.7,458.4,64.3ZM434.8,251.8,259.4,430.5c-2.4,2.4-4.4,2.4-6.8,0L77.2,251.8c-36.5-37.2-43.9-107.6,7.3-150.7,38.9-32.7,98.9-27.8,136.5,10.5l35,35.7,35-35.7c37.8-38.5,97.8-43.2,136.5-10.6,51.1,43.1,43.5,113.9,7.3,150.8Z" transform="translate(0.05 -31.98)" />
                            </svg>
                            <span class="sr-only">Add to wishlist</span>
                        </button>
                        </div>
                        <div class="reviews">
                            <div class="review-container">
                                <div class="rating-stars" style="--rating: ${result.rating}" role="tooltip" aria-label="${result.title} has a rating of ${result.rating} out of 5."></div>
                                <div class="rating">${result.rating}</div>
                            </div>
                            <a href="/review.html?${result.id}">Write a review</a>
                        </div>
                            <p>${result.desciption}</p>
                        </div>
                        <div class="buy-product">
                        <div class="price-stock">
                            <p class="price">${result.price} kr</p>`;
            let indicator = '';
            if (result.stock < 3 && result.stock != 0) {
                indicator = 'warning';
            }
            if (result.stock <= 0) {
                indicator = 'danger';
            }
            searchResultsHTML += `
                        <p class="stock"><i class="fas fa-box stock-indicator${indicator}"></i> ${result.stock} in stock</p>
                            </div>
                            <button class="btn primary add-to-cart" data-gameid="${result.id}">Add to cart</button>
                        </div>
                    </div>
                </li>`;
        });
        searchResultsHTML += '</ul>';
    }
    searchResultsContainer.innerHTML = searchResultsHTML;
}

function renderGames() {
    const gamesContainer = document.querySelector('.product__list');
    let gamesHTML = '';
    PRODUCTS.map((product) => {
        gamesHTML += `
        <li class="product__card">
            <img
                class="product__image"
                src=${product.image}
                alt=""
                data-gameid="${product.id}"
            />
            <div class="product__header">
                <a href="/game.html?gameid=${product.id}">
                    <h3 class="product__title">${product.title}</h3>
                </a>
                <button class="wishlist-btn sm" data-active="false" data-gameid="${product.id}">
                        <svg class="wishlist-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.05 448.77" >
                            <path class="wishlist-toggle-full" d="M458.35,65c-57.8-48.6-147.1-41.3-202.4,15-55.3-56.3-144.6-63.7-202.4-15-75.2,63.3-64.2,166.5-10.6,221.2l175.4,178.7a52.52,52.52,0,0,0,75.2.1L469,286.25C522.45,231.55,533.65,128.35,458.35,65Z" transform="translate(0.05 -31.98)" />
                            <path class="wishlist-toggle-line" d="M458.4,64.3C400.6,15.7,311.3,23,256,79.3,200.7,23,111.4,15.6,53.6,64.3-21.6,127.6-10.6,230.8,43,285.5L218.4,464.2a52.52,52.52,0,0,0,75.2.1L469,285.6C522.5,230.9,533.7,127.7,458.4,64.3ZM434.8,251.8,259.4,430.5c-2.4,2.4-4.4,2.4-6.8,0L77.2,251.8c-36.5-37.2-43.9-107.6,7.3-150.7,38.9-32.7,98.9-27.8,136.5,10.5l35,35.7,35-35.7c37.8-38.5,97.8-43.2,136.5-10.6,51.1,43.1,43.5,113.9,7.3,150.8Z" transform="translate(0.05 -31.98)" />
                        </svg>
                        <span class="sr-only">Add to wishlist</span>
                </button>
            </div>
            <div class="product__footer">
                <p class="product__price">${product.price} kr</p>
                <button class="add-to-cart" data-gameid="${product.id}">
                Add to basket
                </button>
            </div>
        </li>`;
    });
    gamesContainer.innerHTML = gamesHTML;
}

function renderSingleGame() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const gameID = parseInt(params.gameid);
    if (gameID < 1) {
        window.location.replace('/games.html');
    }
    const gameIndex = PRODUCTS.findIndex((x) => x.id === gameID);
    const game = PRODUCTS[gameIndex];
    document.title = `${game.title} | Gamehub - The universe of games`;

    const gameContainer = document.querySelector('.single-game');
    let gameHTML = `
        <div class="product-image">
            <img src="${game.image}" alt="${game.title} cover">
        </div>
        <div class="product-body">
        <div class='flex'>
            <h1 class="mb0">${game.title}</h1>
            <button class="wishlist-btn" data-active="false" data-gameid="${game.id}">
                <svg class="wishlist-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.05 448.77" >
                    <path class="wishlist-toggle-full" d="M458.35,65c-57.8-48.6-147.1-41.3-202.4,15-55.3-56.3-144.6-63.7-202.4-15-75.2,63.3-64.2,166.5-10.6,221.2l175.4,178.7a52.52,52.52,0,0,0,75.2.1L469,286.25C522.45,231.55,533.65,128.35,458.35,65Z" transform="translate(0.05 -31.98)" />
                    <path class="wishlist-toggle-line" d="M458.4,64.3C400.6,15.7,311.3,23,256,79.3,200.7,23,111.4,15.6,53.6,64.3-21.6,127.6-10.6,230.8,43,285.5L218.4,464.2a52.52,52.52,0,0,0,75.2.1L469,285.6C522.5,230.9,533.7,127.7,458.4,64.3ZM434.8,251.8,259.4,430.5c-2.4,2.4-4.4,2.4-6.8,0L77.2,251.8c-36.5-37.2-43.9-107.6,7.3-150.7,38.9-32.7,98.9-27.8,136.5,10.5l35,35.7,35-35.7c37.8-38.5,97.8-43.2,136.5-10.6,51.1,43.1,43.5,113.9,7.3,150.8Z" transform="translate(0.05 -31.98)" />
                </svg>
                <span class="sr-only">Add to wishlist</span>
            </button>
        </div>
        <div class="reviews">
            <div class="review-container">
            <div class="rating-stars" style="--rating: ${game.rating}" role="tooltip" aria-label="${game.title} has a rating of ${game.rating} out of 5."></div>
            <div class="rating">${game.rating}</div>
        </div>
            <a href="/review.html">Write a review</a>
        </div>
        <p>${game.desciption}</p>
        <div class="buy-product">
            <div class="price-stock">
            <p class="price">${game.price} kr</p>
    `;
    let indicator = '';
    if (game.stock < 3 && game.stock != 0) {
        indicator = 'warning';
    }
    if (game.stock <= 0) {
        indicator = 'danger';
    }
    gameHTML += `
            <p class="stock"><i class="fas fa-box stock-indicator${indicator}"></i> ${game.stock} in stock</p>
        </div>
        <button class="btn primary add-to-cart" data-gameid="${game.id}">Add to cart</button>
            </div> <!-- end buy-product-->
            <div class="game-info">
            <table>
                <tr>
                <th>Platform:</th>
                    <td>
    `;
    game.platform.map((platform) => (gameHTML += `<li>${platform} </li>`));
    gameHTML += `
            </td>
        </tr>
        <tr>
        <th>Multiplayer:</th>
        <td>${game.multiplayer}</td>
        </tr>
        <tr>
        <th>Age Rating:</th>
        <td>${game.ageRating}</td>
        </tr>
        <tr>
        <th>Genre:</th>
            <td>`;
    game.grene.map((gr) => (gameHTML += `<li>${gr} </li>`));
    gameHTML += `
        </td>
    </tr>
    <tr>
      <th>Tags:</th>
      <td>`;
    game.tags.map((tag) => (gameHTML += `<li>${tag} </li>`));
    gameHTML += `
            </td>
        </tr>
        <tr>
        <th>Relase date:</th>
        <td>${game.relaseDate}</td>
        </tr>
    </table>
    </div> <!-- end game info -->
    </div> <!-- product body -->`;

    gameContainer.innerHTML = gameHTML;
}

// UTILITY FUNCTIONS
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
    showToast('Game added to cart!', 'info');
}

function updateCartQty(gameId, qty) {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    if (!cartContent) return;
    if (qty === 0) {
        removeFromCart(gameId);
        renderCartItems();
        return;
    }
    const obj = cartContent.find((o) => o.id === gameId);
    obj.quantity = qty;
    sessionStorage.setItem('cart', JSON.stringify(cartContent));
    renderCartItems();
    updateCartBadge();
}

function removeFromCart(gameId) {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    if (!cartContent || cartContent.length === 0) return;
    const i = cartContent.findIndex((o) => o.id === gameId);
    if (i < 0) return;
    cartContent.splice(i, 1);
    sessionStorage.setItem('cart', JSON.stringify(cartContent));
    renderCartItems();
    updateCartBadge();
    showToast('Game removed from cart!', 'error');
}

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
        showToast('Game removed from wishlist!', 'error');
    } else {
        wishlist.push(+id);
        showToast('Game added to wishlist!', 'success');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    if (currentLocation === '/wishlist.html') {
        renderWishlistItems();
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

// INVOKE THE PAGE RELATED FUNCTIONS
if (currentLocation === '/basket.html') {
    renderCartItems();
    enableRemoveFromCartButtons();
}
if (currentLocation === '/wishlist.html') {
    renderWishlistItems();
}
if (currentLocation === '/search.html') {
    uptateSearchPageTitleAndSearchBox();
    renderSearchResults();
}
if (currentLocation === '/games.html') {
    renderGames();
}
if (currentLocation === '/game.html') {
    renderSingleGame();
}
enableMenuButtons();
enableAddToCartButtons();
enableWishlistButtons();
productImageEventlistner();
updateCartBadge();
updateWishlistBadge();
