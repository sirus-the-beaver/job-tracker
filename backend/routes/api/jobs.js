// Citation for the following:
// Date: 07/17/2025
// Source: https://medium.com/@ibrahimhz/creating-your-first-backend-with-node-js-step-by-step-guide-892769af4cb0
// Author(s): Ibrahim


// routes/jobs.js
const express = require('express');
const router = express.Router();

// Define a route
router.get('/', (req, res) => {
    res.send('this is jobs route');// this gets executed when user visit http://localhost:3000/jobs
});

// export the router module so that other files can use it
module.exports = router;