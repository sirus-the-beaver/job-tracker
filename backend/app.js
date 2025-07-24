// Express
const express = require('express');
const dotenv = require('dotenv');
const jobsRoute = require('./routes/api/jobsRoutes');
const app = express();
dotenv.config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/jobs', jobsRoute);

const PORT = process.env.PORT

// Database
const db = require('./database/db-connector');


// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});