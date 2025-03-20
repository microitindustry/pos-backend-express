const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// ✅ Authentication Middleware
const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        
        req.user = await User.findByPk(decoded.id);

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid Token' });
    }
};

// ✅ Role-Based Authorization Middleware
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.isAdmin !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Access Denied' });
        }
        next();
    };
};

module.exports = { authenticateJWT, authorizeRole };
