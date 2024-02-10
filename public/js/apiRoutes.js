const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('./db'); // Assumes you'll set up your database connector here

const router = express.Router();
const MAX_API_REQUESTS_PER_WINDOW = 100; // Customize your rate limit
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Configure rate limiting
const limiter = rateLimit({
    windowMs: WINDOW_DURATION_MS,
    max: MAX_API_REQUESTS_PER_WINDOW
});

router.use(limiter); // Apply to all routes

// API Routes
router.get('/planets', async (req, res) => {
    try {
        const planets = await db.Planet.findAll(); // Placeholder - adjust  if not using ORM
        res.json(planets);
    } catch (error) {
        console.error('Error fetching planets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch Mobs with Loot (NEEDS SECURITY ATTENTION)
router.get('/mobs', async (req, res) => {
    try {
        const mobs = await db.Mob.findAll({
            include: [db.Loot, db.Planet] // Assuming model associations if using Sequelize
        });
        res.json(mobs);
    } catch (error) {
        console.error('Error fetching mobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define the endpoint to fetch mob data with planet information
router.get('/mobs/planet', (req, res) => {
    console.log('Fetching mob data with planet information...');
    const sql = `
        SELECT
            mob.ID,
            mob.Name AS MobName,
            mob.PlanetID,
            planet.Name AS PlanetName
        FROM wiki.mob AS mob
        LEFT JOIN wiki.planet AS planet ON mob.PlanetID = planet.ID;
    `;
    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Mob data with planet information fetched successfully:', results);
            res.json(results);
        }
    });
});

// Define the endpoint to fetch mob data with loot

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

router.get('/weapon', (req, res) => {
    console.log('Fetching armor data...');
    const sql = `
SELECT \`weapon\`.\`ID\`,
    \`weapon\`.\`Name\`,
    \`weapon\`.\`Damage\`,
    \`weapon\`.\`Range\`,
    \`weapon\`.\`Reload_\`,
    \`weapon\`.\`Ammo\`,
    \`weapon\`.\`Decay\`,
    \`weapon\`.\`Producer\`,
    \`weapon\`.\`Price\`,
    \`weapon\`.\`Type_\`,
    \`weapon\`.\`Stab\`,
    \`weapon\`.\`Cut\`,
    \`weapon\`.\`Impact\`,
    \`weapon\`.\`Penetration\`,
    \`weapon\`.\`Shrapnel\`,
    \`weapon\`.\`Burn\`,
    \`weapon\`.\`Cold\`,
    \`weapon\`.\`Acid\`,
    \`weapon\`.\`Electric\`,
    \`weapon\`.\`Crafted\`,
    \`weapon\`.\`NamePart\`,
    \`weapon\`.\`Attacks\`,
    \`weapon\`.\`Source\`,
    \`weapon\`.\`LPSB_\`,
    \`weapon\`.\`Level\`,
    \`weapon\`.\`Class\`,
    \`weapon\`.\`Amplifier\`,
    \`weapon\`.\`AmmoID\`,
    \`weapon\`.\`HitActivityID\`,
    \`weapon\`.\`Type\`,
    \`weapon\`.\`Weight\`,
    \`weapon\`.\`DmgActivityID\`,
    \`weapon\`.\`HitReq\`,
    \`weapon\`.\`DmgReq\`,
    \`weapon\`.\`MaxedHit\`,
    \`weapon\`.\`MaxedDamage\`,
    \`weapon\`.\`MinTT\`,
    \`weapon\`.\`DiscVU\`,
    \`weapon\`.\`Confirmed\`,
    \`weapon\`.\`Concentration\`,
    \`weapon\`.\`ImpactRadius\`,
    \`weapon\`.\`Cooldown\`,
    \`weapon\`.\`CooldownGroup\`,
    \`weapon\`.\`SIBID\`,
    \`weapon\`.\`Personaleffects\`,
    \`weapon\`.\`Efficiency\`
FROM \`wiki\`.\`weapon\`;
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

module.exports = router;