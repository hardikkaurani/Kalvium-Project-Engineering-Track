const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'expenses.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Database initialized');
}

// Get all expenses
function getAllExpenses() {
  const stmt = db.prepare('SELECT * FROM expenses ORDER BY date DESC, createdAt DESC');
  return stmt.all();
}

// Create expense
function createExpense(title, amount, category, date) {
  const stmt = db.prepare(
    'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(title, amount, category, date);
  return { id: result.lastInsertRowid, title, amount, category, date };
}

// Update expense
function updateExpense(id, title, amount, category, date) {
  const stmt = db.prepare(
    'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?'
  );
  const result = stmt.run(title, amount, category, date, id);
  
  if (result.changes === 0) {
    return null;
  }
  
  return { id, title, amount, category, date };
}

// Delete expense
function deleteExpense(id) {
  const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

module.exports = {
  db,
  initializeDatabase,
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
