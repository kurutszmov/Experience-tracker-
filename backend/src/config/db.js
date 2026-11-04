const { Pool } = require('pg');
require('dotenv').config();

// DATABASE_URL is used by cloud hosts (Render, Railway, Neon, Supabase); otherwise use separate DB_* vars
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    })
    : new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

pool.connect((err, client, release) => {
    if (err) {
        console.error('Failed to connect to DB', err);
    } else {
        console.log('Connected to DB successfully');
        release();
    }
});

module.exports = pool;