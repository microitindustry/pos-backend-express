const { Op, fn, col, literal } = require('sequelize');
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
const Product = require('../models/Product');
const Customer = require('../models/Customer'); // Import Customer model
const { generateCustomPdf, generateMonthlySalesPdf, generateWeeklySalesPdf, generateDailySalesPdf } = require('../utils/pdfGenerator');

// 🗓️ Get Daily Sales Report (with Order Items & Product Info)
const getDailySales = async (req, res) => {
    try {
        const { download } = req.query;

        const dailySales = await Order.findAll({
            attributes: [
                [fn('TO_CHAR', col('Order.createdAt'), 'YYYY-MM-DD HH24:MI:SS'), 'date'], // Include time
                [fn('SUM', col('totalPrice')), 'totalSales'],
                [fn('COUNT', col('Order.id')), 'totalOrders']
            ],
            where: {
                createdAt: {
                    [Op.gte]: literal('CURRENT_DATE')
                }
            },
            include: [
                {
                    model: Customer,
                    attributes: ['customerName', 'customerPhone'], // Use correct field names from Customer model
                    required: true
                },
                {
                    model: OrderItems,
                    attributes: ['quantity', 'priceAtTime'],
                    include: [
                        {
                            model: Product,
                            attributes: ['productName', 'price', 'imageUrl']
                        }
                    ]
                }
            ],
            group: [
                'date',
                'Order.id',
                'OrderItems.id',
                'OrderItems->Product.id',
                'Customer.id' // Add Customer.id to GROUP BY
            ],
            order: [[literal('date'), 'DESC']]
        });

        // Step 2: Calculate total quantity sold per product
        const totalProductsSold = {};
        
        dailySales.forEach((sale) => {
            sale.OrderItems.forEach((item) => {
                const productName = item.Product.productName;
        
                if (!totalProductsSold[productName]) {
                    totalProductsSold[productName] = {
                        productName,
                        totalQuantitySold: 0,
                        totalSalesAmount: 0
                    };
                }
        
                totalProductsSold[productName].totalQuantitySold += item.quantity;
                totalProductsSold[productName].totalSalesAmount += item.quantity * item.priceAtTime;
            });
        });
        
        // Convert totalProductsSold to an array
        const totalProductsArray = Object.values(totalProductsSold);

        const data = {
            totalSales: dailySales.reduce((sum, sale) => sum + (sale.get('totalSales') || 0), 0),
            totalOrders: dailySales.reduce((sum, sale) => sum + (parseFloat(sale.get('totalOrders')) || 0), 0),
            dailySales: dailySales.map(sale => ({
                ...sale.toJSON(),
                customerName: sale.Customer.customerName, // Use correct field name
                customerPhone: sale.Customer.customerPhone // Use correct field name
            })),
            totalProductsSold: totalProductsArray
        };

        // Check if the request is for a PDF download
        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateDailySalesPdf(data);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=daily-sales-report.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            // Return JSON response
            res.status(200).json({ message: '📊 Daily Sales Report', data: data });
        }

    } catch (error) {
        console.error('Error in getDailySales:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 🗓️ Get Weekly Sales Report (with Order Items & Product Info)
const getWeeklySales = async (req, res) => {
    try {
        const { download } = req.query;

        const weeklySales = await Order.findAll({
            attributes: [
                [fn('DATE_TRUNC', 'week', col('Order.createdAt')), 'week'],
                [fn('SUM', col('totalPrice')), 'totalSales'],
                [fn('COUNT', col('Order.id')), 'totalOrders']
            ],
            where: {
                createdAt: {
                    [Op.gte]: literal('CURRENT_DATE - INTERVAL \'7 days\'')
                }
            },
            include: [
                {
                    model: Customer,
                    attributes: ['customerName', 'customerPhone'], // Use correct field names
                    required: true
                },
                {
                    model: OrderItems,
                    attributes: [
                        [fn('TO_CHAR', col('OrderItems.createdAt'), 'YYYY-MM-DD HH24:MI:SS'), 'date'], // Include time
                        'quantity', 'priceAtTime'],
                    include: [
                        {
                            model: Product,
                            attributes: [
                                'productName', 'price', 'imageUrl',]
                        }
                    ]
                }
            ],
            group: [
                'week',
                'Order.id',
                'OrderItems.id',
                'OrderItems->Product.id',
                'Customer.id' // Add Customer.id to GROUP BY
            ],
            order: [[literal('week'), 'DESC']]
        });

        // Step 2: Calculate total quantity sold per product
        const totalProductsSold = {};
        
        weeklySales.forEach((sale) => {
            sale.OrderItems.forEach((item) => {
                const productName = item.Product.productName;
        
                if (!totalProductsSold[productName]) {
                    totalProductsSold[productName] = {
                        productName,
                        totalQuantitySold: 0,
                        totalSalesAmount: 0
                    };
                }
        
                totalProductsSold[productName].totalQuantitySold += item.quantity;
                totalProductsSold[productName].totalSalesAmount += item.quantity * item.priceAtTime;
            });
        });
        
        // Convert totalProductsSold to an array
        const totalProductsArray = Object.values(totalProductsSold);

        const data = {
            totalSales: weeklySales.reduce((sum, sale) => sum + (sale.get('totalSales') || 0), 0),
            totalOrders: weeklySales.reduce((sum, sale) => sum + (parseFloat(sale.get('totalOrders')) || 0), 0),
            weeklySales: weeklySales.map(sale => ({
                ...sale.toJSON(),
                customerName: sale.Customer.customerName, // Use correct field name
                customerPhone: sale.Customer.customerPhone // Use correct field name
            })),
            totalProductsSold: totalProductsArray
        };

        // Check if the request is for a PDF download
        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateWeeklySalesPdf(data);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=weekly-sales-report.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            // Return JSON response
            res.status(200).json({ message: '📊 Weekly Sales Report', data: data });
        }

    } catch (error) {
        console.error('Error in getWeeklySales:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 🗓️ Get Monthly Sales Report (with Customer Info, Order Items & Product Info)
const getMonthlySales = async (req, res) => {
    try {
        const { download } = req.query;

        const monthlySales = await Order.findAll({
            attributes: [
                [fn('DATE_TRUNC', 'month', col('Order.createdAt')), 'month'], 
                [fn('SUM', col('totalPrice')), 'totalSales'],
                [fn('COUNT', col('Order.id')), 'totalOrders']
            ],
            where: {
                createdAt: {
                    [Op.gte]: literal("CURRENT_DATE - INTERVAL '6 month'")
                }
            },
            include: [
                {
                    model: Customer,
                    attributes: ['customerName', 'customerPhone'], // Use correct field names
                    required: true
                },
                {
                    model: OrderItems,
                    attributes: [
                        [fn('TO_CHAR', col('OrderItems.createdAt'), 'YYYY-MM-DD HH24:MI:SS'), 'date'],
                        'quantity', 'priceAtTime'],
                    include: [
                        {
                            model: Product,
                            attributes: [
                                'productName', 'price', 'imageUrl']
                        }
                    ]
                }
            ],
            group: [
                'month',
                'Order.id',
                'OrderItems.id',
                'OrderItems->Product.id',
                'Customer.id' // Add Customer.id to GROUP BY
            ],
            order: [[literal('month'), 'DESC']]
        });
        
        // Step 2: Calculate total quantity sold per product
        const totalProductsSold = {};
        
        monthlySales.forEach((sale) => {
            sale.OrderItems.forEach((item) => {
                const productName = item.Product.productName;
        
                if (!totalProductsSold[productName]) {
                    totalProductsSold[productName] = {
                        productName,
                        totalQuantitySold: 0,
                        totalSalesAmount: 0
                    };
                }
        
                totalProductsSold[productName].totalQuantitySold += item.quantity;
                totalProductsSold[productName].totalSalesAmount += item.quantity * item.priceAtTime;
            });
        });
        
        // Convert totalProductsSold to an array
        const totalProductsArray = Object.values(totalProductsSold);

        const data = {
            totalSales: monthlySales.reduce((sum, sale) => sum + (sale.get('totalSales') || 0), 0),
            totalOrders: monthlySales.reduce((sum, sale) => sum + (parseFloat(sale.get('totalOrders')) || 0), 0),
            monthlySales: monthlySales.map(sale => ({
                ...sale.toJSON(),
                customerName: sale.Customer.customerName, // Use correct field name
                customerPhone: sale.Customer.customerPhone // Use correct field name
            })),
            totalProductsSold: totalProductsArray
        };

        // Check if the request is for a PDF download
        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateMonthlySalesPdf(data);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=monthly-sales-report.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            // Return JSON response
            res.status(200).json({ message: '📊 Monthly Sales Report', data: data });
        }

    } catch (error) {
        console.error('Error in getMonthlySales:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 📊 Get Custom Sales Report(From Date → To Date) (with Customer Info, Order Items & Product Info)
const getCustomSales = async (req, res) => {
    try {
        const { fromDate, toDate, download } = req.query;

        // 🛑 Validate input dates
        if (!fromDate || !toDate) {
            return res.status(400).json({ message: "⚠️ Both 'fromDate' and 'toDate' are required!" });
        }

        // Convert to Date objects and adjust `toDate` to end of the day (23:59:59.999)
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999); // Extend to end of the day

        // ⏳ Fetch orders within the updated date range
        const customSales = await Order.findAll({
            attributes: [
                [fn('DATE', col('Order.createdAt')), 'date'],
                [fn('SUM', col('totalPrice')), 'totalSales'],
                [fn('COUNT', col('Order.id')), 'totalOrders']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Customer,
                    attributes: ['customerName', 'customerPhone'], // Use correct field names
                    required: true
                },
                {
                    model: OrderItems,
                    attributes: ['quantity', 'priceAtTime'],
                    include: [
                        {
                            model: Product,
                            attributes: ['productName', 'price', 'imageUrl']
                        }
                    ]
                }
            ],
            group: [
                'date',
                'Order.id',
                'OrderItems.id',
                'OrderItems->Product.id',
                'Customer.id' // Add Customer.id to GROUP BY
            ],
            order: [[literal('date'), 'DESC']]
        });

        // Step 2: Calculate total quantity sold per product
        const totalProductsSold = {};
        
        customSales.forEach((sale) => {
            sale.OrderItems.forEach((item) => {
                const productName = item.Product.productName;
        
                if (!totalProductsSold[productName]) {
                    totalProductsSold[productName] = {
                        productName,
                        totalQuantitySold: 0,
                        totalSalesAmount: 0
                    };
                }
        
                totalProductsSold[productName].totalQuantitySold += item.quantity;
                totalProductsSold[productName].totalSalesAmount += item.quantity * item.priceAtTime;
            });
        });
        
        // Convert totalProductsSold to an array
        const totalProductsArray = Object.values(totalProductsSold);

        const data = {
            startDate: startDate,
            endDate: endDate,
            totalSales: customSales.reduce((sum, sale) => sum + (sale.get('totalSales') || 0), 0),
            totalOrders: customSales.reduce((sum, sale) => sum + (parseFloat(sale.get('totalOrders')) || 0), 0),
            customSales: customSales.map(sale => ({
                ...sale.toJSON(),
                customerName: sale.Customer.customerName, // Use correct field name
                customerPhone: sale.Customer.customerPhone // Use correct field name
            })),
            totalProductsSold: totalProductsArray
        };

        // Check if the request is for a PDF download
        if (download === 'pdf') {
            // Generate PDF
            const pdfDoc = generateCustomPdf(data);

            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=custom-sales-report-${startDate.toISOString()}-${endDate.toISOString()}.pdf`);

            // Stream the PDF to the client
            pdfDoc.pipe(res);
            pdfDoc.end();
        } else {
            // Return JSON response
            res.status(200).json({ message: '📊 Custom Sales Report', data: data });
        }
    } catch (error) {
        console.error('Error in getCustomSales:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getDailySales, getWeeklySales, getMonthlySales, getCustomSales };