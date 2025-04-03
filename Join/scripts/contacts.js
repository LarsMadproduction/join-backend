/**
 * Renders the contact list.
 */
async function renderContacts() {
  let contactList = await getContactList();

  renderContactsList(contactList);
}

/**
 * Groups contacts by their initials.
 */
async function getContactList() {
  let userContacts = await filterUserContacts();

  return userContacts.reduce((arr, contact) => {
    if (contact && contact.initials) {
      let firstInitial = contact.initials.charAt(0).toUpperCase();
      if (!arr[firstInitial]) {
        arr[firstInitial] = [];
      }
      arr[firstInitial].push(contact);
    }
    return arr;
  }, {});
}

/**
 * Filters the contacts of the active user.
 */
async function filterUserContacts() {
  let contacts = await fetchData("users");

  let userContacts = contacts.filter((contact) =>
    activeUser.contacts.includes(contact.id)
  );

  return userContacts;
}

/**
 * Renders the grouped contact list.
 * @param {Object} contactList - Contacts grouped by initials.
 */
function renderContactsList(contactList) {
  let contactListContainer = document.getElementById("contact_list");
  contactListContainer.innerHTML = "";

  initActiveUser(contactListContainer);
  initContacts(contactList, contactListContainer);
}

/**
 * Initializes the active user display in the contact list.
 * @param {HTMLElement} contactListContainer - The HTML element of the contact list.
 */
function initActiveUser(contactListContainer) {
  // activeUser.id = 0;

  let limitNameLength = limitTextLength(activeUser.name);
  let limitEmailLength = limitTextLength(activeUser.email);

  contactListContainer.innerHTML = generateActiveUserContact(
    activeUser,
    limitNameLength,
    limitEmailLength
  );
}

/**
 * Initializes the display of contacts.
 * @param {Object} contactList - Contacts grouped by initials.
 * @param {HTMLElement} contactListContainer - The HTML element of the contact list.
 */
function initContacts(contactList, contactListContainer) {
  let sortedInitials = Object.keys(contactList).sort();

  sortedInitials.forEach((initial) => {
    initLetterBox(initial, contactListContainer);
    renderContactsByInitial(contactList[initial], contactListContainer);
  });
}

/**
 * Creates a letter box in the contact list.
 * @param {string} initial - The initial letter for grouping.
 * @param {HTMLElement} contactListContainer - The HTML element of the contact list.
 */
function initLetterBox(initial, contactListContainer) {
  let letterBoxHtml = generateLetterBox(initial);
  contactListContainer.innerHTML += letterBoxHtml;
}

/**
 * Renders contacts for a specific initial.
 * @param {Array} contacts - List of contacts for the given initial.
 * @param {HTMLElement} contactListContainer - The HTML element of the contact list.
 */
function renderContactsByInitial(contacts, contactListContainer) {
  contacts.forEach((contact) => {
    let limitNameLength = limitTextLength(contact.name);
    let limitEmailLength = limitTextLength(contact.email);

    let contactHtml = generateContact(
      contact,
      limitNameLength,
      limitEmailLength
    );

    contactListContainer.innerHTML += contactHtml;
  });
}

/**
 * Limits the length of a text.
 * @param {string} text - The text to limit.
 * @param {number} [maxLength=15] - The maximum length.
 */
function limitTextLength(text, maxLength = 15) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

/**
 * Displays the contact information.
 * @param {number} contactId - The ID of the contact.
 */
async function displayContactInfo(contactId) {
  let contact = await getContact(contactId);
  let contactInfoContainer = document.getElementById("contact_info_box");
  contactInfoContainer.innerHTML = generateContactInfo(contact);

  designeUserInitial(contact);
  highlightContact(contact);
  toggleContactInfo();
}

/**
 * Retrieves contact data by ID.
 * @param {number} contactId - The ID of the contact.
 */
