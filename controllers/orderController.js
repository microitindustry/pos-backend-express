const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const createOrder = async (req, res) => {
    const { customerId, items } = req.body; // items = [{ productId, quantity }]

    try {
        // Validate if the customer exists
        const customer = await Customer.findByPk(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Calculate total order price
        let totalPrice = 0;

        // Fetch products from DB
        const products = await Product.findAll({
            where: {
                id: items.map(item => item.productId)
            }
        });

        if (products.length !== items.length) {
            return res.status(400).json({ message: 'One or more products not found' });
        }

        // Validate stock availability and calculate total price
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.productName}` });
            }
            totalPrice += product.price * item.quantity;
        }

        // Create the order
        const order = await Order.create({
            customerId,
            totalPrice
        });

        // Create order items & update product quantity
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);

            // Deduct stock
            await product.update({ quantity: product.quantity - item.quantity });

            // Create order item with priceAtTime
            await OrderItems.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                priceAtTime: product.price // Storing price at order time
            });
        }

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get All Orders (Admin Only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'customerName', 'customerPhone']
                },
                {
                    model: OrderItems,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'productName', 'productDescription', 'imageUrl']
                        }
                    ],
                    attributes: ['id', 'quantity', 'priceAtTime']
                }
            ],
            order: [['createdAt', 'DESC']] // Orders sorted by latest first
        });

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get All Order Items (Admin Only)
const getAllOrdersItems = async (req, res) => {
    try {
        const ordersItems = await OrderItems.findAll();
        res.status(200).json(ordersItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Get Order By ID (Admin Only)
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch order along with associated customer, order items, and product details
        const order = await Order.findByPk(id, {
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'customerName', 'customerPhone']
                },
                {
                    model: OrderItems,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'productName', 'productDescription', 'imageUrl']
                        }
                    ],
                    attributes: ['id', 'quantity', 'priceAtTime']
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createOrder, getAllOrders, getAllOrdersItems, getOrderById };
