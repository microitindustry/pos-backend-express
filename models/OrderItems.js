const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const Order = require('./Order');
const Product = require('./Product');

const OrderItems = sequelize.define('OrderItems', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    priceAtTime: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true
});

// Define associations
Order.hasMany(OrderItems, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItems.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItems, { foreignKey: 'productId', onDelete: 'CASCADE' });
OrderItems.belongsTo(Product, { foreignKey: 'productId' });

module.exports = OrderItems;
