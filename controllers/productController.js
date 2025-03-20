const Product = require('../models/Product');
const Category = require('../models/Category');
const { Op } = require('sequelize');
const { put } = require("@vercel/blob");

// ✅ Create Product (Admin Only)
const createProduct = async (req, res) => {
    try {
        const { categoryId, productName, productDescription, price, quantity } = req.body;

        // Validate required fields
        if (!categoryId || !productName || !productDescription || !price || !quantity) {
            return res.status(400).json({ message: "Invalid request: categoryId, productName, productDescription, price, and quantity are required" });
        }

        // Validate category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        let imageUrl = null;

        // Upload image to Vercel Blob if file is present
        if (req.file) {
            const { url } = await put(`products/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
                access: 'public',
                contentType: req.file.mimetype,
            });
            imageUrl = url;
        }

        // Create the product with the image URL
        const newProduct = await Product.create({
            categoryId,
            productName,
            productDescription,
            price,
            quantity,
            imageUrl,
        });

        // Fetch the product along with the Category relation
        const productWithCategory = await Product.findOne({
            where: { id: newProduct.id },
            include: [{ model: Category, attributes: ['categoryName'] }], // Include category details
        });

        res.status(201).json(productWithCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// // ✅ Create Product (Admin Only)
// const createProduct = async (req, res) => {
//     try {
//         const { categoryId, productName, productDescription, price, quantity } = req.body;
//         const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save image URL

//         if (!categoryId) {
//             return res.status(400).json({ message: "Invalid request: categoryId is required" });
//         }
//         if (!productName ||!productDescription ||!price ||!quantity) {
//             return res.status(400).json({ message: "Invalid request: productName, productDescription, price, and quantity are required" });
//         }

//         // Validate category exists
//         const category = await Category.findByPk(categoryId);
//         if (!category) {
//             return res.status(404).json({ message: "Category not found" });
//         }

//         const newProduct = await Product.create({ categoryId, productName, productDescription, price, quantity, imageUrl });

//         // Fetch the product along with the Category relation
//         const productWithCategory = await Product.findOne({
//             where: { id: newProduct.id },
//             include: [{ model: Category, attributes: ['categoryName'] }] // Include category details
//         });
        
//         res.status(201).json(productWithCategory);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// ✅ Get All Low Stock Products (Public)
const getAllLowStockProducts = async (req, res) => {
    try {
        const lowStockProducts = await Product.findAll({
            where: {
                quantity: { [Op.lte]: 5 }
            },
            include: [{
                model: Category,
                attributes: ['categoryName']
            }]
        });
        res.json(lowStockProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get All Products (Public)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category, attributes: ['categoryName'] }], // Include the Category model
          });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get Product by ID (Public)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, productName, productDescription, price, quantity } = req.body;

        // Find the product
        const product = await Product.findByPk(id, {
            include: [{ model: Category, attributes: ['id', 'categoryName'] }], // Include Category
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validate required fields
        if (!categoryId || !productName || !productDescription || !price || !quantity) {
            return res.status(400).json({ message: "Invalid request: categoryId, productName, productDescription, price, and quantity are required" });
        }

        // Validate category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        let imageUrl = product.imageUrl; // Keep the existing image URL by default

        // If a new image is uploaded, upload it to Vercel Blob
        if (req.file) {
            // Upload the new image to Vercel Blob
            const { url } = await put(`products/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
                access: 'public',
                contentType: req.file.mimetype,
            });
            imageUrl = url; // Update the image URL with the new one
        }

        // Update product details
        await product.update({
            categoryId,
            productName,
            productDescription,
            price,
            quantity,
            imageUrl, // Use the updated or existing image URL
        });

        // Fetch the updated product along with the Category relation
        const updatedProduct = await Product.findOne({
            where: { id: product.id },
            include: [{ model: Category, attributes: ['categoryName'] }], // Include Category
        });

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { categoryId, productName, productDescription, price, quantity } = req.body;
        
//         // Find the product
//         const product = await Product.findByPk(id, {
//             include: [{ model: Category, attributes: ['id', 'categoryName'] }], // Include Category
//           });
        
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         if (!categoryId) {
//             return res.status(400).json({ message: "Invalid request: categoryId is required" });
//         }
//         if (!productName ||!productDescription ||!price ||!quantity) {
//             return res.status(400).json({ message: "Invalid request: productName, productDescription, price, and quantity are required" });
//         }

//         // Validate category exists
//         const category = await Category.findByPk(categoryId);
//         if (!category) {
//             return res.status(404).json({ message: "Category not found" });
//         }

//         // Handle image URL if a new image is uploaded
//         const imageUrl = req.file ? `/uploads/${req.file.filename}` : product.imageUrl;

//         // Update product details
//         await product.update({
//             categoryId,
//             productName,
//             productDescription,
//             price,
//             quantity,
//             imageUrl
//         });

//         const updatedProduct = await Product.findOne({
//             where: { id: product.id },
//             include: [{ model: Category, attributes: ['categoryName'] }] // Include Category
//         });

//         res.status(200).json(updatedProduct);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

const updateProductQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        console.log("🚀 ~ updateProductQuantity ~ quantity:", quantity);

        if (!quantity || isNaN(quantity)) {
            return res.status(400).json({ message: 'Invalid quantity value' });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.quantity += quantity;

        await product.save();

        return res.status(200).json({ message: 'Product quantity updated successfully', product });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Delete Product (Admin Only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createProduct,
    getAllLowStockProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductQuantity,
    deleteProduct
};
