const express = require('express');
const router = express.Router();
const { getUserStats, getLeaderboard } = require('../controllers/stats.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/user/:userId', authMiddleware, getUserStats);
router.get('/leaderboard', authMiddleware, getLeaderboard);

module.exports = router;
