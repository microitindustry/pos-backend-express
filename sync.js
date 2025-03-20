const sequelize = require('./config/database');
const User = require('./models/User');

sequelize.sync({ force: true })  // `force: true` drops tables before re-creating
    .then(() => {
        console.log("✅ Database & tables created!");
        process.exit();
    })
    .catch(err => console.error("❌ Error syncing database:", err));
