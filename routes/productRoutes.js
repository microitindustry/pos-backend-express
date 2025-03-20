const express = require('express');
const multer = require('multer');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');

const router = express.Router();

// // Configure Multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Save images inside 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Unique filename
//     }
// });
// const upload = multer({ storage });

// Configure Multer to handle files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Create Product (Admin Only)
router.post('/products', authenticateJWT, authorizeRole(true), upload.single('image'), productController.createProduct);

// // Create Product (Admin Only)
// router.post('/products', authenticateJWT, authorizeRole(true), upload.single('image'), productController.createProduct);
// router.post('/products', authenticateJWT, authorizeRole(true), productController.createProduct);

// Get All Low Stock Products (Public)
router.get('/products/low-stock', authenticateJWT, productController.getAllLowStockProducts);

// Get All Products (Public)
router.get('/products', productController.getAllProducts);

// Get Product by ID (Public)
router.get('/products/:id',authenticateJWT, productController.getProductById);

// Update Product (Admin Only)
router.put('/products/:id', authenticateJWT, authorizeRole(true), upload.single('image'), productController.updateProduct);
// router.put('/products/:id', authenticateJWT, authorizeRole(true), productController.updateProduct);

// Update Product Quantity
router.patch('/products/:id/quantity', authenticateJWT, authorizeRole(true), productController.updateProductQuantity);

// Delete Product (Admin Only)
router.delete('/products/:id', authenticateJWT, authorizeRole(true), productController.deleteProduct);

module.exports = router;
