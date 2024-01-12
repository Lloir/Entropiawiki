// config.js

const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    dbConfig: {
        host: process.env.DB_HOST || '127.0.0.1', // Change to your DB location
        user: process.env.DB_USER || 'test', // Change to your DB User
        password: process.env.DB_PASSWORD || 'test', // Change to your DB USER PASS
        database: process.env.DB_DATABASE || 'wiki', // Set to your DB
    },
    certbotOptions: {
        email: process.env.CERTBOT_EMAIL || 'your-email@example.com', // Provide your email for renewal notifications
        domains: process.env.CERTBOT_DOMAINS ? process.env.CERTBOT_DOMAINS.split(',') : ['example.com', 'www.example.com'], // Add your domain(s)
        renewalDays: process.env.CERTBOT_RENEWAL_DAYS || 30, // Number of days before expiration to renew
    },
};
