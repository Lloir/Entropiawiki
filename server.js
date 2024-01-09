const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Replace these values with your actual database connection details
const dbConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'test',
    password: 'test',
    database: 'wiki',
});

// Connect to the database
dbConnection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error.message);
    } else {
        console.log('Connected to the database');
    }
});

// Serve static files from the 'public' directory
app.use(express.static(__dirname));

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Define the endpoint to fetch mob data
app.get('/api/mobs', (req, res) => {
    console.log('Fetching mob data...');
    const sql = 'SELECT ID, Name, Stab, Cut, Impact, Penetration, Shrapnel, Burn, Cold, Acid, Electric, Speed, Combat, Movement, ClassID, ImageID, Visible, Tamable, Sweatable, ActivityID, ScanActID, Attacks, Range, Aggression, PlanetID, MinHP, MinGlobal FROM wiki.mob';  // Adjusted query
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Mob data fetched successfully:', results);
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
