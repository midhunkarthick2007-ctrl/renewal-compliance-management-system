const express = require('express');
const router = express.Router();
const renewalController = require('../controllers/renewalController');

// Get all
router.get('/', renewalController.getAllRenewals);

// Get by ID
router.get('/:id', renewalController.getRenewalById);

// Create
router.post('/', renewalController.createRenewal);

// Update
router.put('/:id', renewalController.updateRenewal);

// Delete
router.delete('/:id', renewalController.deleteRenewal);

module.exports = router;
