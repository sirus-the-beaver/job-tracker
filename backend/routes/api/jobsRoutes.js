// Citation for the following:
// Date: 07/17/2025
// Source: https://medium.com/@ibrahimhz/creating-your-first-backend-with-node-js-step-by-step-guide-892769af4cb0
// Author(s): Ibrahim


// routes/jobs.js
const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector.js');

// a language of verbs (such as GET, POST, PUT, & DELETE) describe what should happen


// GET a specific resource (e.g., get all of the jobs a user has applied to)
// GET route should basically return all of the jobs that a user has applied to
router.get('/', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const jobs = await db.query('SELECT * FROM jobs WHERE user_id = ?', [user_id]);
        // Fetch skills associated with the jobs for the user
        const jobsSkills = await db.query('SELECT * FROM jobs_skills WHERE job_id IN (SELECT job_id FROM jobs WHERE user_id = ?)', [user_id]);
        // Combine jobs with their associated skills
        if (jobsSkills[0].length === 0) {
            for (const job of jobs[0]) {
                job.skills = jobsSkills[0].filter(skill => skill.job_id === job.job_id).map(skill => ({
                    skill_id: skill.skill_id,
                    proficiency_required: skill.proficiency_required
                }));
            }
        }
        res.status(200).send(jobs[0]);
    } catch (err) {
        console.error('Error getting jobs:', err);
        res.status(500).send('Query error');
    }
});

// GET a specific resource by ID (e.g., get a specific job by job_id)
router.get('/:job_id', async (req, res) => {
    const user_id = req.user.user_id;
    const { job_id } = req.params;
    try {
        const job = await db.query('SELECT * FROM jobs WHERE job_id = ? AND user_id = ?', [job_id, user_id]);
        const jobsSkills = await db.query('SELECT * FROM jobs_skills WHERE job_id = ?', [job_id]);
        // Combine job with its associated skills
        if (jobsSkills[0].length > 0) {
            job[0][0].skills = jobsSkills[0].map(skill => ({
                skill_id: skill.skill_id,
                proficiency_required: skill.proficiency_required
            }));
        }
        res.status(200).send(job[0][0]);
    } catch (err) {
        console.error('Error getting job by ID:', err);
        res.status(500).send('Query error');
    }
});

// POST: create a new resource (e.g., add a new job to the database)
// POST route should receive data payload from frontend and store in DB
router.post('/', async (req, res) => {
    const user_id = req.user.user_id;
    const { positionTitle, company, city, state, status, salary_min, salary_max, application_date, notes, classification, tier, link, skills } = req.body;
    try {
        await db.query('INSERT INTO jobs (user_id, positionTitle, company, city, state, status, salary_min, salary_max, application_date, notes, classification, tier, link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            user_id,
            positionTitle,
            company,
            city || null,
            state || null,
            status,
            salary_min || null,
            salary_max || null,
            application_date || null,
            notes || null,
            classification,
            tier || null,
            link || null,
        ]);
        // Insert into jobs_skills
        if (skills.length > 0) {
            const job_id = (await db.query('SELECT LAST_INSERT_ID() AS job_id'))[0][0].job_id;
            for (const skill of skills) {
                const skill_id = skill.skill_id;
                const profiency_required = skill.proficiency_required === 'unknown' ? null : skill.proficiency_required;
                await db.query('INSERT INTO jobs_skills (job_id, skill_id, proficiency_required) VALUES (?, ?, ?)', [
                    job_id,
                    skill_id,
                    profiency_required,
                ]);
            }
        }
        res.status(201).send('Insert succeeded');
    } catch (err) {
        console.error('Error while adding a new job:', err);
        res.status(500).send('Insert failed');
    }
})
// PUT: update an existing resource (or create a new one if it doesn't exist)
// PUT route should receive data payload and update DB for that job ID
router.put('/:job_id', async (req, res) => {
    const user_id = req.user.user_id;
    const { job_id } = req.params;
    const { positionTitle, company, city, state, status, salary_min, salary_max, application_date, notes, classification, tier, link, skills } = req.body;
    try {
        await db.query('UPDATE jobs SET positionTitle = ?, company = ?, city = ?, state = ?, status = ?, salary_min = ?, salary_max = ?, application_date = ?, notes = ?, classification = ?, tier = ?, link = ? WHERE job_id = ? AND user_id = ?',  [
            positionTitle,
            company,
            city || null,
            state || null,
            status,
            salary_min || null,
            salary_max || null,
            application_date || null,
            notes || null,
            classification,
            tier || null,
            link || null,
            job_id,
            user_id,
        ]);
        // Delete existing skills for the job
        await db.query('DELETE FROM jobs_skills WHERE job_id = ?', [job_id]);
        // Insert new skills for the job
        if (skills.length > 0) {
            for (const skill of skills) {
                const skill_id = skill.skill_id;
                const proficiency_required = skill.proficiency_required === 'unknown' ? null : skill.proficiency_required;
                await db.query('INSERT INTO jobs_skills (job_id, skill_id, proficiency_required) VALUES (?, ?, ?)', [
                    job_id,
                    skill_id,
                    proficiency_required,
                ]);
            }
        }
        res.status(204).send('Update succeeded');
    } catch (err) {
        console.error('Error while updating a preexisting job:', err);
        res.status(500).send('Update failed');
    }
})

// DELETE the specificed resource
// DELETE route should delete row from DB for that job ID
router.delete('/:job_id', async (req, res) => {
    const { job_id } = req.params;
    try {
        await db.query('DELETE FROM jobs WHERE job_id = ?', [job_id]);
        await db.query('DELETE FROM jobs_skills WHERE job_id = ?', [job_id]);
        res.send(204).send('Delete succeeded');
    } catch (err) {
        console.error('Error while deleting job:', err);
        res.status(500).send('Delete failed');
    }
})

// export the router module so that other files can use it
module.exports = router;