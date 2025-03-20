const sequelize = require('../config/database'); // Import sequelize for transactions
const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const PurchaseOrderItems = require('../models/PurchaseOrderItems');
const { generateInventoryPurchasePdf } = require('../utils/pdfGenerator');

const createInventoryPurchase = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
        const { supplierId, items } = req.body;

        if (!supplierId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Invalid request: supplierId and items are required" });
        }

        // Validate supplier exists
        const supplier = await Supplier.findByPk(supplierId);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        // Fetch products from DB
        const productIds = items.map(item => item.productId);
        const products = await Product.findAll({ where: { id: productIds } });

        if (products.length !== productIds.length) {
            const foundProductIds = products.map(p => p.id);
            const missingProductIds = productIds.filter(id => !foundProductIds.includes(id));
            return res.status(400).json({ message: `Products not found: ${missingProductIds.join(', ')}` });
        }

        // Calculate total quantity
        let totalQuantity = 0;
        const purchaseItems = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
            }
            if (!item.quantity || item.quantity <= 0) {
                return res.status(400).json({ message: `Invalid quantity for product ${item.productId}` });
            }

            totalQuantity += item.quantity;
            purchaseItems.push({
                purchaseId: null, // Will be set after purchase order creation
                productId: item.productId,
                quantity: item.quantity,
            });
        }

        // Create inventory purchase
        const newPurchase = await PurchaseOrder.create({
            supplierId,
            totalQuantity
        }, { transaction });

        // Assign purchaseId to purchaseItems and bulk insert
        purchaseItems.forEach(item => item.purchaseId = newPurchase.id);
        const newPurchaseOrderItems = await PurchaseOrderItems.bulkCreate(purchaseItems, { transaction });

        await transaction.commit(); // Commit the transaction
        return res.status(201).json({
            message: "Inventory purchase created successfully",
            data: { newPurchase, newPurchaseOrderItems }
        });

    } catch (error) {
        await transaction.rollback(); // Rollback in case of error
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllInventoryPurchases = async (req, res) => {
    try {
        const purchases = await PurchaseOrder.findAll({
            include: [
                {
                    model: Supplier,
                    attributes: ['id', 'supplierName', 'contactPerson', 'phone', 'email', 'address', 'productsType']
                },
                {
                    model: PurchaseOrderItems,
                    attributes: ['id', 'quantity'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'productName', 'productDescription', 'price', 'imageUrl']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']] // Order by latest purchases
        });

        return res.status(200).json({ message: "Purchase orders retrieved successfully", data: purchases });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getInventoryPurchaseById = async (req, res) => {
    try {
        const { purchaseId } = req.params;
        const { download } = req.query;

        // Fetch the purchase order with associated supplier, items, and product details
        const purchase = await PurchaseOrder.findByPk(purchaseId, {
            include: [
                {
                    model: Supplier,
                    attributes: ['id', 'supplierName', 'contactPerson', 'phone', 'email', 'address', 'productsType']
                },
                {
                    model: PurchaseOrderItems,
                    attributes: ['id', 'quantity'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'productName', 'productDescription', 'price', 'imageUrl']
                        }
                    ]
                }
            ]
        });

        // If the purchase order is not found
        if (!purchase) {
            return res.status(404).json({ message: "Purchase order not found" });
        }

        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateInventoryPurchasePdf(purchase);

            const formattedDateTime =  new Date().toLocaleString('sv-SE').replace(' ', '_').replace(':', '_').replace(':', '_');
            console.log("🚀 ~ getInventoryPurchaseById ~ formattedDateTime:", formattedDateTime);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${formattedDateTime}-inventory-purchase-report.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            return res.status(200).json({ message: "Purchase order retrieved successfully", data: purchase });
        }

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};



module.exports = {
    createInventoryPurchase,
    getAllInventoryPurchases,
    getInventoryPurchaseById
};