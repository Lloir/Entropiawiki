// searchRoutes.js
const express = require('express');
const router = express.Router();
const dbConnection = require('./config.js');

router.get('/', (req, res) => {
    const searchTerm = req.query.term;

    // Construct a comprehensive query to fetch relevant data based on the search term
    const sql = `
        SELECT
            'creature' AS DataType,
            mob.ID,
            mob.Name AS EntityName,
            CAST(mob.PlanetID AS SIGNED) AS PlanetID,
            planet.Name AS PlanetName,
            GROUP_CONCAT(loot.drop_name) AS LootNames
        FROM wiki.mob AS mob
        LEFT JOIN wiki.planet AS planet ON mob.PlanetID = planet.ID
        LEFT JOIN wiki.loot AS loot ON mob.ID = loot.MobID
        WHERE mob.Visible = 1 AND (mob.Name LIKE '%${searchTerm}%' OR planet.Name LIKE '%${searchTerm}%')
        GROUP BY mob.ID

        UNION

        SELECT
            'vehicle' AS DataType,
            ID,
            Name AS EntityName,
            Type,
            Price
        FROM wiki.vehicle
        WHERE Name LIKE '%${searchTerm}%';
    `;

    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing database query:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Search results fetched successfully:', results);
            res.render('search', { results });
        }
    });
});

module.exports = router;
