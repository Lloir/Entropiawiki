module.exports = {
    dbConfig: {
        host: '127.0.0.1', // Change to your DB location
        user: 'test', // Change to your DB User
        password: 'test', // Change to your DB USER PASS
        database: 'wiki', // Set to your DB
    },
    certbotOptions: {
        certbotBin: 'certbot-auto', // Adjust if needed
        email: 'your-email@example.com', // Provide your email for renewal notifications
        domains: ['example.com', 'www.example.com'], // Add your domain(s)
        renewalDays: 30, // Number of days before expiration to renew
    },
};