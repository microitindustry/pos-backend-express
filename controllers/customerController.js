const Customer = require('../models/Customer');

// Create a new customer
const createCustomer = async (req, res) => {
    try {
        const { customerName, customerPhone } = req.body;
        const newCustomer = await Customer.create({ customerName, customerPhone });
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a customer by ID
const updateCustomer = async (req, res) => {
    try {
        const { customerName, customerPhone } = req.body;
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        customer.customerName = customerName;
        customer.customerPhone = customerPhone;
        await customer.save();

        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a customer by ID
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.destroy();
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
