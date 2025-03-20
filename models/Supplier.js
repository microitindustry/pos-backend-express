const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Supplier = sequelize.define('Supplier', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
    },
    supplierName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactPerson: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    productsType: {
        type: DataTypes.STRING,
        allowNull: false, // Ensure this field is required
        validate: {
            notEmpty: true, // Prevent empty values
        },
    },
}, {
    timestamps: true
});

module.exports = Supplier;
