const cron = require('node-cron');
const { backupDatabase } = require('../controllers/backupController');

const backupCronJob = () => {
    cron.schedule('* * * * *', async () => { // Runs every hour
        console.log('⏳ Starting database backup...');

        try {
            let responseData;
            
            // Custom response object to capture data
            const mockRes = {
                status: (code) => ({
                    json: (data) => {
                        responseData = { status: code, data };
                    },
                }),
            };

            await backupDatabase({}, mockRes);
            console.log('✅ Database backup completed successfully!', responseData);
        } catch (err) {
            console.error('❌ Error backup database:', err.message);
        }
    });
};

module.exports = { backupCronJob };
