const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/sales/daily', authenticateJWT, authorizeRole(true), salesController.getDailySales);
router.get('/sales/weekly', authenticateJWT, authorizeRole(true), salesController.getWeeklySales);
router.get('/sales/monthly', authenticateJWT, authorizeRole(true), salesController.getMonthlySales);
router.get('/sales/custom', authenticateJWT, authorizeRole(true), salesController.getCustomSales)

module.exports = router;
