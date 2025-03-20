const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

// 🔧 Configure Transporter (Use Your Email)
var transporter = nodemailer.createTransport({
    service: "gmail.com",
	port: 465,
	secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 📩 Send Low Stock Email
const sendLowStockEmail = async (lowStockProducts) => {
    try {
        // Fetch all admins from the database
        const admins = await User.findAll({ where: { isAdmin: true }, attributes: ['email'] });
        const adminEmails = admins.map(admin => admin.email);

        if (adminEmails.length === 0) {
            console.log('⚠️ No admin emails found.');
            return;
        }

        // Format product list
        let productList = '';
        lowStockProducts.forEach(product => {
            productList += `
                <tr>
                    <td>${product.productName}</td>
                    <td>${product.quantity}</td>
                </tr>
            `;
        });

        // 📧 Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmails, // Send to all admins
            subject: '⚠️ Low Stock Alert!',
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f8f9fa;
                                color: #333;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                width: 80%;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                text-align: center;
                                padding: 10px;
                                background-color: #f44336;
                                color: white;
                                border-radius: 8px 8px 0 0;
                            }
                            .header h2 {
                                margin: 0;
                                font-size: 24px;
                            }
                            .content {
                                padding: 20px;
                            }
                            .content h3 {
                                font-size: 18px;
                                margin-bottom: 10px;
                            }
                            .product-list {
                                border-collapse: collapse;
                                width: 100%;
                            }
                            .product-list th, .product-list td {
                                text-align: left;
                                padding: 8px;
                            }
                            .product-list th {
                                background-color: #f2f2f2;
                            }
                            .product-list tr:nth-child(even) {
                                background-color: #f9f9f9;
                            }
                            .footer {
                                text-align: center;
                                padding: 10px;
                                font-size: 12px;
                                color: #888;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h2>⚠️ Low Stock Alert!</h2>
                            </div>
                            <div class="content">
                                <h3>The following products are low on stock:</h3>
                                <table class="product-list">
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Current Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${productList}
                                    </tbody>
                                </table>
                                <p><strong>Please restock them soon!</strong></p>
                            </div>
                            <div class="footer">
                                <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };
        

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('✅ Low Stock Alert Email Sent to Admins!');
    } catch (error) {
        console.error('❌ Error Sending Email:', error.message);
    }
};

module.exports = { sendLowStockEmail };
