const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector.js');
const jobsRoute = require('./routes/api/jobsRoutes');
const skillsRoutes = require('./routes/api/skillsRoutes');


// Track skill fluency: Allow users to track how comfortable they are with skills 
// and if they need to improve certain skills

// Per Sirus: "Make use of the JOIN clause to join data from skills, users_skills, and jobs_skills"

// “Allows them to track which jobs require which skills, see how 
// frequently certain skills are noted within applications, and track 
// how comfortable they are with those skills/if they need to work on 
// those skills more (ex: 'Docker is noted in 60% of your applications')”

// GET a specific resource (e.g., get all of the skills a user has added to their skill list)
// GET route should basically return all of the skills that a user has added to their skill list
router.get('/:skill_id', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const userJobSkillsQuery = await db.query('SELECT * FROM skills WHERE user_id = ?', [user_id]);
        res.send(userJobSkillsQuery[0]);
    } catch (err) {
        console.error('Error getting users skills:', err);
        res.status(500).send('Query error');
    }
});

// GET a single skill by skill_id
router.get('/:skill_id', async (req, res) => {
    const user_id = req.user.user_id;
    const skill_id = req.params.skill_id;
    try {
        // Fetch skill by skill_id for the authenticated user
        const skillQuery = await db.query('SELECT * FROM skills WHERE skill_id = ? AND user_id = ?', [skill_id, user_id]);
        const jobSkillQuery = await db.query('SELECT * FROM jobs_skills WHERE skill_id = ? AND job_id = ?', [skill_id, job_id]);

        const skill = skillQuery[0][0];
        const jobSkill = jobSkillQuery[0][0];

        // Combine data into a single object
        const result = {
            ...skill,
            proficiency_required: jobSkill ? jobSkill.proficiency_required : null,
        };
        res.status(200).send(result);
    } catch (err) {
        console.error('Error fetching job skill:', err);
        res.status(500).send('Error fetching job skill');
    }
});

module.exports = router;