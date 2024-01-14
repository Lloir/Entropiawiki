const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'your_host',
    user: 'your_user',
    password: 'your_password',
    database: 'your_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool.promise();