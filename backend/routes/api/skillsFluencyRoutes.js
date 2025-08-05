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
router.get('/', async (req, res) => {
    const job_id = req.params.job_id;
    const skill_id = req.params.skill_id;
    const user_id = req.user.user_id;
    try {
        const skillsQuery = await db.query('SELECT * FROM skills WHERE user_id = ?', [user_id]);
        const jobSkillsQuery = await db.query('SELECT * FROM jobs_skills WHERE skill_id = ? AND job_id = ?', [skill_id, job_id]);

        // Combine data from skills and job_skills tables into a single array of skill objects
        const skills = skillsQuery[0].map(skill => {
            // Find the corresponding job skill data based on skill_id
            const jobSkill = jobSkillsQuery[0].find(us => us.skill_id === skill.skill_id);
            return {
                ...skill,
                proficiency_required: jobSkill ? jobSkill.proficiency_required : null,
            };
        });
        res.status(200).send(skills);
    } catch (err) {
        console.error('Error getting job skills:', err);
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

// POST: create a new resource (e.g., add a users new skill to the database)
// POST route should receive data payload from frontend and store in DB
router.post('/', async (req, res) => {
    const job_id = req.params.job_id;
    const skill_id = req.params.skill_id;
    const user_id = req.user.user_id;
    const { name, description, proficiency, confidence_score, last_practiced, proficiency_required } = req.body;        
    try {
        // Insert new skill into the database
        await db.query('INSERT INTO skills (user_id, name, description) VALUES (?, ?, ?)', [user_id, name, description || null]);
        const lastId = await db.query('SELECT LAST_INSERT_ID()');
        const skillId = lastId[0][0]['LAST_INSERT_ID()'];
        // Insert proficiency and confidence score
        await db.query('INSERT INTO users_skills (user_id, skill_id, proficiency, confidence_score, last_practiced) VALUES (?, ?, ?, ?, ?)', [user_id, skillId, proficiency || null, confidence_score || null, last_practiced || null]);
        // Insert prociency_required
        await db.query('INSERT INTO jobs_skills (job_id, skill_id, profifiency_required) VALUES (?, ?, ?)', [user_id, skillId, proficiency_required || null]);
        res.status(201).send('Job skills added successfully');
    } catch (err) {
        console.error('Error adding job skill:', err);
        res.status(500).send('Error adding job skill');
    }
})


// PUT: update an existing resource (or create a new one if it doesn't exist)
// PUT route should receive data payload and update DB for that user ID
router.put('/', async (req, res) => {
    const job_id = req.params.job_id;
    const skill_id = req.params.skill_id;
    const user_id = req.user.user_id;
    const { name, description, proficiency, confidence_score, last_practiced, proficiency_required } = req.body;
    try {
        // Update skill name and description
        await db.query('UPDATE skills SET name = ?, description = ? WHERE skill_id = ? AND user_id = ?', [name, description || null, skill_id, user_id]);
        // Update proficiency, confidence score, and last_practiced
        await db.query('UPDATE users_skills SET proficiency = ?, confidence_score = ?, last_practiced =? WHERE user_id = ? AND skill_id =?', [proficiency || null, confidence_score || null, last_practiced || null, user_id, skill_id])
        // Update proficiency_required
        await db.query('UPDATE jobs_skills SET proficiency_required = ? WHERE job_id = ? AND skill_id = ?', [proficiency_required || null, job_id, skill_id])
        res.status(200).send('Skill updated successfully');
    } catch (err) {
        console.error('Error updating job skill:', err);
        res.status(500).send('Error updating job skill');
    }
});

// DELETE the specificed resource
// DELETE route should delete row from DB for that user ID
router.delete('/', async (req, res) => {
    const job_id = req.params.job_id;
    const skill_id = req.params.skill_id;
    const user_id = req.user.user_id;
    try {
        await db.query('DELETE FROM jobs_skills WHERE skill_id = ? AND job_id = ?', [skill_id, job_id]);
        await db.query('DELETE FROM users_skills WHERE skill_id = ? AND user_id = ?', [skill_id, user_id]);
        await db.query('DELETE FROM skills WHERE skill_id = ? AND user_id = ?', [skill_id, user_id]);
        res.status(200).send('Skill deleted successfully');
    } catch (err) {
        console.error('Error deleting job skill:', err);
        res.status(500).send('Error deleting job skill');
    }
});

module.exports = router;