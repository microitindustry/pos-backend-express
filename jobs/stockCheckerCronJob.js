const cron = require('node-cron');
const Product = require('../models/Product');
const { sendLowStockEmail } = require('../utils/emailService');
const { Op } = require('sequelize');



const stockCheckerCronJobAlert = () => {
    cron.schedule('* * * * *', async () => { // Runs every hour
        console.log('🔍 Checking for low-stock products...');

        try {
            // Find products where quantity ≤ 5
            const lowStockProducts = await Product.findAll({
                where: {
                    quantity: { [Op.lte]: 5 }
                }
            });

            if (lowStockProducts.length > 0) {
                console.log('⚠️ Low Stock Products Found:', lowStockProducts);

            } else {
                console.log('✅ No low-stock products found.');
            }
        } catch (err) {
            console.error('❌ Error checking stock:', err.message);
        }
    });
};


const stockCheckerCronJobEmail = () => {
    cron.schedule('* * * * *', async () => { // Runs every hour
        console.log('🔍 Checking for low-stock products...');

        try {
            // Find products where quantity ≤ 5
            const lowStockProducts = await Product.findAll({
                where: {
                    quantity: { [Op.lte]: 5 }
                }
            });

            if (lowStockProducts.length > 0) {
                console.log('⚠️ Low Stock Products Found:', lowStockProducts);

                // 📧 Send an email notification to admins
                await sendLowStockEmail(lowStockProducts);
            } else {
                console.log('✅ No low-stock products found.');
            }
        } catch (err) {
            console.error('❌ Error checking stock:', err.message);
        }
    });
};

module.exports = { stockCheckerCronJobAlert, stockCheckerCronJobEmail };
