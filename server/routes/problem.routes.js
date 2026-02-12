const express = require('express');
const router = express.Router();
const { getAllProblems, getProblemById, createProblem, updateProblem, deleteProblem } = require('../controllers/problem.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, getAllProblems);
router.get('/:id', authMiddleware, getProblemById);
router.post('/', authMiddleware, adminOnly, createProblem);
router.put('/:id', authMiddleware, adminOnly, updateProblem);
router.delete('/:id', authMiddleware, adminOnly, deleteProblem);

module.exports = router;