async function getContact(contactId) {
  if (contactId === 0) {
    return activeUser;
  } else {
    let contacts = await fetchData("users");
    let contact = contacts.find((c) => c && c.id === contactId);
    return contact;
  }
}

/**
 * Applies specific styles to the active user's initials.
 * @param {Object} contact - The contact data.
 */
function designeUserInitial(contact) {
  if (contact.id === 0) {
    document
      .getElementById("for_active_user")
      .classList.add("big-letter-circel-user");
    document.getElementById("user_delete_display_info").classList.add("d-none");
  } else {
    document.getElementById("user_edit_display_info").classList.add("d-none");
  }
}

/**
 * Highlights the selected contact.
 * @param {Object} contact - The contact to highlight.
 */
function highlightContact(contact) {
  let contactsContainer = document.getElementsByClassName("contact");

  for (let i = 0; i < contactsContainer.length; i++) {
    contactsContainer[i].classList.remove("is-selected");
  }
  document.getElementById(`contact${contact.id}`).classList.add("is-selected");
}

/**
 * Toggles the display of contact information.
 */
function toggleContactInfo() {
  let container = document.getElementById("contacts_content");
  container.classList.toggle("shifted");
}

/**
 * Clears all inputs and error messages in the form.
 */
function clearAddContactForm() {
  let nameInput = document.getElementById("contact_name");
  let emailInput = document.getElementById("contact_email");
  let phoneInput = document.getElementById("contact_phone");
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  clearError(nameInput, "field_alert_name");
  clearError(emailInput, "field_alert_email");
}

/**
 * Removes error messages and styles from an input field.
 * @param {HTMLElement} inputElement - The input field.
 * @param {string} alertElementId - The ID of the error message element.
 */
function clearError(inputElement, alertElementId) {
  let alertElement = document.getElementById(alertElementId);
  alertElement.innerText = "";
  inputElement.classList.remove("error");
}

/**
 * Creates a new contact.
 */
async function createContact() {
  resetAlert(
    "contact_name",
    "contact_email",
    "field_alert_name",
    "field_alert_email"
  );

  let nameInput = document.getElementById("contact_name").value.trim();
  let emailInput = document.getElementById("contact_email").value.trim();
  let phoneInput = document.getElementById("contact_phone").value.trim();
  let initials = getContactInitials(nameInput);

  await createContactProcess(nameInput, emailInput, phoneInput, initials);
  renderContacts();
}

/**
 * Resets error alerts in the contact form.
 * @param {string} inputName - The ID of the name input field.
 * @param {string} inputEmail - The ID of the email input field.
 * @param {string} alertName - The ID of the name error element.
 * @param {string} alertEmail - The ID of the email error element.
 */
function resetAlert(inputName, inputEmail, alertName, alertEmail) {
  let nameInputContent = document.getElementById(inputName);
  let emailInputContent = document.getElementById(inputEmail);

  clearError(nameInputContent, alertName);
  clearError(emailInputContent, alertEmail);
}

/**
 * Processes the creation of a new contact.
 * @param {string} nameInput - The contact's name.
 * @param {string} emailInput - The contact's email.
 * @param {string} phoneInput - The contact's phone number.
 * @param {string} initials - The contact's initials.
 */
async function createContactProcess(
  nameInput,
  emailInput,
  phoneInput,
  initials
) {
  validateContactInputs(emailInput, nameInput);

  await addContact(nameInput, emailInput, phoneInput, initials);

  clearAddContactForm();

  await openDialogSuccessfully("created");

  toggleOverlay("dialog_contacts_overlay");
}

/**
 * Adds a new contact.
 * @param {string} nameInput - The contact's name.
 * @param {string} emailInput - The contact's email.
 * @param {string} phoneInput - The contact's phone number.
 * @param {string} initials - The contact's initials.
 */
async function addContact(nameInput, emailInput, phoneInput, initials) {
  // let contactId = await getNewId("users");

  await postNewContact(nameInput, emailInput, phoneInput, initials);

  // addContactToUser(nameInput, emailInput, initials);
}

