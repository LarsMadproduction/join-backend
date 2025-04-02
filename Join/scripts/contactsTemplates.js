/**
 * Generates HTML for the active user's contact.
 * @param {Object} user - The user object containing id, initials, name, and email.
 * @param {string} limitNameLength - The shortened name for display.
 * @param {string} limitEmailLength - The shortened email for display.
 */
function generateActiveUserContact(user, limitNameLength, limitEmailLength) {
  return `
      <div id="contact${user.id}" class="contact font-s-20 d-flex gap-16 bg-user" onclick="displayContactInfo(${user.id})">
        <div class="letter-circle font-s-12 d-flex-center letter-circel-user" style="background-color: white;">${user.initials}</div>
        <div class="d-flex-column">
          <span>${limitNameLength}</span>
          <span class="user-you">(You)</span>
          <a class="contact-email font-s-16" href="#">${limitEmailLength}</a>
        </div>
      </div>
    `;
}

/**
 * Generates a letter box for grouping contacts.
 * @param {string} initials - The initials to display.
 */
function generateLetterBox(initials) {
  return `<div class="letter-box  font-s-20 ">${initials}</div>
              <div class="contact-seperator"></div>`;
}

/**
 * Generates HTML for a contact.
 * @param {Object} contact - The contact object containing id, initials, name, email, and color.
 * @param {string} limitNameLength - The shortened name for display.
 * @param {string} limitEmailLength - The shortened email for display.
 */
function generateContact(contact, limitNameLength, limitEmailLength) {
  return `
      <div id="contact${contact.id}" class="contact font-s-20 d-flex gap-16" onclick="displayContactInfo(${contact.id})">
        <div class="letter-circle font-s-12 font-c-white d-flex-center" style="background-color: ${contact.color};">${contact.initials}</div>
        <div class="d-flex-column">
          <span>${limitNameLength}</span>
          <a class="contact-email font-s-16" href="#">${limitEmailLength}</a>
        </div>
      </div>
    `;
}

/**
 * Generates detailed HTML for a contact.
 * @param {Object} contact - The contact object containing id, initials, name, email, phone, and color.
 */
function generateContactInfo(contact) {
  let phone = contact.phone !== undefined ? contact.phone : "";
  let contactColor = contact.id !== 0 ? contact.color : "#ffffff";
  return `
    <div class="contact-details pos-rel w-100 d-flex-column gap-32">
        <div class="contacts-info-name w-100 d-flex gap-24">
          <div id="for_active_user" class="big-letter-circle font-c-white d-flex-center" style="background-color: ${contactColor};">${contact.initials}</div>          
          <div class="contact-box-name d-flex-column gap-8">
            <div class="contact-name">${contact.name}</div>

            <div class="edit-delete-btn w-100 d-flex gap-24">
              <div onclick="openEditContact(${contact.id})" id="user_edit_display_info" class="d-flex gap-8 font-s-16 contact-link">
                <img class="edit-icon" src="../assets/img/png/edit-default.png" alt="" />
              </div>
              <div onclick="openDeleteDialog(${contact.id})" id="user_delete_display_info" class="d-flex gap-8 font-s-16 contact-link">
                <img class="delete-icon" src="../assets/img/png/delete-default.png" alt="" />
              </div>
            </div>

          </div>
        </div>        

        <div class="w-100 d-flex-column gap-16">
          <div class="font-s-20">Contact Information</div>
          <div class="w-100 d-flex-column gap-8">
            <span class="font-w-700">Email</span>
            <span> 
              <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>
            </span>
          </div>
          <div class="w-100 d-flex-column gap-8">
            <span class="font-w-700">Phone</span>
            <span>${phone}</span>
          </div>
        </div>

        <div onclick="openMobileMenu(${contact.id})" id="mobile_delete_edit" class="mobile-menu-btn d-flex-center">
          <img src="../assets/img/png/three_dots.png" alt="" />
        </div>
    </div>
  `;
}

/**
 * Generates HTML for the edit contact dialog.
 * @param {Object} contact - The contact object containing id, initials, and color.
 */
function generateEditContactDialog(contact) {
  return `
        <div class="close-cross little-button d-flex-center wh-24" onclick="toggleOverlay('dialog_edit_overlay')">
            <img src="../assets/img/png/close.png" alt="" />
        </div>
        <div class="dialog-left">
          <img class="logo-dialog" src="../assets/img/png/Join logo vector.png" alt=""/>
          <div class="d-flex-column gap-16">
            <div class="dialog-headline font-w-700 font-c-white">Edit contact</div>
            <div class="dialo-text-seperator"></div>
          </div>
        </div>

        <div class="user-logo d-flex-center">
          <div class="big-letter-circle font-c-white d-flex-center" style="background-color: ${contact.color};">${contact.initials}</div>
        </div>

        <div class="dialog-right d-flex-column"> 
          <div class="input-fields d-flex-column gap-16">
            <div>
              <input id="input_edit_name" class="input-background input-name-img" type="text" placeholder="Name"/>
              <div class="field-alert font-s-12" id="edit_field_alert_name"></div>
            </div>
            <div>
              <input id="input_edit_email" class="input-background input-email-img" type="email" placeholder="Email"/>
              <div class="field-alert font-s-12" id="edit_field_alert_email"></div>
            </div>
            <div>
              <input id="input_edit_phone" class="input-background input-phone-img" type="number" min="0" placeholder="Phone"/>
            </div>
          </div>

          <div class="dialog-btns">
            <button onclick="openDeleteDialog(${contact.id})" id="user_display_info" class="clear-button">
              Delete
            </button>
            <button onclick="editContact(${contact.id})" class="button-save">
              Save
              <img class="check-icon-button" src="../assets/img/png/check.png" alt="check"/>
            </button>
          </div>
        </div>
    `;
}

/**
 * Generates HTML for the mobile menu for a contact.
 * @param {number} contactId - The ID of the contact.
 */
function generateMobileMenu(contactId) {
  return ` 
      <img onclick="openEditContact(${contactId})" class="mobile-edit-img" src="../assets/img/png/edit-default.png" alt="edit">
      <img onclick="openDeleteDialog(${contactId})" class="mobile-delete-img" src="../assets/img/png/delete-default.png" alt="delete">`;
}

/**
 * Generates HTML for a delete button for a contact.
 * @param {number} contactId - The ID of the contact.
 */
function generateDeleteButton(contactId) {
  return `<button class="clear-button" onclick="deleteContact(${contactId})">YES</button>`;
}

/**
 * Generates HTML for a contact feedback message.
 * @param {string} operation - The operation type ("created", "edited", or "deleted").
 */
function generateContactFeedback(operation) {
  return `<div class="contact-feedback font-c-white d-flex-center">Contacts successfully ${operation}</div>`;
}
