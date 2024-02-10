const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs').promises; // For reading certificates with Node.js
const path = require('path');
const mysql = require('mysql2');
const config = require('./public/js/config.js');
const apiRoutes = require('./public/js/apiRoutes.js');

const app = express();
const port = 3002;

// Configure database connection using mysql2
const dbConnection = mysql.createConnection(config.dbConfig);

// Helper function to start your server with or without Cerbot-obtained certificates
const startServer = (protocol, serverOptions) => {
    const server = protocol.createServer(serverOptions, app);
    server.listen(port, () => {
        console.log(`Server listening at ${protocol}://localhost:${port}`);
    });
};

// Database connection function
const connectToDatabase = () => {
    return new Promise((resolve, reject) => {
        dbConnection.connect((error) => {
            if (error) {
                reject(`Error connecting to the database: ${error.message}`);
            } else {
                console.log('Connected to the database');
                resolve();
            }
        });
    });
};

// Configure your Express middleware
const configureMiddleware = () => {
    app.use(express.static(__dirname)); // To expose the content of the current directory
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    app.use('/api', apiRoutes);
};

const main = async () => {

    // Initialize the database connection
    await connectToDatabase();

    // Configure Express middleware
    configureMiddleware();

    // Local Environment Check & Certificate Setup
    const letsEncryptDir = '/etc/letsencrypt/live/www.entropiawiki.co.uk/';

    if (process.argv.includes('--local')) {
        // Simple HTTP for local development
        console.log('Local mode. Starting HTTP server without Certbot.');
        startServer(http);
    } else {
        // Configure app-level redirection to HTTPS when in production
        app.use((req, res, next) => {
            if (!req.secure) {
                return res.redirect(`https://${req.headers.host}${req.url}`);
            }
            next();
        });

        // HTTPS setup
        console.log('Starting HTTPS server.');

        const [key, cert, ca] = await Promise.all([
            fs.readFile(path.join(letsEncryptDir, 'privkey.pem'), 'utf8'),
            fs.readFile(path.join(letsEncryptDir, 'cert.pem'), 'utf8'),
            fs.readFile(path.join(letsEncryptDir, 'chain.pem'), 'utf8'),
        ]);

        startServer(https, { key, cert, ca });
    }
};

main();
