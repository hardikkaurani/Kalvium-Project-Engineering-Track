const confessionService = require('../services/confessionService');

// Load environment variables
const DEFAULT_CATEGORY = process.env.DEFAULT_CATEGORY || 'general';
const DEFAULT_ANONYMOUS = process.env.DEFAULT_ANONYMOUS === 'true' || false;
const MAX_TITLE_LENGTH = parseInt(process.env.MAX_TITLE_LENGTH) || 200;
const MAX_CONTENT_LENGTH = parseInt(process.env.MAX_CONTENT_LENGTH) || 5000;

/**
 * Validate confession input data
 * Checks for required fields and length constraints
 * @param {Object} data - Input data to validate
 * @returns {Object} - {isValid: boolean, error: string|null}
 */
const validateConfessionInput = (data) => {
  const { title, content, category } = data;

  if (!title || !content) {
    return { isValid: false, error: 'Title and content are required' };
  }

  if (title.trim().length === 0 || content.trim().length === 0) {
    return { isValid: false, error: 'Title and content cannot be empty' };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return { isValid: false, error: `Title cannot exceed ${MAX_TITLE_LENGTH} characters` };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { isValid: false, error: `Content cannot exceed ${MAX_CONTENT_LENGTH} characters` };
  }

  if (category && category.length > 50) {
    return { isValid: false, error: 'Category name too long' };
  }

  return { isValid: true, error: null };
};

/**
 * Create a new confession
 * Validates input, processes request, and returns created confession
 */
const createConfession = async (req, res) => {
  try {
    const { title, content, category, anonymous } = req.body;

    // Validate input
    const validationResult = validateConfessionInput({ title, content, category });
    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.error });
    }

    // Create confession with defaults
    const confessionData = {
      title: title.trim(),
      content: content.trim(),
      category: category?.trim() || DEFAULT_CATEGORY,
      anonymous: anonymous !== undefined ? anonymous : DEFAULT_ANONYMOUS,
    };

    const createdConfession = await confessionService.createConfession(confessionData);

    res.status(201).json({
      message: 'Confession created successfully',
      data: createdConfession,
    });
  } catch (error) {
    console.error('Error creating confession:', error.message);
    res.status(500).json({ error: 'Failed to create confession' });
  }
};

/**
 * Retrieve all confessions
 * Returns complete list with count
 */
const getAllConfessions = async (req, res) => {
  try {
    const confessions = await confessionService.getAllConfessions();

    res.status(200).json({
      count: confessions.length,
      data: confessions,
    });
  } catch (error) {
    console.error('Error fetching all confessions:', error.message);
    res.status(500).json({ error: 'Failed to fetch confessions' });
  }
};

/**
 * Retrieve a specific confession by ID
 * Returns 404 if not found
 */
const getConfessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const confession = await confessionService.getConfessionById(id);

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.status(200).json({ data: confession });
  } catch (error) {
    console.error('Error fetching confession by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch confession' });
  }
};

/**
 * Retrieve confessions filtered by category
 * Parameter name: category (not abbreviated)
 * Returns empty array if no matches
 */
const getConfessionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category || category.trim().length === 0) {
      return res.status(400).json({ error: 'Category parameter required' });
    }

    const confessions = await confessionService.getConfessionsByCategory(category);

    res.status(200).json({
      category: category,
      count: confessions.length,
      data: confessions,
    });
  } catch (error) {
    console.error('Error fetching confessions by category:', error.message);
    res.status(500).json({ error: 'Failed to fetch confessions by category' });
  }
};

/**
 * Delete a confession by ID
 * Returns 404 if not found
 */
const deleteConfession = async (req, res) => {
  try {
    const { id } = req.params;
    const confessionDeleted = await confessionService.deleteConfession(id);

    if (!confessionDeleted) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.status(200).json({ message: 'Confession deleted successfully' });
  } catch (error) {
    console.error('Error deleting confession:', error.message);
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
