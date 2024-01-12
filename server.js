const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const config = require('./s/config.js');
const apiRoutes = require('./s/apiRoutes.js');
const certbot = require('certbot-auto');

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

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (!req.secure) {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

// Certbot setup
const certbotOptions = config.certbotOptions;

// Check if SSL certificate is available and within its validity period
const checkCertificate = () => {
    if (fs.existsSync(certbotOptions.domains[0] + '/privkey.pem')) {
        const stats = fs.statSync(certbotOptions.domains[0] + '/privkey.pem');
        const now = new Date().getTime();
        const certExpiry = new Date(stats.ctime).getTime() + (90 * 24 * 60 * 60 * 1000); // Assuming 90 days validity

        if (now < certExpiry) {
            return true; // Certificate is available and within validity period
        }
    }
    return false;
};

// Renew SSL certificate if needed
const renewCertificateIfNeeded = () => {
    const stats = fs.statSync(certbotOptions.domains[0] + '/cert.pem');
    const now = new Date().getTime();
    const certExpiry = new Date(stats.ctime).getTime() + (certbotOptions.renewalDays * 24 * 60 * 60 * 1000);

    if (now > certExpiry) {
        console.log('SSL certificate is expired or about to expire. Renewing...');
        certbot.renew(certbotOptions, (err, certs) => {
            if (err) {
                console.error('Error renewing Certbot:', err);
            } else {
                console.log('SSL certificate renewed successfully');
                startServer(certs);
            }
        });
    }
};

// Run Certbot only if the SSL certificate is not available or has expired
if (!checkCertificate()) {
    certbot.certonly(certbotOptions, (err, certs) => {
        if (err) {
            console.error('Error running Certbot:', err);
        } else {
            console.log('SSL certificate obtained/renewed successfully');
            startServer(certs);
        }
    });
} else {
    console.log('SSL certificate is available and within validity period');
    startServer();
}

// Check and renew certificate if needed every day
setInterval(renewCertificateIfNeeded, 24 * 60 * 60 * 1000);

// Create HTTPS server
function startServer(certs) {
    const credentials = {
        key: fs.readFileSync(certs ? certs.privkey : certbotOptions.domains[0] + '/privkey.pem', 'utf8'),
        cert: fs.readFileSync(certs ? certs.cert : certbotOptions.domains[0] + '/cert.pem', 'utf8'),
        ca: fs.readFileSync(certs ? certs.chain : certbotOptions.domains[0] + '/chain.pem', 'utf8'),
    };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port, () => {
        console.log(`Server listening at https://localhost:${port}`);
    });
}

// Create HTTP server for Certbot challenges
const httpServer = http.createServer((req, res) => {
    certbot.middleware.httpChallenge(req, res);
});

// Listen on port 80 for Certbot challenges
httpServer.listen(80, () => {
    console.log('Certbot HTTP server listening on port 80');
});
