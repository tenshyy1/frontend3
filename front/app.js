let tasks = loadTasks();
let currentFilter = 'all';

function addTask() {
  const input = document.getElementById('new-task');
  const text = input.value.trim();
  if (text) {
    const task = { id: Date.now(), text, completed: false };
    tasks.push(task);
    saveTasks(tasks);
    renderTasks();
    sendNewTaskNotification(task.text);
    input.value = '';
  }
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks(tasks);
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  const filtered = tasks.filter(t =>
    currentFilter === 'all' ||
    (currentFilter === 'active' && !t.completed) ||
    (currentFilter === 'completed' && t.completed)
  );

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.className = task.completed ? 'completed' : '';
    li.onclick = () => toggleTask(task.id);
    list.appendChild(li);
  });
}

renderTasks();
startReminderInterval();
