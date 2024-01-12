const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const mysql = require('mysql');
const config = require('./s/config.js');
const apiRoutes = require('./s/apiRoutes.js');
const { exec } = require('child_process');

const app = express();
const port = 3000;

const dbConnection = mysql.createConnection(config.dbConfig);
dbConnection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error.message);
    } else {
        console.log('Connected to the database');
    }
});

app.use(express.static(__dirname));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Include your API routes
app.use('/api', apiRoutes);

// Certbot setup
const certbotOptions = config.certbotOptions;
const domain = config.certbotOptions.domains[0];
const email = config.certbotOptions.email;

// Check if SSL certificate is available and within its validity period
const checkCertificate = () => {
    if (fs.existsSync(`${domain}/privkey.pem`)) {
        const stats = fs.statSync(`${domain}/privkey.pem`);
        const now = new Date().getTime();
        const certExpiry = new Date(stats.ctime).getTime() + (90 * 24 * 60 * 60 * 1000); // Assuming 90 days validity

        if (now < certExpiry) {
            return true; // Certificate is available and within the validity period
        }
    }
    return false;
};

// Renew SSL certificate if needed
const renewCertificateIfNeeded = () => {
    const stats = fs.statSync(`${domain}/cert.pem`);
    const now = new Date().getTime();
    const certExpiry = new Date(stats.ctime).getTime() + (certbotOptions.renewalDays * 24 * 60 * 60 * 1000);

    if (now > certExpiry) {
        console.log('SSL certificate is expired or about to expire. Renewing...');
        exec(`sudo certbot certonly --standalone -d ${domain} --non-interactive --agree-tos -m ${email}`, (err, stdout, stderr) => {
            if (err) {
                console.error('Error renewing Certbot:', err);
            } else {
                console.log('SSL certificate renewed successfully');
                startServer();
            }
        });
    }
};

// local mode
if (process.argv.includes('--local')) {
    console.log('Local mode. Starting HTTP server without Certbot.');
    startServer();
} else {
    // Redirect HTTP to HTTPS
    app.use((req, res, next) => {
        if (!req.secure) {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });

    // Check and renew certificate if needed every day
    setInterval(renewCertificateIfNeeded, 24 * 60 * 60 * 1000);

    console.log('Starting HTTPS server.');
    startServer();
}

// Create server based on mode
function startServer() {
    if (process.argv.includes('--local')) {
        // Run HTTP server for local mode
        const httpServer = http.createServer(app);
        httpServer.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    } else {
        // Run HTTPS server for non-local mode
        const credentials = {
            key: fs.readFileSync(`${domain}/privkey.pem`, 'utf8'),
            cert: fs.readFileSync(`${domain}/cert.pem`, 'utf8'),
            ca: fs.readFileSync(`${domain}/chain.pem`, 'utf8'),
        };

        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(port, () => {
            console.log(`Server listening at https://localhost:${port}`);
        });
    }
}
