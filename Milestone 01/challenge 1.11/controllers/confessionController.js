const confessionService = require('../services/confessionService');

// Create a new confession
const createConfession = async (req, res) => {
  try {
    const { title, content, category, anonymous } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const confession = await confessionService.createConfession({
      title,
      content,
      category: category || 'general',
      anonymous: anonymous || false,
    });

    res.status(201).json({
      message: 'Confession created successfully',
      data: confession,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create confession' });
  }
};

// Get all confessions
const getAllConfessions = async (req, res) => {
  try {
    const confessions = await confessionService.getAllConfessions();
    res.status(200).json({
      count: confessions.length,
      data: confessions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch confessions' });
  }
};

// Get confession by ID
const getConfessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const confession = await confessionService.getConfessionById(id);

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.status(200).json({ data: confession });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch confession' });
  }
};

// Get confessions by category
const getConfessionsByCategory = async (req, res) => {
  try {
    const { cat } = req.params;
    const confessions = await confessionService.getConfessionsByCategory(cat);

    res.status(200).json({
      category: cat,
      count: confessions.length,
      data: confessions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch confessions by category' });
  }
};

// Delete confession
const deleteConfession = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await confessionService.deleteConfession(id);

    if (!success) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.status(200).json({ message: 'Confession deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete confession' });
  }
};

module.exports = {
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfession,
};
