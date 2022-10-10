/**
 * Shows aøert message on the top center of the screen
 *
 * @param {string} message - Message to display in the alert
 * @param {string} type  - Type of alert. Can be 'success', 'error', 'info', or 'warning'
 * @param {number} duration - Duration of the alert in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `<p>${message}</p>`;
    toastContainer.classList.add('toast-container');
    toastContainer.classList.add(type);
    document.body.appendChild(toastContainer);
    toastContainer.classList.add('active');

    setTimeout(() => {
        toastContainer.classList.remove('active');
    }, duration);
}

export { showToast };
