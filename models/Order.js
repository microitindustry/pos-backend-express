const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const Customer = require('./Customer'); // Import Customer model

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Corrected UUID default value
        primaryKey: true
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Customer,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true
});

// Define association
Customer.hasMany(Order, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = Order;
