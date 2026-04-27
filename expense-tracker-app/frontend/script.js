const BACKEND_URL = 'http://localhost:3000';
const PRODUCTION_URL = 'https://expense-tracker-backend.onrender.com';
const API_BASE = window.location.hostname === 'localhost' ? BACKEND_URL : PRODUCTION_URL;

let expenses = [];
let editingId = null;

const form = document.getElementById('expenseForm');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submitBtn');
const expenseList = document.getElementById('expenseList');
const statusDiv = document.getElementById('status');

// Set today's date as default
dateInput.valueAsDate = new Date();

// Load expenses on page load
document.addEventListener('DOMContentLoaded', () => {
  loadExpenses();
  checkHealth();
});

async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
      showStatus('⚠️ Backend error', 'error');
    }
  } catch (error) {
    showStatus('⚠️ Cannot reach backend', 'error');
  }
}

async function loadExpenses() {
  try {
    showStatus('<div class="spinner"></div> Loading...', 'loading');
    const response = await fetch(`${API_BASE}/items`);

    if (!response.ok) {
      throw new Error('Failed to load expenses');
    }

    expenses = await response.json();
    renderExpenses();
    showStatus('', '');
  } catch (error) {
    showStatus(`❌ ${error.message}`, 'error');
  }
}

function renderExpenses() {
  if (expenses.length === 0) {
    expenseList.innerHTML =
      '<div class="empty-state"><p>📊 No expenses yet. Add one to get started!</p></div>';
    renderSummary([]);
    return;
  }

  expenseList.innerHTML = expenses
    .map(
      (expense) => `
    <div class="expense-item">
      <div class="expense-info">
        <div class="expense-title">${escapeHtml(expense.title)}</div>
        <div class="expense-date">${new Date(expense.date).toLocaleDateString()}</div>
      </div>
      <div class="expense-category">${escapeHtml(expense.category)}</div>
      <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
      <div class="expense-actions">
        <button class="btn-secondary" onclick="editExpense(${expense.id})">Edit</button>
        <button class="btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
      </div>
    </div>
  `
    )
    .join('');

  renderSummary(expenses);
}

function renderSummary(items) {
  const total = items.reduce((sum, exp) => sum + exp.amount, 0);
  const average = items.length > 0 ? total / items.length : 0;

  const summary = document.querySelector('.summary') || createSummary();
  summary.innerHTML = `
    <div class="summary-card">
      <div class="summary-label">Total Spent</div>
      <div class="summary-value">₹${total.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Avg per Entry</div>
      <div class="summary-value">₹${average.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Entries</div>
      <div class="summary-value">${items.length}</div>
    </div>
  `;
}

function createSummary() {
  const summary = document.createElement('div');
  summary.className = 'summary';
  expenseList.parentElement.insertBefore(summary, expenseList);
  return summary;
}

async function submitForm(e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = amountInput.value.trim();
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!title || !amount || !category || !date) {
    showStatus('❌ All fields required', 'error');
    return;
  }

  submitBtn.disabled = true;

  try {
    let response;

    if (editingId) {
      // Update
      response = await fetch(`${API_BASE}/items/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, amount: parseFloat(amount), category, date }),
      });
    } else {
      // Create
      response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, amount: parseFloat(amount), category, date }),
      });
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save');
    }

    form.reset();
    dateInput.valueAsDate = new Date();
    editingId = null;
    submitBtn.textContent = 'Add Expense';
    showStatus('✅ Expense saved!', 'success');
    loadExpenses();
  } catch (error) {
    showStatus(`❌ ${error.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
  }
}

function editExpense(id) {
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return;

  titleInput.value = expense.title;
  amountInput.value = expense.amount;
  categoryInput.value = expense.category;
  dateInput.value = expense.date;

  editingId = id;
  submitBtn.textContent = 'Update Expense';
  titleInput.focus();
}

async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;

  try {
    const response = await fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Failed to delete');
    }

    showStatus('✅ Expense deleted!', 'success');
    loadExpenses();
  } catch (error) {
    showStatus(`❌ ${error.message}`, 'error');
  }
}

function showStatus(message, type) {
  statusDiv.innerHTML = message;
  statusDiv.className = `status ${type}`;
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.className = 'status';
      statusDiv.innerHTML = '';
    }, 3000);
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

form.addEventListener('submit', submitForm);
