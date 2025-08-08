// Citation for SQL queries:
// Date: 08/07/2025
// Source: ChatGPT
// These SQL queries were generated with the help of ChatGPT
// The following is the prompt from the GenAI interaction that led to these SQL queries
// "If I show you my DDL for some tables, can you tell me how I can implement this requirement: 
// 'see how frequently certain skills are noted within applications, and track how comfortable 
// they are with those skills/if they need to work on those skills more'"

const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector.js');

// GET how frequently certain skills are noted within job applications
router.get('/skill-frequency', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        // This tells you how "in-demand" each skill is across all job applications
        const skillFrequencyQuery = await db.query('SELECT s.skill_id, s.name AS skill_name, COUNT(js.job_id) AS frequency_in_applications FROM skills s JOIN jobs_skills js ON s.skill_id = js.skill_id WHERE s.user_id = ? GROUP BY s.skill_id, s.name ORDER BY frequency_in_applications DESC;', [user_id]);
        res.send(skillFrequencyQuery[0]);
    } catch (err) {
        console.error('Error fetching skill frequencies:', err);
        res.status(500).send('Error fetching skill frequency');
    }
});

// GET returns what skills the user should work on based on confidence level and the date they last practiced skill
router.get('/skill-comfort', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        // This identifies skills the user should work on
        const skillComfortQuery = await db.query('SELECT s.skill_id, s.name AS skill_name, us.proficiency, us.confidence_score, us.last_practiced FROM users_skills us JOIN skills s ON us.skill_id = s.skill_id WHERE us.user_id = ? AND (us.confidence_score <5 OR us.last_practiced < CURDATE() - INTERVAL 30 DAY) ORDER BY us.confidence_score ASC', [user_id]);
        res.send(skillComfortQuery[0]);
    } catch (err) {
        console.error('Error fetching skills to work on:', err);
        res.status(500).send('Error fetching skill to work on');
    }
});

module.exports = router;