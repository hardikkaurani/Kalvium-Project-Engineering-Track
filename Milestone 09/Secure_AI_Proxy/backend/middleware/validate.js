export const validateMiddleware = (req, res, next) => {
  const { diff, context } = req.body;
  if (!diff || typeof diff !== 'string' || diff.trim().length === 0) {
    return res.status(400).json({ error: 'diff_required', message: 'Code diff is required.' });
  }
  if (diff.length > 5000) {
    return res.status(400).json({ error: 'diff_too_large', limit: 5000, received: diff.length });
  }
  if (!context || typeof context !== 'string') {
    return res.status(400).json({ error: 'context_required', message: 'Context description is required.' });
  }
  next();
};
