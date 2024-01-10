const express = require('express');
const mysql = require('mysql');
const app = express();
const config = require('s/config');
const apiRoutes = require('s/apiRoutes');
const port = 3000;

const app = express();
const port = 3000;

// Connect to the database using the configuration
const dbConnection = mysql.createConnection(config.dbConfig);

// Use the API routes defined in apiRoutes.js
app.use('/api', apiRoutes);

// Serve static files from the 'public' directory
app.use(express.static(__dirname));

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
