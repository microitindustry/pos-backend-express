const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const Supplier = require('./Supplier');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    supplierId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Supplier,
            key: 'id'
        }
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true
});

// Define associations
Supplier.hasMany(PurchaseOrder, { foreignKey: 'supplierId', onDelete: 'CASCADE' });
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = PurchaseOrder;
