const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Route to create an order (authenticated user)
router.post('/orders', authenticateJWT, authorizeRole(true), orderController.createOrder);

// Route to get all orders (admin only)
router.get('/orders', authenticateJWT, authorizeRole(true), orderController.getAllOrders);

// Route to get all orders items (admin only)
router.get('/ordersItems', authenticateJWT, authorizeRole(true), orderController.getAllOrdersItems);

// Route to get an order by ID (admin only)
router.get('/orders/:id', authenticateJWT, authorizeRole(true), orderController.getOrderById);

module.exports = router;
