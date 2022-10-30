import { endpoint, key, secretKey } from './apiClient.js';
import {
    updateWishlistBadge,
    enableAddToCartButtons,
    productImageEventlistner,
    enableWishlistButtons,
    updateCartBadge,
    enableMenuButtons,
} from './utils.js';
import { showToast } from './toast.js';

async function loadSingleGamePage() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    if (!params.gameid) {
        console.error('No game id provided');
        window.location.replace('/games.html');
        return;
    }

    try {
        const response = await fetch(`${endpoint}/products/${params.gameid}?${key}&${secretKey}`);
        const game = await response.json();
        renderSingleGame(game);
    } catch (error) {
        showToast('Failed to fetch games', 'error');
        console.error(error);
        // window.location.replace('/404.html');
    }
}

function renderSingleGame(game) {
    document.title = `${game.name} | Gamehub - The universe of games`;
    const gameContainer = document.querySelector('.single-game');

    let ageRating = 'Not listed';
    if (game.attributes.find((attr) => attr.name === 'AgeRating')) {
        ageRating = game?.attributes?.find((attr) => attr.name === 'AgeRating').options[0];
    }

    let multiplayer = 'Not listed';
    if (game.attributes.find((attr) => attr.name === 'Multiplayer')) {
        multiplayer = game.attributes.find((attr) => attr.name === 'Multiplayer').options.join(', ');
    }

    let gameHTML = `
        <div class="product-image">
            <img src="${game.images[0].src}" alt="${game.name} cover">
        </div>
        <div class="product-body">
        <div class='flex'>
            <h1 class="mb0">${game.name}</h1>
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
            <div class="rating-stars" style="--rating: ${game.average_rating}" role="tooltip" aria-label="${game.name} has a rating of ${game.average_rating} out of 5."></div>
            <div class="rating">${game.average_rating}</div>
        </div>
            <a href="/review.html?gameid=${game.id}">Write a review</a>
        </div>
        <p>${game.description}</p>
        <div class="buy-product">
            <div class="price-stock">
            <p class="price">${game.price} kr</p>
    `;
    let indicator = '';
    if (game.stock_quantity < 3 && game.stock_quantity != 0) {
        indicator = 'warning';
    }
    if (game.stock_quantity <= 0) {
        indicator = 'danger';
    }
    gameHTML += `
            <p class="stock"><i class="fas fa-box stock-indicator ${indicator}"></i> ${game.stock_quantity} in stock</p>
        </div>
        <button class="btn primary add-to-cart" data-gameid="${game.id}">Add to cart</button>
            </div> <!-- end buy-product-->
            <div class="game-info">
            <table>
        <tr>
        <th>Multiplayer:</th>
        <td>${multiplayer}</td>
        </tr>
        <tr>
        <th>Age Rating:</th>
        <td> ${ageRating} </td>
        </tr>
        <tr>
        <th>Genre:</th>
            <td>
    ${game.categories.map((category) => `<span class="tag">${category.name}</span>`).join(', ') || 'Not listed'}
        </td>
    </tr>
    <tr>
      <th>Tags:</th>
      <td>
        ${game.tags.map((tag) => `<span class="tag">${tag.name}</span>`).join(', ') || 'Not listed'}
      </td>
        </tr>
        <tr>
        <th>Relase date:</th>
        <td>${new Date(game.date_created).toLocaleDateString() || 'Not listed'}</td>
        </tr>
    </table>
    </div> <!-- end game info -->
    </div> <!-- product body -->`;

    gameContainer.innerHTML = gameHTML;
    productImageEventlistner();
    updateCartBadge();
    enableAddToCartButtons();
    enableWishlistButtons();
    updateWishlistBadge();
}

loadSingleGamePage();
updateCartBadge();
enableMenuButtons();
