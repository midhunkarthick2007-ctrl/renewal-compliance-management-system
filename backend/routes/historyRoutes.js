const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// GET /api/renewals/:id/history
router.get('/:id/history', historyController.getRenewalHistory);

// POST /api/renewals/:id/history
router.post('/:id/history', historyController.addHistoryEntry);

module.exports = router;
