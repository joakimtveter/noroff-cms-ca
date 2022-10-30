import { endpoint, key, secretKey } from './apiClient.js';
import { productImageEventlistner, updateCartBadge, enableMenuButtons } from './utils.js';
import { showToast } from './toast.js';

function enableRemoveFromCartButtons() {
    document.querySelectorAll('.remove-from-cart-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            removeFromCart(parseInt(e.currentTarget.dataset.gameid), true);
        });
    });
}

function handleUpdateCartQty(e) {
    if (e.target.value === '') return;
    updateCartQty(+e.target.attributes['data-gameid'].value, +e.target.value);
}

function updateCartQty(gameId, qty) {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    if (!cartContent) return;
    if (qty === 0) {
        removeFromCart(gameId);
        return;
    }
    const obj = cartContent.find((o) => o.id === gameId);
    obj.quantity = qty;
    sessionStorage.setItem('cart', JSON.stringify(cartContent));
    loadCart();
    updateCartBadge();
}

function removeFromCart(gameId) {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    if (!cartContent || cartContent.length === 0) return;
    const i = cartContent.findIndex((o) => o.id === gameId);
    if (i < 0) return;
    cartContent.splice(i, 1);
    sessionStorage.setItem('cart', JSON.stringify(cartContent));
    loadCart();
    updateCartBadge();
    showToast('Game removed from cart!', 'error');
}

async function loadCart() {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    const cart = document.getElementById('cart-body');
    const checkOutBtn = document.getElementById('check-out-btn');
    let cartItems = '';
    let cartTotal = 0;
    if (!cartContent || cartContent.length === 0) {
        cartItems =
            '<tr id="empty-cart"><td style="width: 100%; margin-block: 5rem; padding-left: 1rem;">The cart is empty!</td></tr>';
        cart.innerHTML = cartItems;
        document.querySelector('#cart-total').innerText = cartTotal + 'kr';
        checkOutBtn.classList.add('disabled');
        return;
    }
    try {
        const response = await fetch(`${endpoint}/products?${key}&${secretKey}`);
        const games = await response.json();

        const cartGames = games.filter((game) => {
            const gameInCart = cartContent.find((item) => item.id === game.id);
            if (gameInCart) {
                game.quantity = gameInCart.quantity;
                return true;
            }
            return false;
        });
        renderCartItems(cartGames);
        enableRemoveFromCartButtons();
        productImageEventlistner();
    } catch (error) {
        showToast('Failed to fetch games', 'error');
        console.error(error);
    }
}

function renderCartItems(itemsInCart) {
    const cart = document.getElementById('cart-body');
    let cartTotal = 0;
    let cartItems = '';

    itemsInCart.forEach((item) => {
        cartTotal += item.price * item.quantity;
        cartItems += `
        <tr>
          <td class="product-image-cell">
              <img
              class="product-image"
              src="${item?.images[0]?.src}"
              alt="Cover"
              height="150"
              data-gameid="${item.id}"
              />
          </td>
          <td class="product-item-cell">
              <h2 class="title">${item?.name}</h2>
          </td>
          <td class="product-qty-cell">
                <label for="qty-${item?.id}" class="sr-only">Quantity</label>
              <input 
                id="qty-${item?.id}" 
                class="cart-qty"
                type="number" 
                name="qty" 
                min="0"
                max="${item?.stock_quantity}" 
                value="${item?.quantity}" 
                data-gameid="${item?.id}"
              />
          </td>
          <td class="product-price-cell">${item.price} kr</td>
          <td class="product-total-cell">${item.price * item?.quantity} kr</td>
          <td class="product-delete-cell">
            <button class="remove-from-cart-btn" data-gameid="${item?.id}">
                <span class="sr-only">Remove ${item?.name} from the cart</span>
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

loadCart();
updateCartBadge();
enableMenuButtons();
