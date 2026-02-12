const express = require('express');
const router = express.Router();
const { getAllPatterns, createPattern, updatePattern, deletePattern } = require('../controllers/pattern.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, getAllPatterns);
router.post('/', authMiddleware, adminOnly, createPattern);
router.put('/:id', authMiddleware, adminOnly, updatePattern);
router.delete('/:id', authMiddleware, adminOnly, deletePattern);

module.exports = router;
