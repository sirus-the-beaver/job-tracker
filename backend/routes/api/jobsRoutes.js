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
        res.send(jobs[0]);
    } catch (err) {
        console.error('Error getting jobs:', err);
        res.status(500).send('Query error');
    }
});

// POST: create a new resource (e.g., add a new job to the database)
// POST route should receive data payload from frontend and store in DB
router.post('/', async (req, res) => {
    const user_id = req.user.user_id;
    const { positionTitle, company, city, state, status, salary_min, salary_max, application_date, notes, classification, tier, link } = req.body;
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
    const { positionTitle, company, city, state, status, salary_min, salary_max, application_date, notes, classification, tier, link } = req.body;
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
        res.send(204).send('Delete succeeded');
    } catch (err) {
        console.error('Error while deleting job:', err);
        res.status(500).send('Delete failed');
    }
})

// export the router module so that other files can use it
module.exports = router;