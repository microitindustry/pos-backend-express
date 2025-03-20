const express = require('express');
const router = express.Router();
const { backupDatabase, restoreDatabase } = require('../controllers/backupController');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');

router.post('/backup', authenticateJWT, authorizeRole(true), backupDatabase);
router.post('/restore', authenticateJWT, authorizeRole(true), restoreDatabase);

module.exports = router;
