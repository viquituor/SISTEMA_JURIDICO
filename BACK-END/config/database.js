const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'BD_ADVOCACIA',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

module.exports = pool;

