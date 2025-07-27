const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector.js');

// Track skill fluency: Allow users to track how comfortable they are with skills 
// and if they need to improve certain skills

// Make use of the JOIN clause to join data from skills, users_skills, and jobs_skills

// “Allows them to track which jobs require which skills, see how 
// frequently certain skills are noted within applications, and track 
// how comfortable they are with those skills/if they need to work on 
// those skills more (ex: 'Docker is noted in 60% of your applications')”

// GET a specific resource (e.g., get all of the skills a user has added to their skill list)
// GET route should basically return all of the skills that a user has added to their skill list
router.get('/', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const skills = await db.query('SELECT * FROM users_skills WHERE user_id = ?', [user_id]);
        res.send(skills[0]);
    } catch (err) {
        console.error('Error getting skills:', err);
        res.status(500).send('Query error');
    }
});

// POST: create a new resource (e.g., add a new skill to the database)
// POST route should receive data payload from frontend and store in DB


// PUT: update an existing resource (or create a new one if it doesn't exist)
// PUT route should receive data payload and update DB for that user ID


// DELETE the specificed resource
// DELETE route should delete row from DB for that user ID

