const express = require('express');
const cors = require('cors');
require('dotenv').config();
const expressSession = require('express-session')

const sequelize = require('./config/database');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const backupRoutes = require('./routes/backupRoutes');
const salesRoutes = require('./routes/salesRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryPurchaseRoutes = require('./routes/inventoryPurchaseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const customerRoutes = require('./routes/customerRoutes');

const { stockCheckerCronJob } = require('./jobs/stockCheckerCronJob');
const { backupCronJob } = require('./jobs/backupCronJob');

// stockCheckerCronJob();
// backupCronJob();

const app = express();
const port = process.env.PORT || 4000;

app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true } // Set to true if using HTTPS
}));

console.log("process.env.ALLOWED_ORIGIN",process.env.ALLOWED_ORIGIN)

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN, // Load allowed origin from environment variable
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Welcome to POS");
  });

app.use('/uploads', express.static('uploads'));
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', backupRoutes);
app.use('/api', salesRoutes);
app.use('/api', supplierRoutes);
app.use('/api', inventoryPurchaseRoutes);
app.use('/api', categoryRoutes);
app.use('/api', customerRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(port, () => console.log(`Server running on port ${port}`));
});