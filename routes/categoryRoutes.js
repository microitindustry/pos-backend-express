const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.post('/categories', authenticateJWT, authorizeRole(true), categoryController.createCategory);  // Create category
router.get('/categories', authenticateJWT, authorizeRole(true), categoryController.getAllCategories);  // Get all categories
router.get('/categories/:id', authenticateJWT, authorizeRole(true), categoryController.getCategoryById);  // Get category by ID
router.put('/categories/:id', authenticateJWT, authorizeRole(true), categoryController.updateCategory);  // Update category
router.delete('/categories/:id', authenticateJWT, authorizeRole(true), categoryController.deleteCategory);  // Delete category

module.exports = router;
