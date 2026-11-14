const COLUMNS = ["todo", "in-progress", "done"]

const tasks = new Map()
let nextId = 1

function addTask(title, priority) {
  const id = `task-${nextId}`
  nextId++
  tasks.set(id, { title, priority, column: 0 })
}

function createElement(tag, className, text = "") {
  const element = document.createElement(tag)
  element.className = className
  element.textContent = text
  return element
}

function createActions(column) {
  const actions = createElement("div", "card-actions")
  if (column > 0) {
    actions.append(createElement("button", "btn-prev", "←"))
  }
  if (column < COLUMNS.length - 1) {
    actions.append(createElement("button", "btn-next", "→"))
  }
  actions.append(createElement("button", "btn-delete", "🗑️"))
  return actions
}

function createCardView(id, task) {
  const card = createElement("article", "card")
  card.id = id
  card.append(
    createElement("p", "card-title", task.title),
    createElement("span", `badge badge-${task.priority}`, task.priority),
    createActions(task.column)
  )
  return card
}

// Pruebas temporales
addTask("Aprender módulos ES", "alta")
addTask("Configurar Vite", "media")

// Prueba manual de createCardView: la sustituirás por render()
document.getElementById("todo").append(createCardView("task-1", tasks.get("task-1")))