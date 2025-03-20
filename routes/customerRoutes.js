const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.post('/customers', authenticateJWT, authorizeRole(true), customerController.createCustomer);  // Create customer
router.get('/customers', authenticateJWT, authorizeRole(true), customerController.getAllCustomers);  // Get all customers
router.get('/customers/:id', authenticateJWT, authorizeRole(true), customerController.getCustomerById);  // Get customer by ID
router.put('/customers/:id', authenticateJWT, authorizeRole(true), customerController.updateCustomer);  // Update customer
router.delete('/customers/:id', authenticateJWT, authorizeRole(true), customerController.deleteCustomer);  // Delete customer

module.exports = router;
