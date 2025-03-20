const Category = require('../models/Category');

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { customerName, customerPhone } = req.body;
        const newCategory = await Category.create({ categoryName, categoryDescription });
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a category by ID
const updateCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body;
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.categoryName = categoryName;
        category.categoryDescription = categoryDescription;
        await category.save();

        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.destroy();
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
