/**
 * Adds an event listener that triggers when the DOM is fully loaded.
 * Initializes the greeting, renders tasks, and checks the mobile greeting if necessary.
 */
document.addEventListener("DOMContentLoaded", () => {
  greeting();
  renderTasks();
  if (window.innerWidth <= 770) {
    checkAndShowGreeting();
  }
});

/**
 * Updates and displays the greeting message for the user.
 */
function greeting() {
  let greeting = document.getElementById("greetings");
  let greetingMobile = document.getElementById("greeting_mobile");
  let greetingUser = activeUser.name;
  let greetingMessage = getGreetingMessage();
  greeting.innerHTML = greetingHtml(greetingMessage, greetingUser);
  greetingMobile.innerHTML = greetingHtml(greetingMessage, greetingUser);
}

/**
 * Determines the appropriate greeting message based on the current time.
 * @returns {string} The greeting message ("Good morning", "Good afternoon", or "Good evening").
 */
function getGreetingMessage() {
  let currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/**
 * Generates the HTML content for the greeting message.
 * @param {string} greetingMessage - The greeting message.
 * @param {string} greetingUser - The user's name.
 * @returns {string} The formatted HTML string containing the greeting.
 */
function greetingHtml(greetingMessage, greetingUser) {
  return `${greetingMessage}, <div class="greeting-user">${greetingUser}</div>`;
}

/**
 * Fetches and renders tasks, updating various counters accordingly.
 * @returns {Promise<void>}
 */
async function renderTasks() {
  let tasks = await loadTasks();
  countTasks(tasks, "count_to_do", "todo", "status");
  countTasks(tasks, "count_done", "done", "status");
  countTasks(tasks, "count_progress", "inprogress", "status");
  countTasks(tasks, "count_feedback", "awaitfeedback", "status");
  countTasks(tasks, "count_priority_urgent", "urgent", "priority");
  countTasks(tasks, "count_tasks", "", "length");
  deadlineDate(tasks);
}

/**
 * Loads tasks assigned to the active user.
 * @returns {Promise<Array>} A promise that resolves to the list of tasks.
 */
async function loadTasks() {
  let userTasks = activeUser.tasks;
  let allTasks = await fetchData("tasks");
  return allTasks.filter((task) => userTasks.includes(task.id));
}

/**
 * Counts tasks based on a specific category and updates the corresponding element.
 * @param {Array} tasks - The list of tasks.
 * @param {string} element - The ID of the HTML element to update.
 * @param {string} taskStatus - The status or priority type of the task.
 * @param {string} taskCategory - The category of the task to count.
 */
function countTasks(tasks, element, taskStatus, taskCategory) {
  let eachSummary = document.getElementById(element);
  let count =
    taskCategory === "length"
      ? tasks.length
      : tasks.filter((task) => task[taskCategory] === taskStatus).length;
  eachSummary.innerHTML = `${count}`;
}

/**
 * Finds and formats the next upcoming due date from the list of tasks.
 * @param {Array} tasks - The list of tasks.
 */
function deadlineDate(tasks) {
  let tasksWithDueDate = tasks.filter((task) => task.date);
  tasksWithDueDate.sort((a, b) => new Date(a.date) - new Date(b.date));
  let nextDueDate = tasksWithDueDate[0]?.date;
  if (nextDueDate) {
    let [year, month, day] = nextDueDate.split("-");
    let dateObj = new Date(year, month - 1, day);
    let formattedDate = dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    document.getElementById("deadline_date").innerHTML = `${formattedDate}`;
  }
}

/**
 * Redirects the user to the board page.
 */
function navigatonToBoard() {
  window.location.href = "../html/board.html";
}

/**
 * Checks whether the mobile greeting has already been shown and displays it if necessary.
 */
function checkAndShowGreeting() {
  let greetingShown = localStorage.getItem("greetingShown");
  if (greetingShown === "false" || !greetingShown) {
    mobileGreeting();
    localStorage.setItem("greetingShown", "true");
  }
}

/**
 * Displays the mobile greeting and hides it after a delay.
 */
function mobileGreeting() {
  let greetingDialog = document.getElementById("greeting_mobile");
  if (greetingDialog) {
    greetingDialog.classList.remove("d-none");
    setTimeout(() => {
      greetingDialog.classList.add("d-none");
      greetingDialog.close();
    }, 2500);
  }
}
