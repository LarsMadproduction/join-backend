/**
 * Runs init functions after DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadTemplate();
  initHeader();
  initSidebar();
});

/**
 * Loads the desktop template and makes the page visible.
 */
async function loadTemplate() {
  let response = await fetch("../assets/templates/desktopTemplate.html");
  document.getElementById("desktop_template").innerHTML = await response.text();
  document.body.style.visibility = "visible";
}

/**
 * Sets the user's initials in the header.
 */
function initHeader() {
  let initialContainer = document.getElementById("user_profile_initials");
  initialContainer.textContent = activeUser.initials || "";
}

/**
 * Initializes the sidebar for the current page.
 */
function initSidebar() {
  let currentPage = window.location.pathname.split("/").pop().split(".")[0];
  let link = document.getElementById(`link_${currentPage}`);
  link.classList.add("selected");

  editImage(link, currentPage);
  hideElements(currentPage);
}

/**
 * Updates the icon image.
 *
 * @param {HTMLElement} link - The link element containing the icon.
 * @param {string} currentPage - The current page identifier.
 */
function editImage(link, currentPage) {
  if (currentPage !== "privacyPolicy" && currentPage !== "legalNotice") {
    let icon = link.querySelector("img");
    icon.src = `../assets/img/png/${currentPage}-white.png`;
  }
}

/**
 * Hides UI elements when no user is logged in.
 *
 * @param {string} currentPage - The current page identifier.
 */
function hideElements(currentPage) {
  let isUserLoggedIn = localStorage.getItem("activeUser");
  if (!isUserLoggedIn) {
    document.getElementById("header_icons").classList.add("d-none");
    document.getElementById("icon_bar").classList.add("d-none");
    document.getElementById("arrow_back").classList.add("d-none");
    document.getElementById("sidebar").classList.add("hide-mobile");

    document
      .getElementById(`${currentPage}_content`)
      .classList.add("height-mobile");
  }
}

/**
 * Toggles the logout overlay.
 */
function handleClickUserMenu() {
  let logOut = document.getElementById("log_out_overlay");
  logOut.classList.toggle("d-none");
}
