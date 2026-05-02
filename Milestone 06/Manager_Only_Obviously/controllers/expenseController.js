import Expense from '../models/Expense.js';

// @desc    Get all expenses
// @route   GET /api/expenses
export const getAllExpenses = async (req, res) => {
  const expenses = await Expense.find({}).populate('submittedBy', 'name email');
  res.json(expenses);
};

// @desc    Get current user's expenses
// @route   GET /api/expenses/mine
export const getMyExpenses = async (req, res) => {
  const expenses = await Expense.find({ submittedBy: req.user._id });
  res.json(expenses);
};

// @desc    Create new expense
// @route   POST /api/expenses
export const createExpense = async (req, res) => {
  const { title, amount, category } = req.body;
  const expense = await Expense.create({
    title,
    amount,
    category,
    submittedBy: req.user._id
  });
  res.status(201).json(expense);
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  // Ownership Check: Only owner or admin can update
  const isOwner = expense.submittedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to update this expense' });
  }

  const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedExpense);
};

// @desc    Approve an expense
// @route   PUT /api/expenses/:id/approve
export const approveExpense = async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id, 
    { status: 'approved' }, 
    { new: true }
  );
  res.json(expense);
};

// @desc    Reject an expense
// @route   PUT /api/expenses/:id/reject
export const rejectExpense = async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id, 
    { status: 'rejected' }, 
    { new: true }
  );
  res.json(expense);
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  // Ownership Check: Only owner or admin can delete
  // (Note: Middleware restricts this route to admin, but logic is here for safety)
  const isOwner = expense.submittedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to delete this expense' });
  }

  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Expense removed' });
};
