const express = require('express');
const router = express.Router();
const {
    getAllSubmissions,
    getSubmissionById,
    createSubmission,
    updateSubmission,
    deleteSubmission,
    updateStatus
} = require('../controllers/submission.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', authMiddleware, getAllSubmissions);
router.get('/:id', authMiddleware, getSubmissionById);
router.post('/', authMiddleware, upload.single('screenshot'), createSubmission);
router.put('/:id', authMiddleware, upload.single('screenshot'), updateSubmission);
router.delete('/:id', authMiddleware, deleteSubmission);
router.patch('/:id/status', authMiddleware, adminOnly, updateStatus);

module.exports = router;
