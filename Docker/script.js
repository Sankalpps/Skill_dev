const STORAGE_KEY = "today-tasks";

const state = {
  tasks: loadTasks(),
  filter: "all",
};

const elements = {
  form: document.querySelector("#add-form"),
  input: document.querySelector("#task-input"),
  list: document.querySelector("#task-list"),
  empty: document.querySelector("#empty-state"),
  emptyTitle: document.querySelector("#empty-title"),
  emptyMessage: document.querySelector("#empty-message"),
  count: document.querySelector("#task-count"),
  date: document.querySelector("#current-date"),
  clear: document.querySelector("#clear-completed"),
};

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function visibleTasks() {
  if (state.filter === "active") return state.tasks.filter((task) => !task.completed);
  if (state.filter === "completed") return state.tasks.filter((task) => task.completed);
  return state.tasks;
}

function render() {
  const tasks = visibleTasks();
  elements.list.replaceChildren();

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " is-completed" : ""}`;
    item.dataset.id = task.id;

    const check = document.createElement("button");
    check.className = "check-button";
    check.type = "button";
    check.setAttribute("aria-label", task.completed ? `Mark "${task.text}" active` : `Complete "${task.text}"`);
    check.addEventListener("click", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.setAttribute("aria-label", `Delete "${task.text}"`);
    remove.textContent = "×";
    remove.addEventListener("click", () => deleteTask(task.id));

    item.append(check, text, remove);
    elements.list.append(item);
  });

  const activeCount = state.tasks.filter((task) => !task.completed).length;
  elements.count.textContent = `${activeCount} ${activeCount === 1 ? "task" : "tasks"} left`;
  elements.empty.hidden = tasks.length > 0;
  elements.emptyTitle.textContent = state.filter === "completed" ? "No completed tasks." : "Your list is clear.";
  elements.emptyMessage.textContent = state.filter === "completed" ? "Complete a task and it will appear here." : "Add a task above to get started.";
  elements.clear.disabled = !state.tasks.some((task) => task.completed);
}

function addTask(text) {
  state.tasks.unshift({ id: crypto.randomUUID(), text, completed: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = elements.input.value.trim();
  if (!text) return;
  addTask(text);
  elements.form.reset();
  elements.input.focus();
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    render();
  });
});

elements.clear.addEventListener("click", () => {
  state.tasks = state.tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

elements.date.textContent = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date());
render();
