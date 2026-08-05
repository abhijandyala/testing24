// ---------- Toast helper ----------
const toastEl = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// ---------- Animated hero stats ----------
function animateCounter(el, target, durationMs) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / durationMs, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

animateCounter(document.getElementById("stat-users"), 48213, 1400);
animateCounter(document.getElementById("stat-tasks"), 1204577, 1800);
animateCounter(document.getElementById("stat-teams"), 3160, 1400);

// ---------- Todo demo ----------
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = loadTodos();

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem("taskflow-todos")) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem("taskflow-todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "No tasks yet — add one above!";
    todoList.appendChild(empty);
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, deleteBtn);
    todoList.appendChild(li);
  });

  const remaining = todos.filter((t) => !t.done).length;
  todoCount.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
}

function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  addTodo(text);
  todoInput.value = "";
  todoInput.focus();
});

clearCompletedBtn.addEventListener("click", () => {
  const completed = todos.filter((t) => t.done).length;
  if (completed === 0) {
    showToast("Nothing to clear — no completed tasks.");
    return;
  }
  todos = todos.filter((t) => !t.done);
  saveTodos();
  renderTodos();
  showToast(`Cleared ${completed} completed task${completed === 1 ? "" : "s"}.`);
});

renderTodos();

// ---------- Pricing billing toggle ----------
const billingSwitch = document.getElementById("billing-switch");
const amounts = document.querySelectorAll(".price .amount");

billingSwitch.addEventListener("change", () => {
  const yearly = billingSwitch.checked;
  amounts.forEach((el) => {
    const price = yearly ? el.dataset.yearly : el.dataset.monthly;
    el.textContent = `$${price}`;
  });
});

// ---------- Plan buttons & CTAs ----------
document.querySelectorAll(".plan-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    showToast(`${btn.dataset.plan} plan selected — welcome aboard! 🎉`);
  });
});

document.getElementById("nav-cta").addEventListener("click", () => {
  showToast("Signup coming soon — this is a demo!");
});

document.getElementById("hero-cta").addEventListener("click", () => {
  showToast("Signup coming soon — this is a demo!");
});

document.getElementById("hero-demo").addEventListener("click", () => {
  document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
});
