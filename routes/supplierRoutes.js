const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const supplierController = require('../controllers/supplierController');

const router = express.Router();


router.post('/suppliers', authenticateJWT, authorizeRole(true), supplierController.createSupplier);
router.get('/suppliers', authenticateJWT, authorizeRole(true), supplierController.getAllSuppliers);
router.get('/suppliers/:id', authenticateJWT, authorizeRole(true), supplierController.getSupplierById);
router.put('/suppliers/:id', authenticateJWT, authorizeRole(true), supplierController.updateSupplier);
router.delete('/suppliers/:id', authenticateJWT, authorizeRole(true), supplierController.deleteSupplier);

module.exports = router;
