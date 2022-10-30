import { showToast } from './toast.js';
import { validateMinLength, validateEmail } from './formValidation.js';
import { enableMenuButtons, updateCartBadge } from './utils.js';

const contactForm = document.querySelector('.contact-form');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const reasonSelect = document.getElementById('reason');
const messageField = document.getElementById('message');
const termsInput = document.getElementById('terms');
const submitButton = document.getElementById('submit');
const formInputs = [nameField, emailField, reasonSelect, messageField, termsInput];

/**
 * Validates the contact form.
 * @param {object} data - Object of form values.
 * @param {string} data.name - Contact form name field.
 * @param {string} data.email - Contact form email field.
 * @param {string} data.reason - Contact form reason for contact select.
 * @param {string} data.message - Contact form message text area.
 * @param {string} data.terms - Contact form terms check box.
 * @returns {Object[]} - Array of error objects.
 */
const validateContactForm = (data) => {
    console.log('Validating contact form...', data);
    let errors = [];
    if (validateMinLength(data.name, 0) === false) {
        errors.push({ field: 'name', message: 'Name is required.' });
    }
    if (validateMinLength(data.email, 0) === false) {
        errors.push({ field: 'email', message: 'Email is required.' });
    } else if (validateEmail(data.email) === false) {
        errors.push({ field: 'email', message: 'Email address is not valid.' });
    }
    if (validateMinLength(data.reason, 0) === false) {
        errors.push({ field: 'reason', message: 'Reason for contact is required.' });
    }
    if (validateMinLength(data.message, 15) === false) {
        errors.push({ field: 'message', message: 'Message must be at least 15 characters long.' });
    }
    if (data.terms === false) {
        errors.push({ field: 'terms', message: 'You must approve the terms and conditions' });
    }
    return errors;
};

/**
 * Runs if the form is validated ok. Displays a success message.
 */
const formSubmissionSuccess = () => {
    formInputs.forEach((input) => {
        input.classList.remove('error');
        input.value = '';
        document.querySelector(`#${input.id}-error`).innerText = '';
    });
    if (document.querySelector('.error-list')) {
        document.querySelector('.error-list').remove();
    }
    showToast('Form submission was successful!', 'success');
};

/**
 * Runs if the form is not validated ok. Displays an error message.
 * @param {Object[]} errors - Array of error objects.
 */
const formSubmissionFail = (errorsArr) => {
    console.error('Failed to submit form! Errors: ', errorsArr);
    let errors = '';
    errorsArr.forEach((error) => {
        errors += `<li>${error.message}</li>`;
    });
    let errorFields = [];
    errorsArr.map((error) => {
        errorFields.push(error.field);
    });
    if (document.querySelector('.error-list')) {
        document.querySelector('.error-list').remove();
    }
    const errorList = document.createElement('ul');
    errorList.classList.add('error-list');
    errorList.innerHTML = errors;
    contactForm.prepend(errorList);
    formInputs.forEach((input) => {
        input.classList.remove('error');
        document.querySelector(`#${input.id}-error`).innerText = '';
        if (errorFields.includes(input.id)) {
            input.classList.add('error');
            const errorMessage = errorsArr.find((error) => {
                return error.field === input.id;
            });
            document.querySelector(`#${input.id}-error`).innerText = errorMessage.message;
        }
    });
    showToast('Failed to submitt contact form', 'error');
};

/**
 * Handles the submittion of the contact form.
 * @param {object} event - The event object.
 */
const handleContactFormSubmit = (event) => {
    event.preventDefault();
    const name = nameField.value.trim() || '';
    const email = emailField.value.trim() || '';
    const reason = reasonSelect.value.trim() || '';
    const message = messageField.value.trim() || '';
    const terms = termsInput.checked;
    let errors = [];
    let data = { name, email, reason, message, terms };
    errors = validateContactForm(data);
    if (errors.length > 0) {
        formSubmissionFail(errors);
    } else {
        formSubmissionSuccess();
    }
};

submitButton.addEventListener('click', (e) => handleContactFormSubmit(e));

enableMenuButtons();
updateCartBadge();
