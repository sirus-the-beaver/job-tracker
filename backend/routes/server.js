// Citation for the following:
// Date: 07/17/2025
// Source: https://medium.com/@ibrahimhz/creating-your-first-backend-with-node-js-step-by-step-guide-892769af4cb0
// Author(s): Ibrahim

// server.js
const express = require('express');
const app = express();

// Include route files
const jobsRoute = require('./routes/api/jobs');

// Use routes
app.use('/jobs', jobsRoute);