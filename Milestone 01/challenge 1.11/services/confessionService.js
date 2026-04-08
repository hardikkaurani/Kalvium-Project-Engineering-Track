// Mock in-memory data store
let confessions = [
  {
    id: 1,
    title: 'First confession',
    content: 'This is my first confession',
    category: 'general',
    anonymous: false,
    createdAt: new Date(),
  },
];

let nextId = 2;

// Create a new confession
const createConfession = async (confessionData) => {
  const confession = {
    id: nextId++,
    ...confessionData,
    createdAt: new Date(),
  };
  confessions.push(confession);
  return confession;
};

// Get all confessions
const getAllConfessions = async () => {
  return confessions;
};

// Get confession by ID
const getConfessionById = async (id) => {
  return confessions.find((c) => c.id === parseInt(id));
};

// Get confessions by category
const getConfessionsByCategory = async (category) => {
  return confessions.filter((c) => c.category === category);
};

// Delete confession
const deleteConfession = async (id) => {
  const index = confessions.findIndex((c) => c.id === parseInt(id));
  if (index !== -1) {
    confessions.splice(index, 1);
    return true;
  }
  return false;
};

// Update confession
const updateConfession = async (id, updateData) => {
  const confession = confessions.find((c) => c.id === parseInt(id));
  if (confession) {
    Object.assign(confession, updateData);
    return confession;
  }
  return null;
};

module.exports = {
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfession,
  updateConfession,
};
