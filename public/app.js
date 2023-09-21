const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Function to fetch tasks from the server
function fetchTasks() {
  fetch('/api/todos')
    .then((response) => response.json())
    .then((data) => {
      taskList.innerHTML = '';
      data.forEach((task) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="updateTask(${task.id}, this)">
          <span>${task.task}</span>
          <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
      });
    });
}

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: taskText, completed: false }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchTasks();
        taskInput.value = '';
      });
  }
}

// Function to update a task
function updateTask(id, checkbox) {
  const completed = checkbox.checked;
  fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
    .then((response) => response.json())
    .then(() => fetchTasks());
}

// Function to delete a task
function deleteTask(id) {
  fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then(() => fetchTasks());
}

// Initial fetch
fetchTasks();
