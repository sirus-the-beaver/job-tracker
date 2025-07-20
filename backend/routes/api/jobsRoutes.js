// Citation for the following:
// Date: 07/17/2025
// Source: https://medium.com/@ibrahimhz/creating-your-first-backend-with-node-js-step-by-step-guide-892769af4cb0
// Author(s): Ibrahim


// routes/jobs.js
const express = require('express');
const router = express.Router();

// GET route should basically return all of the jobs that a user has applied to
router.get('/', (req, res) => {
    res.send('this is jobs route');
});

// POST route should receive data payload from frontend and store in DB

// PUT route should receive data payload and update DB for that job ID

// DELETE route should delete row from DB for that job ID

// export the router module so that other files can use it
module.exports = router;