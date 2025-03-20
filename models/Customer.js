const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true, // Ensures only digits
            len: [10, 15] // Ensures reasonable phone number length
        }
    }
}, {
    timestamps: true
});

module.exports = Customer;
