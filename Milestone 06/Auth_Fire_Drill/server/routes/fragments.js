const express = require('express');
const router = express.Router();
const { fragments, users } = require('../data/store');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', (req, res) => {
  res.json(fragments);
});

// FIX 4: Only Contributors, Curators, and Admins can create fragments
router.post('/', auth, roleCheck(['contributor', 'curator', 'admin']), (req, res) => {
  const { content, parentId } = req.body;
  const newFrag = {
    id: Date.now().toString(),
    content,
    parentId,
    userId: req.user.userId,
    author: users.find(u => u.id === req.user.userId)?.email,
    status: 'published',
    createdAt: new Date()
  };
  fragments.push(newFrag);
  res.status(201).json(newFrag);
});

// FIX 4: Owners can edit their own, Curators/Admins can edit any
router.put('/:id', auth, (req, res) => {
  const frag = fragments.find(f => f.id === req.params.id);
  if(!frag) return res.status(404).json({ error: 'Fragment not found' });

  const isOwner = frag.userId === req.user.userId;
  const isPrivileged = ['curator', 'admin'].includes(req.user.role);

  if (!isOwner && !isPrivileged) {
    return res.status(403).json({ error: 'Permission denied: Not the author' });
  }

  frag.content = req.body.content;
  res.json(frag);
});

// FIX 4: Only Curators and Admins can approve
router.post('/:id/approve', auth, roleCheck(['curator', 'admin']), (req, res) => {
  const frag = fragments.find(f => f.id === req.params.id);
  if(!frag) return res.status(404).json({ error: 'Fragment not found' });
  frag.status = 'published';
  res.json(frag);
});

// FIX 4: Only Admins can delete
router.delete('/:id', auth, roleCheck(['admin']), (req, res) => {
  const index = fragments.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  fragments.splice(index, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
