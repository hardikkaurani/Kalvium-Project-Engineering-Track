// ===== TASK MANAGER - MAIN STATE & LOGIC =====

// Global state: array to store all tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; // Track current filter state

// ===== DOM ELEMENTS =====
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const emptyState = document.getElementById('emptyState');
const taskStats = document.getElementById('taskStats');

// ===== EVENT LISTENERS =====

// Add task on button click
addBtn.addEventListener('click', addTask);

// Add task on Enter key press
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        render();
    });
});

// ===== CORE FUNCTIONS =====

/**
 * Add a new task to the list
 * Validates input and adds to state
 */
function addTask() {
    const title = taskInput.value.trim();
    
    // Validate: no empty tasks
    if (title === '') {
        taskInput.focus();
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now(), // Simple unique ID
        title: title,
        completed: false,
        createdAt: new Date().toLocaleDateString()
    };
    
    // Add to state
    tasks.push(newTask);
    
    // Save to localStorage
    saveTasks();
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
    
    // Re-render UI
    render();
}

/**
 * Toggle task completion status
 * @param {number} id - Task ID
 */
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        render();
    }
}

/**
 * Delete a task by ID
 * @param {number} id - Task ID
 */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

/**
 * Get filtered tasks based on current filter
 * @returns {Array} - Filtered task array
 */
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        case 'all':
        default:
            return tasks;
    }
}

/**
 * Save tasks to localStorage
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Update statistics (active and completed count)
 */
function updateStats() {
    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    taskStats.textContent = `${activeCount} Active • ${completedCount} Completed`;
}

/**
 * Render the entire UI
 * Main function that updates all visual elements
 */
function render() {
    const filteredTasks = getFilteredTasks();
    
    // Clear current list
    taskList.innerHTML = '';
    
    // If no tasks, show empty state
    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        return;
    }
    
    // Hide empty state
    emptyState.classList.remove('show');
    
    // Render each task
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    // Update stats
    updateStats();
}

/**
 * Create a task DOM element
 * @param {Object} task - Task object
 * @returns {HTMLElement} - Task list item element
 */
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : 'active'}`;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    
    // Task text
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.title;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    // Append elements to list item
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    
    return li;
}

// ===== INITIALIZATION =====
// Render UI on page load
render();
