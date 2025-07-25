// Express
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jobsRoute = require('./routes/api/jobsRoutes');
const userRoutes = require('./routes/api/userRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
dotenv.config()
const PORT = process.env.PORT;

// TO_DO: Will need to configure CORS for specific origins in production
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/jobs', jobsRoute);
app.use('/user', userRoutes);

// Database
const db = require('./database/db-connector');

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Server started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});