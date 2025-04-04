const BASE_URL = "http://127.0.0.1:8000";
let activeUser = getActiveUser();

/**
 * Downloads the data from the database depending on the deposit and ID.
 *
 * @param {string} path - The path in the database from where to load the data.
 * @returns {Array} - Downloaded data.
 */
async function fetchData(path = "") {
  let response = await fetch(`${BASE_URL}/${path}/`);
  let datas = await response.json();
  if (datas === null) {
    return null;
  }
  let dataArray = Array.isArray(datas) ? datas : Object.values(datas);
  return dataArray.filter((data) => data !== null);
}

/**
 * Uploads the data from the database depending on the deposit and ID.
 *
 * @param {string} path - The path in the database for which a new ID should be generated.
 * @param {*} data - Data to be uploaded
 */
async function postData(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function putData(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}/${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Deletes the data from the database depending on the deposit and the ID.
 *
 * @param {string} path - The path in the database for which a new ID should be generated.
 * @param {*} id - Id of the element to be deleted
 */
async function deleteData(path = "", id) {
  let url = `${BASE_URL}/${path}/${id}/`;
  let response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return await response.json();
  }

  return null;
}

/**
 * Loads the user's data for the activeUser into the LocalStorage.
 *
 * @returns {Objekt} - ActiveUser data
 */
function getActiveUser() {
  try {
    const STORED_USER = localStorage.getItem("activeUser");
    if (STORED_USER) {
      return JSON.parse(STORED_USER);
    } else {
      return {};
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des activeUser:", error);
    return {};
  }
}

/**
 * Resets the default tasks and contacts in the database.
 */
async function resetTheDatabase() {
  for (let index = 0; index < dbBackupTask.length; index++) {
    await postData(`tasks/${index}/`, dbBackupTask[index]);
    await postData(`contacts/${index}/`, dbBackupContacts[index]);
  }
}

/**
 * Changes the image of the check button.
 *
 * @param {number} CheckButtonId - Id of the check-button
 * @param {HTMLElement} CheckTaskButton - The HTML element where the button is displayed
 */
function toggleCheckButton(CheckButtonId, CheckTaskButton) {
  let checkButton = document.getElementById(CheckButtonId);
  let isChecked = checkButton.src.includes("true");
  checkButton.src = `../assets/img/png/check-${CheckTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}

/**
 * Opens a specified URL in a new browser tab.
 *
 * @param {string} LinkToSide - The URL to be opened in a new tab.
 */
function openLegal(LinkToSide) {
  let targetUrl = LinkToSide;
  window.open(targetUrl, "_blank");
}

/**
 * Navigates the browser to the previous page in history.
 */
function goBack() {
  window.history.back();
}

/**
 * Prevents event bubbling up the DOM tree.
 *
 * @param {Event} event - The event object
 */
function bubblingPrevention(event) {
  event.stopPropagation();
}

/**
 * Deletes the activeUser data and redirects to the log in page
 */
function logOut() {
  localStorage.removeItem("activeUser");
  window.location.href = "../index.html";
}

/**
 * Toggles the visibility of an overlay section and adjusts the body scroll.
 *
 * @param {string} section - The ID of the overlay section to toggle.
 */
function toggleOverlay(section) {
  let refOverlay = document.getElementById(section);

  refOverlay.classList.toggle("d-none");

  if (!refOverlay.classList.contains("d-none")) {
    setTimeout(() => {
      refOverlay.classList.add("active", "visible");
    }, 50);
  } else {
    refOverlay.classList.remove("active", "visible");
  }
}

/**
 * Generates a random dark hexadecimal color.
 */
function generateRandomColor() {
  let darkLetters = "0123456789ABC";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += darkLetters[Math.floor(Math.random() * darkLetters.length)];
  }
  return color;
}
