const COLUMNS = ["todo", "in-progress", "done"];

const tasks = new Map();
let nextId = 1;

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
function renderColumn(columnId, index) {
  const section = document.getElementById(columnId);
  section.querySelectorAll(".card").forEach((card) => card.remove());

  for (const [id, task] of tasks) {
    if (task.column === index) {
      section.append(createCardView(id, task));
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
const ACTIONS = {
  "btn-prev": (id) => moveTask(id, -1),
  "btn-next": (id) => moveTask(id, 1),
  "btn-delete": deleteTask,
};
function handleBoardClick(event) {
  const card = event.target.closest(".card");
  const action = ACTIONS[event.target.className];
  if (!card || !action) {
    return;
  }
  action(card.id);
  render();
}
function init() {
  addTask("Aprender módulos ES", "alta");
  addTask("Configurar Vite", "media");
  render();
}
init();
document
  .querySelector(".kanban-board")
  .addEventListener("click", handleBoardClick);
