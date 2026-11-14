const COLUMNS = ["TO-DO", "En progreso", "Hecho"];
const PRIORITIES = ["Baja", "Media", "Alta"];

const tasks = new Map();
let nextId = 1;
let editingId = null;

function createElement(tag, className, text = "") {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function createActions(column) {
  const actions = createElement("div", "card-actions");
  if (column > 0) {
    actions.append(createElement("button", "btn-prev", "←"));
  }
  if (column < COLUMNS.length - 1) {
    actions.append(createElement("button", "btn-next", "→"));
  }
  actions.append(createElement("button", "btn-delete", "🗑️"));
  return actions;
}

function createCardView(id, task) {
  const card = createElement("article", "card");
  card.id = id;
  card.append(
    createElement("p", "card-title", task.title),
    createElement("span", `badge badge-${task.priority}`, task.priority),
    createActions(task.column),
  );
  return card;
}

function createTitleInput(title) {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "edit-title";
  input.required = true;
  input.value = title;
  return input;
}

function createPrioritySelect(priority) {
  const select = document.createElement("select");
  select.name = "edit-priority";
  for (const value of PRIORITIES) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
  select.value = priority;
  return select;
}

function createButton(className, text) {
  const button = createElement("button", className, text);
  button.type = "button";
  return button;
}

function createCardEdit(id, task) {
  const card = createElement("article", "card");
  card.id = id;
  const form = createElement("div", "edit-form");
  const actions = createElement("div", "card-actions");
  actions.append(
    createButton("btn-save", "Guardar"),
    createButton("btn-cancel", "Cancelar"),
  );
  form.append(
    createTitleInput(task.title),
    createPrioritySelect(task.priority),
    actions,
  );
  card.append(form);
  return card;
}

function renderColumn(columnId, index) {
  const section = document.getElementById(columnId);
  section.querySelectorAll(".card").forEach((card) => card.remove());

  for (const [id, task] of tasks) {
    if (task.column === index) {
      const createCard = id === editingId ? createCardEdit : createCardView;
      section.append(createCard(id, task));
    }
  }
}

function render() {
  COLUMNS.forEach(renderColumn);
}

function addTask(title, priority) {
  const id = `task-${nextId}`;
  nextId++;
  tasks.set(id, { title, priority, column: 0 });
}

function moveTask(id, direction) {
  tasks.get(id).column += direction;
}

function deleteTask(id) {
  tasks.delete(id);
}

function startEditing(id) {
  editingId = id;
}

function cancelEditing() {
  editingId = null;
}

function saveTask(id) {
  const card = document.getElementById(id);
  const title = card.querySelector("[name='edit-title']").value.trim();
  if (!title) {
    return;
  }
  const task = tasks.get(id);
  task.title = title;
  task.priority = card.querySelector("[name='edit-priority']").value;
  cancelEditing();
}

const ACTIONS = {
  "btn-prev": (id) => moveTask(id, -1),
  "btn-next": (id) => moveTask(id, 1),
  "btn-delete": deleteTask,
  "btn-save": saveTask,
  "btn-cancel": cancelEditing,
};

function handleBoardClick(event) {
  const card = event.target.closest(".card");
  const action = ACTIONS[event.target.className] ?? startEditing;
  if (!card || (card.id === editingId && action === startEditing)) {
    return;
  }
  action(card.id);
  render();
}

function handleOutsideClick(event) {
  if (editingId && !event.target.closest(`#${editingId}`)) {
    cancelEditing();
    render();
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const title = document.getElementById("task-title").value.trim();
  if (!title) {
    return;
  }
  addTask(title, document.getElementById("task-priority").value);
  render();
  event.target.reset();
}

function init() {
  document
    .getElementById("task-form")
    .addEventListener("submit", handleFormSubmit);
  document
    .querySelector(".kanban-board")
    .addEventListener("click", handleBoardClick);
  document.addEventListener("click", handleOutsideClick);
}

init();
