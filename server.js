const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2');
const config = require('./s/config.js');
const apiRoutes = require('./s/apiRoutes.js');

const app = express();
const port = 3002;

const dbConnection = mysql.createConnection(config.dbConfig);

const startServer = (protocol, serverOptions) => {
    const server = protocol.createServer(serverOptions, app);
    server.listen(port, () => {
        console.log(`Server listening at ${protocol}://localhost:${port}`);
    });
};

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

const configureMiddleware = () => {
    app.use(express.static(__dirname));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    app.use('/api', apiRoutes);
};

const main = async () => {
    await connectToDatabase();
    configureMiddleware();

    const letsEncryptDir = '/etc/letsencrypt/live/www.entropiawiki.co.uk/';

    if (process.argv.includes('--local')) {
        console.log('Local mode. Starting HTTP server without Certbot.');
        startServer(http);
    } else {
        // Redirect HTTP to HTTPS
        app.use((req, res, next) => {
            if (!req.secure) {
                return res.redirect(`https://${req.headers.host}${req.url}`);
            }
            next();
        });

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
