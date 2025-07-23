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
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM jobs';

    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// POST: create a new resource (e.g., add a new job to the database)
// POST route should receive data payload from frontend and store in DB
router.post('/', (req, res) => {
    res.send('Got a POST request')
})
// PUT: update an existing resource (or create a new one if it doesn't exist)
// PUT route should receive data payload and update DB for that job ID

router.put('/', (req, res) => {
    res.send('Got a PUT request at /')
})

// DELETE the specificed resource
// DELETE route should delete row from DB for that job ID
router.delete('/', (req, res) => {
    res.send('Got a DELETE request at /')
})

// export the router module so that other files can use it
module.exports = router;