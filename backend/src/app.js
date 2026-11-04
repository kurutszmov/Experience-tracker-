const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();

// Web dev server + Capacitor mobile app origins (Android: https://localhost, iOS: capacitor://localhost).
// Extra origins (e.g. a deployed web frontend) can be added via CORS_ORIGINS=https://a.com,https://b.com
const allowedOrigins = [
    'http://localhost:5173',
    'https://localhost',
    'http://localhost',
    'capacitor://localhost',
    ...(process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean),
];

app.use(cors({
    origin: (origin, callback) => {
        // Requests without Origin (curl, health checks) are allowed
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
}));

app.use(express.json());
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Finance Tracker API работает' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/analytics', require('./routes/analytics'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});