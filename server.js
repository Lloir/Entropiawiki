const express = require('express');
const mysql = require('mysql');
const config = require('./s/config.js');
const apiRoutes = require('./s/apiRoutes.js');

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