/**
 * Posts a new contact to the database.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {number} contactId - The new contact's ID.
 * @param {string} initials - The contact's initials.
 */
async function postNewContact(name, email, phone, initials) {
  let contactData = {
    // id: contactId,
    name: name,
    email: email,
    phone: phone,
    color: generateRandomColor(),
    initials: initials,
  };

  await postData(`contacts/`, contactData);
}

/**
 * Adds a contact to the active user.
 * @param {number} contactId - The ID of the contact to add.
 */
async function addContactToUser(name, email, initials) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));

  if (!activeUser.contacts.includes(contactId)) {
    activeUser.contacts.push(contactId);
    localStorage.setItem("activeUser", JSON.stringify(activeUser));

    if (activeUser !== 0) {
      let path = `users/${activeUser.id}/`;
      let contactData = {
        email: email,
        initials: initials,
        name: name,
        contacts: contactId,
      };
      await postData(path, contactData);
    }
  }
}

/**
 * Opens a dialog displaying a success message.
 * @param {string} operation - The type of operation ("created", "deleted", "edit").
 */
function openDialogSuccessfully(operation) {
  return new Promise((resolve) => {
    let overlay = document.getElementById("succesfully_created");
    overlay.innerHTML = generateContactFeedback(operation);
    overlay.classList.remove("d-none");
    overlay.classList.add("active");

    setTimeout(() => {
      overlay.classList.add("visible");
      setTimeout(() => {
        overlay.classList.remove("active", "visible");
        overlay.classList.add("d-none");
        resolve();
      }, 1500);
    }, 50);
  });
}

/**
 * Opens the edit contact dialog.
 * @param {number} contactId - The ID of the contact to edit.
 */
async function openEditContact(contactId) {
  toggleOverlay("dialog_edit_overlay");
  let contact = await getContact(contactId);

  await loadEditContactForm(contact);

  getEditContactData(contact);
}

/**
 * Loads the edit contact form.
 * @param {Object} contact - The contact data.
 */
function loadEditContactForm(contact) {
  let editForm = document.getElementById("dialog_edit_contacts_overlay");
  editForm.innerHTML = generateEditContactDialog(contact);
}

/**
 * Populates the edit contact form with contact data.
 * @param {Object} contact - The contact data.
 */
async function getEditContactData(contact) {
  let name = document.getElementById("input_edit_name");
  let email = document.getElementById("input_edit_email");
  let phone = document.getElementById("input_edit_phone");

  name.value = "";
  email.value = "";
  phone.value = "";

  name.value = contact.name;
  email.value = contact.email;
  phone.value = contact.phone;
}

/**
 * Opens the delete dialog and adds the "YES" button.
 * @param {number} contactId - The ID of the contact to delete.
 */
function openDeleteDialog(contactId) {
  toggleOverlay("contact_delete_overlay");

  let yesButton = document.getElementById("delete_yes_btn_contact");
  yesButton.innerHTML = generateDeleteButton(contactId);
}

/**
 * Deletes a contact and refreshes the contact list.
 * @param {number} contactId - The ID of the contact to delete.
 */
async function deleteContact(contactId) {
  await deleteContactInData(contactId);
  await openDialogSuccessfully("deleted");
  document.getElementById("contact_info_box").innerHTML = "";
  toggleOverlay("contact_delete_overlay");
  renderContacts();
}

/**
 * Deletes all data of a contact.
 * @param {number} contactId - The ID of the contact to delete.
 */
async function deleteContactInData(contactId) {
  let users = await fetchData("users");
  await deleteContactOnlyforUser(contactId, users);
  // await deleteContactforAllUsers(contactId);
  // await deleteContactFromTasks(contactId);
  deleteContactInLocalStorage(contactId);
}

/**
 * Deletes a contact only from the active user's list.
 * @param {number} contactId - The ID of the contact.
 */
