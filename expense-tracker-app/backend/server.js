const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
db.initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ===== CRUD ROUTES =====

// POST /items - Create expense
app.post('/items', (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const expense = db.createExpense(title, parseFloat(amount), category, date);
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error.message);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// GET /items - Get all expenses
app.get('/items', (req, res) => {
  try {
    const expenses = db.getAllExpenses();
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// PUT /items/:id - Update expense
app.put('/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    // Validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const updated = db.updateExpense(
      parseInt(id),
      title,
      parseFloat(amount),
      category,
      date
    );

    if (!updated) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating expense:', error.message);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE /items/:id - Delete expense
app.delete('/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteExpense(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log('=====================================');
  console.log('💰 Expense Tracker Backend');
  console.log('=====================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log('=====================================');
});

module.exports = app;
