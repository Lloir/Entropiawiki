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

// Define the endpoint to fetch planet data
app.get('/api/planets', (req, res) => {
    console.log('Fetching planet data...');
    const sql = 'SELECT ID, Name FROM planet WHERE Visible = 1';
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Planet data fetched successfully:', results);
            res.json(results);
        }
    });
});

app.get('/api/mobs', (req, res) => {
    console.log('Fetching mob data with loot...');
    const sql = `
        SELECT mob.ID, mob.Name AS MobName, 
               CAST(mob.PlanetID AS SIGNED) AS PlanetID, 
               planet.Name AS PlanetName, 
               loot.drop_name AS LootName  -- Use drop_name instead of loot.Name
        FROM wiki.mob AS mob 
        LEFT JOIN wiki.planet AS planet ON mob.PlanetID = planet.ID
        LEFT JOIN wiki.loot AS loot ON mob.ID = loot.MobID
    `;
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Mob data with loot fetched successfully:', results);
            res.json(results);
        }
    });
});

// Define the endpoint to fetch society data
app.get('/api/societies', (req, res) => {
    console.log('Fetching society data...');
    const sql = 'SELECT ID, Name, Founder_, Leader_, FoundTime, URL FROM wiki.society';
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Society data fetched successfully:', results);
            res.json(results);
        }
    });
});

app.get('/api/loot', (req, res) => {
    console.log('Fetching loot data...');
    const sql = 'SELECT MobID, drop_name FROM wiki.loot';
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Loot data fetched successfully:', results);
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