async function deleteContactOnlyforUser(contactId) {
  console.log("Deleting contact ID:", contactId, "from active user:", activeUser);

  if (!activeUser || !activeUser.id || !Array.isArray(activeUser.contacts)) {
    console.error("Active user data is invalid:", activeUser);
    return;
  }

  const updatedContacts = activeUser.contacts.filter(id => id !== contactId);

  const updatedUser = { ...activeUser, contacts: updatedContacts };

  console.log("Updated user object:", updatedUser);

  await putData(`users/${activeUser.id}/`, updatedUser);
}




/**
 * Deletes a contact from all tasks.
 * @param {number} contactId - The ID of the contact.
 */
async function deleteContactFromTasks(contactId) {
  let allTasks = await fetchData("tasks");
  let updatedTasks = allTasks.map((task) => {
    if (task.assigned && Array.isArray(task.assigned)) {
      return {
        ...task,
        assigned: task.assigned.filter((id) => id !== contactId),
      };
    }
    return task;
  });
  await postData("tasks", updatedTasks);
}

/**
 * Deletes a contact from all users' data.
 * @param {number} contactId - The ID of the contact.
 * @param {Array} users - Array of all users.
 */
async function deleteContactforAllUsers(contactId, users) {
  await deleteData("users", contactId);
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => ({
    ...user,
    contacts: user.contacts.filter((contact) => contact !== contactId),
  }));
  await postData("users", users);
}

/**
 * Removes a contact from the active user's local storage.
 * @param {number} contactId - The ID of the contact.
 */
function deleteContactInLocalStorage(contactId) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.contacts = activeUser.contacts.filter(
    (contact) => contact !== contactId
  );
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

/**
 * Edits a contact's information.
 * @param {number} contactId - The ID of the contact to edit.
 */
async function editContact(contactId) {
  resetAlert(
    "input_edit_name",
    "input_edit_email",
    "edit_field_alert_name",
    "edit_field_alert_email"
  );

  let nameInput = document.getElementById("input_edit_name").value.trim();
  let emailInput = document.getElementById("input_edit_email").value.trim();
  let phoneInput = document.getElementById("input_edit_phone").value.trim();
  let initials = getContactInitials(nameInput);

  if (contactId === 0) {
    await editUserProcess(nameInput, emailInput, phoneInput, initials);
  } else {
    await editContactProcess(
      nameInput,
      emailInput,
      phoneInput,
      initials,
      contactId
    );
  }

  await openDialogSuccessfully("edit");
  await displayContactInfo(contactId);
  toggleOverlay("dialog_edit_overlay");
  renderContacts();
}

/**
 * Processes editing of the active user's data.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} phone - The user's phone number.
 * @param {string} initials - The user's initials.
 */
async function editUserProcess(name, email, phone, initials) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  let userData = {
    ...activeUser,
    name: name,
    email: email,
    phone: phone,
    initials: initials,
  };

  localStorage.setItem("activeUser", JSON.stringify(userData));

  if (activeUser !== 0) {
    for (let [key, value] of Object.entries(userData)) {
      await putData(`users/${activeUser.id}/`, value);
    }
  }
}

/**
 * Processes editing of a contact's data.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initials - The contact's initials.
 * @param {number} contactId - The ID of the contact.
 */
async function editContactProcess(name, email, phone, initials, contactId) {
  let contact = await getContact(contactId);

  let contactData = {
    color: contact.color,
    name: name,
    email: email,
    phone: phone,
    initials: initials,
  };
  console.log(contactData);

  // for (let [key, value] of Object.entries(contactData)) {
  await putData(`contacts/${contact.id}/`, contactData);
  // }
}

/**
 * Opens the mobile menu for a contact.
 * @param {number} contactId - The ID of the contact.
 */
function openMobileMenu(contactId) {
  toggleOverlay("dialog_mobilemenue_overlay");
  let menuContainer = document.getElementById("mobile_menu");
  menuContainer.innerHTML = generateMobileMenu(contactId);
}
