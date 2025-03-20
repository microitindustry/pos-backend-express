const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const inventoryPurchaseController = require('../controllers/inventoryPurchaseController');

const router = express.Router();

router.post('/inventory-purchase', authenticateJWT, authorizeRole(true), inventoryPurchaseController.createInventoryPurchase);
router.get('/inventory-purchase', authenticateJWT, authorizeRole(true), inventoryPurchaseController.getAllInventoryPurchases);
router.get('/inventory-purchase/:purchaseId', inventoryPurchaseController.getInventoryPurchaseById);


module.exports = router;
