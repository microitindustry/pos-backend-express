const Supplier = require('../models/Supplier')

const createSupplier = async (req, res) => {
    try {
        const { supplierName, contactPerson, phone, email, address, productsType } = req.body;

        const newSupplier = await Supplier.create({ supplierName, contactPerson, phone, email, address, productsType });
        res.status(201).json(newSupplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        await supplier.update(req.body);
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        await supplier.destroy();
        res.json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};
