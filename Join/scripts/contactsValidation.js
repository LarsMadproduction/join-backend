function validateContactInputs(email, name) {
  let isEmailValid = validateEmail(email);
  let isNameValid = validateName(name);

  let isValid = isEmailValid && isNameValid;

  if (!isValid) {
    throw new Error("Error in validation");
  }
  return true;
}

/**
 * Validates the email input for uniqueness and correct format.
 *
 * @param {string} email - User's email address
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @returns {Boolean} True if email is valid, false otherwise
 */
function validateEmail(email) {
  let emailField = document.getElementById("contact_email");
  let noticeField = document.getElementById("field_alert_email");

  if (!checkEmailFormat(email, noticeField, emailField)) {
    return false;
  }

  return true;
}

/**
 * Validates the format of an email address.
 *
 * @param {string} email - The email address to validate
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} emailField - The email input field element
 * @returns {Boolean} True if the email format is valid, false otherwise
 */
function checkEmailFormat(email, noticeField, emailField) {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format.");
    emailField.classList.add("error");
    noticeField.innerHTML += `<div>Please enter a valid email address.</div>`;
    return false;
  }
  return true;
}

/**
 * Validates the user's name input.
 *
 * @param {string} name - The name to validate
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @returns {Boolean} True if the name is valid, false otherwise
 */
function validateName(name) {
  let isValidName = true;
  let nameField = document.getElementById("contact_name");
  let noticeField = document.getElementById("field_alert_name");

  if (!checkNameNotEmpty(name, noticeField, nameField)) {
    isValidName = false;
  }

  if (!checkNameCharacters(name, noticeField, nameField)) {
    isValidName = false;
  }

  return isValidName;
}

/**
 * Checks if the name input is not empty and has at least 3 characters.
 *
 * @param {string} name - The name to check
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} nameField - The name input field element
 * @returns {Boolean} True if the name is not empty and has at least 3 characters, false otherwise
 */
function checkNameNotEmpty(name, noticeField, nameField) {
  if (name.trim().length < 3) {
    nameField.classList.add("error");
    noticeField.innerHTML += `<div>Please enter a name with at least 3 letters.</div>`;
    return false;
  }
  return true;
}

/**
 * Checks if the name contains only valid characters (letters and spaces).
 *
 * @param {string} name - The name to check
 * @param {HTMLElement} noticeField - Element to display validation notices
 * @param {HTMLElement} nameField - The name input field element
 * @returns {Boolean} True if the name contains only valid characters, false otherwise
 */
function checkNameCharacters(name, noticeField, nameField) {
  let nameRegex = /^[A-Za-zÄäÖöÜüß\s]+$/;

  if (!nameRegex.test(name)) {
    nameField.classList.add("error");
    noticeField.innerHTML += `<div>Your name should only contain letters and spaces.</div>`;
    return false;
  }
  return true;
}

/**
 * Checks if the legal acceptance checkbox is checked.
 *
 * @returns {Boolean} True if the checkbox is checked, false otherwise
 */
function getContactInitials(name) {
  let words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  if (words.length >= 2) {
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }
}
