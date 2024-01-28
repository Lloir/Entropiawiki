const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    dbConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    emailConfig: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
    certbotOptions: {
        email: process.env.CERTBOT_EMAIL,
        domains: process.env.CERTBOT_DOMAINS ? process.env.CERTBOT_DOMAINS.split(',') : [],
        renewalDays: process.env.CERTBOT_RENEWAL_DAYS,
    },
};
