import { endpoint, key, secretKey } from './apiClient.js';
import {
    toggleWhishlist,
    enableAddToCartButtons,
    productImageEventlistner,
    updateCartBadge,
    enableMenuButtons,
} from './utils.js';
import { showToast } from './toast.js';

function enableRemoveFromWishlistButtons() {
    document.querySelectorAll('.remove-from-wishlist-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            toggleWhishlist(parseInt(e.currentTarget.dataset.gameid), true);
        });
    });
}

async function loadWishlist() {
    const wishlistContainer = document.getElementById('wishlist-container');
    let wishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (!wishlist || wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p style="width: 100%; margin-block: 5rem">The wishlist is empty!</p>';
        return;
    }

    try {
        const response = await fetch(`${endpoint}/products?${key}&${secretKey}`);
        const games = await response.json();
        const wishlistGames = games.filter((game) => wishlist.includes(game.id));
        renderWishlist(wishlistGames);
    } catch (error) {
        showToast('Failed to fetch games', 'error');
        console.error(error);
    }
}

function renderWishlist(wishlist) {
    const wishlistContainer = document.getElementById('wishlist-container');
    let wishlistItems = '';
    wishlist.forEach((game) => {
        wishlistItems += `
        <li>
            <div class="card-large">
                <img
                    class="product-image"
                    src="${game.images[0].src}"
                    alt="${game.name} Cover"
                    data-gameid="${game.id}"
                />
                <div class="card-body">
                    <div class="flex flex-center">
                    <h2 class="title"><a href="/game.html?gameid=${game.id}">${game.name}</a></h2>
                    </div>
                    <div class="reviews">
                        <div class="review-container dark">
                            <div
                                class="rating-stars"
                                style="--rating: ${game.average_rating}"
                                role="tooltip"
                                aria-label="${game.name} has a rating of ${game.average_rating} out of 5."
                            ></div>
                            <div class="rating">${game.average_rating}</div>
                        </div>
                        <a href="/review.html?gameid=${game.id}">Write a review</a>
                    </div>
                    <p>
                    ${game.description}
                    </p>
                </div>`;
        let indicator = '';
        if (game.stock_quantity < 3 && game.stock_quantity != 0) {
            indicator = 'warning';
        }
        if (game.stock_quantity <= 0) {
            indicator = 'danger';
        }
        wishlistItems += `
                <div class="buy-product">
                    <div class="price-stock">
                        <p class="price">${game.price} kr</p>
                        <p class="stock"><i class="fas fa-box stock-indicator ${indicator}"></i> ${game.stock_quantity} in stock</p>
                    </div>
                    <button class="btn primary add-to-cart dark" data-gameid="${game.id}"}>Add to cart</button>
                    <button class="link remove-from-wishlist-btn" data-gameid="${game.id}">Remove from wishlist</button>
                </div>
            </div>
        </li>
        `;
    });
    wishlistContainer.innerHTML = wishlistItems;

    enableAddToCartButtons();
    enableRemoveFromWishlistButtons();
    productImageEventlistner();
}

loadWishlist();
updateCartBadge();
enableMenuButtons();
