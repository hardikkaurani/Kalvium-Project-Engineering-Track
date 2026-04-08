const express = require('express');
const router = express.Router();
const confessionController = require('../controllers/confessionController');

// Create confession
router.post('/', confessionController.createConfession);

// Get all confessions
router.get('/', confessionController.getAllConfessions);

// Get confessions by category
router.get('/category/:cat', confessionController.getConfessionsByCategory);

// Get confession by ID
router.get('/:id', confessionController.getConfessionById);

// Delete confession
router.delete('/:id', confessionController.deleteConfession);

module.exports = router;
