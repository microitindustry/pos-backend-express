const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Register a user
// const register = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Check if email already exists
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) return res.status(400).json({ error: 'Email already exists' });

//         // Create user
//         const user = await User.create({ name, email, password, isAdmin: false });
//         res.status(201).json({ user: { name: user.name, email: user.email } });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
        res.json({ token, user: {
            id: user.id,
            email: user.email,
            name: user.name,
            adminRole: user.isAdmin
        }});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// fetch user 
const fetchUser = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Fetch the user from the database
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user data (excluding sensitive information like password)
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            adminRole: user.isAdmin,
        });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    login,
    fetchUser
}