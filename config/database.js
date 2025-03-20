// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         dialect: process.env.DB_DIALECT
//     }
// );

// // Test Connection
// sequelize.authenticate()
//     .then(() => console.log("✅ Connected to PostgreSQL"))
//     .catch(err => console.error("❌ Connection error:", err));

// module.exports = sequelize;


// Production DB connection
const { Sequelize } = require('sequelize');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sequelize = new Sequelize(
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    {
        host: PGHOST,
        dialect: process.env.PGDIALECT,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

// Test Connection
sequelize.authenticate()
    .then(() => console.log("✅ Connected to Neon PostgreSQL"))
    .catch(err => console.error("❌ Connection error:", err));

module.exports = sequelize;