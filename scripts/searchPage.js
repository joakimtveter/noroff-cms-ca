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

function getSearchTerm() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    return searchTerm;
}

function uptateSearchPageTitleAndSearchBox(searchTerm) {
    document.title = `Search results for ${searchTerm} | Gamehub - The universe of games`;
    document.querySelector('#searchbox').setAttribute('value', searchTerm);
}

async function loadSearchResults() {
    const searchTerm = getSearchTerm();

    try {
        const response = await fetch(`${endpoint}/products?search=${searchTerm}&${key}&${secretKey}`);
        const searchResult = await response.json();
        uptateSearchPageTitleAndSearchBox(searchTerm);
        renderSearchResults(searchResult, searchTerm);
        enableAddToCartButtons();
        enableWishlistButtons();
        updateWishlistBadge();
        productImageEventlistner();
    } catch (error) {
        console.error(error);
        showToast('Error loading search results', 'error');
    }
}

function renderSearchResults(searchResult, term) {
    const searchResultsContainer = document.getElementById('search-results');
    let searchResultsHTML = `<p>Your search for "${term}" gave ${searchResult.length} results...</p>`;
    if (searchResult.length > 0) {
        searchResultsHTML += '<ul class="search-results">';
        searchResult.map((result) => {
            searchResultsHTML += `
                <li class="card-large">
                    <img class="product-image" src="${result.images[0].src}" alt="${result.name} cover" />
                    <div class="card-body">
                        <div class="flex flex-center">
                            <a href="/game.html?${result.id}"><h2 class="title">${result.name}</h2></a>
                            <button class="wishlist-btn sm" data-active="false" data-gameid="${result.id}">
                                <svg class="wishlist-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.05 448.77" >
                                    <path class="wishlist-toggle-full" d="M458.35,65c-57.8-48.6-147.1-41.3-202.4,15-55.3-56.3-144.6-63.7-202.4-15-75.2,63.3-64.2,166.5-10.6,221.2l175.4,178.7a52.52,52.52,0,0,0,75.2.1L469,286.25C522.45,231.55,533.65,128.35,458.35,65Z" transform="translate(0.05 -31.98)" />
                                    <path class="wishlist-toggle-line" d="M458.4,64.3C400.6,15.7,311.3,23,256,79.3,200.7,23,111.4,15.6,53.6,64.3-21.6,127.6-10.6,230.8,43,285.5L218.4,464.2a52.52,52.52,0,0,0,75.2.1L469,285.6C522.5,230.9,533.7,127.7,458.4,64.3ZM434.8,251.8,259.4,430.5c-2.4,2.4-4.4,2.4-6.8,0L77.2,251.8c-36.5-37.2-43.9-107.6,7.3-150.7,38.9-32.7,98.9-27.8,136.5,10.5l35,35.7,35-35.7c37.8-38.5,97.8-43.2,136.5-10.6,51.1,43.1,43.5,113.9,7.3,150.8Z" transform="translate(0.05 -31.98)" />
                                </svg>
                                <span class="sr-only">Add to wishlist</span>
                            </button>
                        </div>
                        <div class="reviews">
                            <div class="review-container dark">
                                <div class="rating-stars" style="--rating: ${result.average_rating}" role="tooltip" aria-label="${result.name} has a rating of ${result.average_rating} out of 5."></div>
                                <div class="rating">${result.average_rating}</div>
                            </div>
                            <a href="/review.html?${result.id}">Write a review</a>
                        </div>
                            <p>${result.description}</p>
                        </div>
                        <div class="buy-product">
                            <div class="price-stock">
                                <p class="price">${result.price} kr</p>`;
            let indicator = '';
            if (result.stock_quantity < 3 && result.stock_quantity != 0) {
                indicator = 'warning';
            }
            if (result.stock_quantity <= 0) {
                indicator = 'danger';
            }
            searchResultsHTML += `
                                <p class="stock">
                                    <i class="fas fa-box stock-indicator ${indicator}"></i> 
                                    ${result.stock_quantity} in stock
                                </p>
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

loadSearchResults();
updateCartBadge();
enableMenuButtons();
