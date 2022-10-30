import { endpoint, key, secretKey } from './apiClient.js';
import {
    updateWishlistBadge,
    enableAddToCartButtons,
    productImageEventlistner,
    enableWishlistButtons,
    getValueFromURLParameter,
    setUrlParameterWithoutReload,
    updateCartBadge,
    loadingSpinner,
    enableMenuButtons,
} from './utils.js';

async function getAllCategories() {
    try {
        const response = await fetch(`${endpoint}/products/categories?${key}&${secretKey}`);
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Failed to get categories. ', error);
    }
}

async function getGamesByCategory(categoryID) {
    try {
        const response = await fetch(`${endpoint}/products?category=${categoryID}&${key}&${secretKey}`);
        const filteredGames = await response.json();
        return filteredGames;
    } catch (error) {
        console.error(`Failed to fetch games with the ID ${categoryID}`, error);
        showToast('Failed to fetch games', 'error');
    }
}

async function getAllGames() {
    try {
        const response = await fetch(`${endpoint}/products?${key}&${secretKey}`);
        const allGames = await response.json();
        return allGames;
    } catch (error) {
        console.error('Failed to fetch all games', error);
        showToast('Failed to fetch games', 'error');
    }
}

async function loadGamesPage() {
    const categoryID = getValueFromURLParameter('category');
    const filterSelect = document.getElementById('category-filter');
    const categories = await getAllCategories();

    filterSelect.innerHTML = '<option value="0"> - All Grenes - </option>';
    categories.forEach((category) => {
        filterSelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });
    const filterOptions = document.querySelectorAll('#category-filter option');
    filterOptions.forEach((option) => {
        option.removeAttribute('selected');
        if (option.value === categoryID) {
            option.selected = true;
        }
    });
    filterSelect.addEventListener('change', (e) => updateGamesList(e.target.value));

    if (
        categoryID === null ||
        categoryID === '0' ||
        categoryID === 0 ||
        categoryID === 'null' ||
        categoryID === 'undefined'
    ) {
        const allGames = await getAllGames();
        renderGamesList(allGames);
    } else {
        const filteredGames = await getGamesByCategory(categoryID);
        renderGamesList(filteredGames);
    }
}

async function updateGamesList(categoryID) {
    loadingSpinner(document.querySelector('.product__list'));
    setUrlParameterWithoutReload('category', categoryID);

    if (
        categoryID === null ||
        categoryID === '0' ||
        categoryID === 0 ||
        categoryID === 'null' ||
        categoryID === 'undefined'
    ) {
        const allGames = await getAllGames();
        renderGamesList(allGames);
    } else {
        const filteredGames = await getGamesByCategory(categoryID);
        renderGamesList(filteredGames);
    }
}

function renderGamesList(games) {
    const gamesContainer = document.querySelector('.product__list');
    if (games.length === 0) {
        gamesContainer.innerHTML = '<p>No games found</p>';
        return;
    }
    let gamesHTML = '';
    games.map((game) => {
        gamesHTML += `
        <li class="product__card">
            <img
                class="product__image"
                src=${game.images[0].src}
                alt=""
                data-gameid="${game.id}"
            />
            <div class="product__header">
                <a href="/game.html?gameid=${game.id}">
                    <h3 class="product__title">${game.name}</h3>
                </a>
                <button class="wishlist-btn sm" data-active="false" data-gameid="${game.id}">
                        <svg class="wishlist-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.05 448.77" >
                            <path class="wishlist-toggle-full" d="M458.35,65c-57.8-48.6-147.1-41.3-202.4,15-55.3-56.3-144.6-63.7-202.4-15-75.2,63.3-64.2,166.5-10.6,221.2l175.4,178.7a52.52,52.52,0,0,0,75.2.1L469,286.25C522.45,231.55,533.65,128.35,458.35,65Z" transform="translate(0.05 -31.98)" />
                            <path class="wishlist-toggle-line" d="M458.4,64.3C400.6,15.7,311.3,23,256,79.3,200.7,23,111.4,15.6,53.6,64.3-21.6,127.6-10.6,230.8,43,285.5L218.4,464.2a52.52,52.52,0,0,0,75.2.1L469,285.6C522.5,230.9,533.7,127.7,458.4,64.3ZM434.8,251.8,259.4,430.5c-2.4,2.4-4.4,2.4-6.8,0L77.2,251.8c-36.5-37.2-43.9-107.6,7.3-150.7,38.9-32.7,98.9-27.8,136.5,10.5l35,35.7,35-35.7c37.8-38.5,97.8-43.2,136.5-10.6,51.1,43.1,43.5,113.9,7.3,150.8Z" transform="translate(0.05 -31.98)" />
                        </svg>
                        <span class="sr-only">Add to wishlist</span>
                </button>
            </div>
            <div class="product__footer">
                <p class="product__price">${game.price} kr</p>
                <button class="add-to-cart" data-gameid="${game.id}">
                Add to basket
                </button>
            </div>
        </li>`;
    });
    gamesContainer.innerHTML = gamesHTML;
    enableAddToCartButtons();
    enableWishlistButtons();
    updateWishlistBadge();
    productImageEventlistner();
}

loadGamesPage();
updateCartBadge();
enableMenuButtons();
