const todoInput = document.querySelector(".todo-input");
const dateInput = document.getElementById("date");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const deleteAllBtn = document.getElementById("delete-all-btn");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoClick);
filterOption.addEventListener("change", filterTodos);
deleteAllBtn.addEventListener("click", deleteAllTodos);

function addTodo(event) {
  event.preventDefault();
  if (todoInput.value === "") return;

  const todoDiv = createTodoElement(todoInput.value, dateInput.value);
  todoList.appendChild(todoDiv);
  saveLocalTodo({ text: todoInput.value, date: dateInput.value });

  todoInput.value = "";
  dateInput.value = "";
}

function createTodoElement(text, date) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("todo-content");

  const newTodo = document.createElement("span");
  newTodo.classList.add("todo-item");
  newTodo.innerText = text;

  const dateSpan = document.createElement("span");
  dateSpan.classList.add("date-time");
  dateSpan.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${date}`;

  const completedBtn = document.createElement("button");
  completedBtn.innerHTML = '<i class="fas fa-check"></i>';
  completedBtn.classList.add("completed-btn");

  const trashBtn = document.createElement("button");
  trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
  trashBtn.classList.add("trash-btn");

  contentContainer.appendChild(newTodo);
  contentContainer.appendChild(dateSpan);
  contentContainer.appendChild(completedBtn);
  contentContainer.appendChild(trashBtn);

  todoDiv.appendChild(contentContainer);
  return todoDiv;
}

function handleTodoClick(e) {
  const item = e.target.closest("button");
  if (!item) return;

  const todo = item.closest(".todo");
  if (item.classList.contains("trash-btn")) {
  todo.classList.add("slide");
    removeLocalTodo(todo);
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  } else if (item.classList.contains("completed-btn")) {
    todo.classList.toggle("completed");
  }
}

function filterTodos(e) {
  const todos = todoList.childNodes;
  todos.forEach((todo) => {
    if (todo.nodeType !== 1) return;
    switch (e.target.value) {
      case "all":
        todo.style.display = "block";
        break;
      case "completed":
        todo.style.display = todo.classList.contains("completed") ? "block" : "none";
        break;
      case "uncompleted":
        todo.style.display = !todo.classList.contains("completed") ? "block" : "none";
        break;
    }
  });
}

function saveLocalTodo(todoObj) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(todoObj);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach((todo) => {
    const todoDiv = createTodoElement(todo.text, todo.date);
    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodo(todoElement) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoText = todoElement.querySelector(".todo-item").innerText;
  todos = todos.filter((t) => t.text !== todoText);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteAllTodos() {
  todoList.innerHTML = "";
  localStorage.removeItem("todos");
}
