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

// GET how comfortable users are with those skills / if they need to work on those skills more
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

// GET skill gap report
router.get('/skill-gap/:job_id', async (req, res) => {
    const user_id = req.user.user_id;
    const job_id = req.params.job_id;
    try {
        // This can help user's visualize what skills they don't match well with for a given job
        const skillGapQuery = await db.query('SELECT s.name AS skill_name, js.proficiency_required, us.proficiency AS user_proficiency, us.confidence_score FROM jobs_skills js JOIN skills s ON js.skill_id = s.skill_id LEFT JOIN users_skills us ON s.skill_id = us.skill_id AND us.user_id = ? WHERE js.job_id = ? ORDER BY FIELD(js.proficiency_required, "expert", "advanced", "intermediate", "beginner"', [user_id, job_id]);
        res.send(skillGapQuery);
    } catch (err) {
        console.error('Error fetching skill gaps:', err);
        res.status(500).send('Error fetching skill gap');
    }
});

module.exports = router;