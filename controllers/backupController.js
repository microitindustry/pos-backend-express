const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sequelize = require('../config/database');
const Customer = require('../models/Category')
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const PurchaseOrderItems = require('../models/PurchaseOrderItems');
const Category = require('../models/Category');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16;

// Function to encrypt data
const encrypt = (text) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Function to decrypt data
const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
};

// Backup database
const backupDatabase = async (req, res) => {
    try {
        console.log("🚀 ~ ENCRYPTION_KEY:", ENCRYPTION_KEY);
        const customers = await Customer.findAll();
        const users = await User.findAll();
        const products = await Product.findAll();
        const orders = await Order.findAll();
        const orderItems = await OrderItems.findAll();
        const suppliers = await Supplier.findAll();
        const purchaseOrder = await PurchaseOrder.findAll();
        const purchaseOrderItems = await PurchaseOrderItems.findAll();
        const categories = await Category.findAll();

        const backupData = {
            customers,
            users,
            products,
            orders,
            orderItems,
            suppliers,
            purchaseOrder,
            purchaseOrderItems,
            categories,
        };

        const encryptedData = encrypt(JSON.stringify(backupData));
        const backupPath = path.join(__dirname, '../backups/db_backup.enc');

        fs.writeFileSync(backupPath, encryptedData);
        res.status(200).json({ message: '✅ Backup created successfully!', backupPath });
    } catch (err) {
        res.status(500).json({ message: '❌ Backup failed!', error: err.message });
    }
};

// Restore database
const restoreDatabase = async (req, res) => {
    try {
        const backupPath = path.join(__dirname, '../backups/db_backup.enc');

        if (!fs.existsSync(backupPath)) {
            return res.status(404).json({ message: '❌ No backup file found!' });
        }

        const encryptedData = fs.readFileSync(backupPath, 'utf8');
        const decryptedData = JSON.parse(decrypt(encryptedData));

        // Reset DB
        await sequelize.sync({ force: true });

        // Restore Customers
        await Customer.bulkCreate(decryptedData.customers);

        // Restore Users
        await User.bulkCreate(decryptedData.users);

        // Restore Categories
        await Category.bulkCreate(decryptedData.categories);

        // Restore Products
        await Product.bulkCreate(decryptedData.products);

        // Restore Orders
        await Order.bulkCreate(decryptedData.orders);

        // Restore Orders
        await OrderItems.bulkCreate(decryptedData.orderItems);

        // Restore Suppliers
        await Supplier.bulkCreate(decryptedData.suppliers);

        // Restore Purchase Orders
        await PurchaseOrder.bulkCreate(decryptedData.purchaseOrder);

        // Restore Purchase Order Items
        await PurchaseOrderItems.bulkCreate(decryptedData.purchaseOrderItems);

        res.status(200).json({ message: '✅ Database restored successfully!' });
    } catch (err) {
        res.status(500).json({ message: '❌ Restore failed!', error: err.message });
    }
};

module.exports = { backupDatabase, restoreDatabase };
