const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const PurchaseOrder = require('./PurchaseOrder');
const Product = require('./Product');

const PurchaseOrderItems = sequelize.define('PurchaseOrderItems', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    purchaseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: PurchaseOrder,
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
    }
}, {
    timestamps: true
});

// Define associations
PurchaseOrder.hasMany(PurchaseOrderItems, { foreignKey: 'purchaseId', onDelete: 'CASCADE' });
PurchaseOrderItems.belongsTo(PurchaseOrder, { foreignKey: 'purchaseId' });

Product.hasMany(PurchaseOrderItems, { foreignKey: 'productId', onDelete: 'CASCADE' });
PurchaseOrderItems.belongsTo(Product, { foreignKey: 'productId' });

module.exports = PurchaseOrderItems;
