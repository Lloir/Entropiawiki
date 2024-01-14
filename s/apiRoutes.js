const express = require('express');
const mysql = require('mysql');
const config = require('./config.js'); // Adjust the path based on your project structure

const router = express.Router();
const dbConnection = mysql.createConnection(config.dbConfig);

// Define the endpoint to fetch planet data
router.get('/planets', (req, res) => {
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

// Define the endpoint to fetch mob data with loot
router.get('/mobs', (req, res) => {
    console.log('Fetching mob data with loot...');
    const sql = `
        SELECT mob.ID, mob.Name AS MobName, 
               CAST(mob.PlanetID AS SIGNED) AS PlanetID, 
               planet.Name AS PlanetName, 
               loot.drop_name AS LootNames
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
router.get('/societies', (req, res) => {
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

// Define the endpoint to fetch loot data
router.get('/loot', (req, res) => {
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

// Define the endpoint to fetch all data (mobs, planets, loot)
router.get('/allData', (req, res) => {
    console.log('Fetching all data (mobs, planets, loot)...');
    const sql = `
        SELECT mob.ID, mob.Name AS MobName, 
               CAST(mob.PlanetID AS SIGNED) AS PlanetID, 
               planet.Name AS PlanetName, 
               GROUP_CONCAT(loot.drop_name) AS LootNames
        FROM wiki.mob AS mob 
        LEFT JOIN wiki.planet AS planet ON mob.PlanetID = planet.ID
        LEFT JOIN wiki.loot AS loot ON mob.ID = loot.MobID
        WHERE mob.Visible = 1
        GROUP BY mob.ID;
    `;
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('All data fetched successfully:', results);
            res.json(results);
        }
    });
});

// Define the endpoint to fetch vehicle data
router.get('/vehicles', (req, res) => {
    console.log('Fetching vehicle data...');

    const sqlVehicles = `
        SELECT
            ID,
            Name AS VehicleName,
            Type,
            Price
        FROM wiki.vehicle;
    `;

    dbConnection.query(sqlVehicles, (error, results) => {
        if (error) {
            console.error('Error executing vehicle query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Vehicle data fetched successfully:', results);
            res.json(results);
        }
    });
});

// Define the endpoint to fetch armor data
router.get('/armor', (req, res) => {
    console.log('Fetching armor data...');
    const sql = `
        SELECT
            armor.Name AS ArmorName,
            armor.Stab,
            armor.Cut,
            armor.Impact,
            armor.Penetration,
            armor.Shrapnel,
            armor.Burn,
            armor.Cold,
            armor.Acid,
            armor.Electric,
            armor.Durability,
            armor.Crafted,
            armor.Source,
            planet.Name AS PlanetName,  -- Fetch planet name from the joined table
            armor.PersonalEffrcys
        FROM wiki.armor
        LEFT JOIN wiki.planet ON armor.PlanetID = planet.ID
    `;

    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Armor data fetched successfully:', results);
            res.json(results);
        }
    });
});

// Define the endpoint to fetch continent data
router.get('/continents', (req, res) => {
    console.log('Fetching continent data...');

    const sqlContinents = `
SELECT
    PointX,
    PointY,
FROM wiki.continent
WHERE Name = 'Calypso';
    `;


    dbConnection.query(sqlContinents, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Map the results to add PlanetName and MapImagePath
            const mappedResults = results.map(result => ({
                ...result,
                MapImagePath: `Images/Maps/${result.Image}`,
            }));

            console.log('Continent data fetched successfully:', mappedResults);
            res.json(mappedResults);
        }
    });
});

// Define the endpoint to fetch location data
router.get('/locations', (req, res) => {
    console.log('Fetching location data...');

    const sqlLocations = `
        SELECT
            Continent,
            Lon,
            Lat,
            Type,
            Name,
            Density,
            \`Land Area\` AS LandArea,  -- Use backticks for column names with spaces
            Distance
        FROM wiki.location;
    `;

    dbConnection.query(sqlLocations, (error, results) => {
        if (error) {
            console.error('Error executing location query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Location data fetched successfully:', results);
            res.json(results);
        }
    });
});

module.exports = router;