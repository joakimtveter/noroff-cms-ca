/**
 *  Validates the if an email is valid.
 * @param {email} email - The email to validate.
 * @returns {boolean} - Whether or not the email is valid.
 */
const validateEmail = (email) => {
    const regex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
};

/**
 *  Validates the minimum length of a string.
 * @param {string} string - The string to validate.
 * @param {number} minLength - The minimum number of characters.
 * @returns {boolean} - Whether or not the string has above the minimum characters.
 */
const validateMinLength = (string, minLength) => {
    if (string && string.length >= minLength) {
        return true;
    } else {
        return false;
    }
};

export { validateEmail, validateMinLength };
