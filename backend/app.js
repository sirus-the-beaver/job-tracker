// Express
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactsRoutes = require('./routes/api/contactsRoutes');
const jobsRoute = require('./routes/api/jobsRoutes');
const userRoutes = require('./routes/api/userRoutes');
const skillsRoutes = require('./routes/api/skillsRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
dotenv.config()
const PORT = process.env.PORT;

// TO_DO: Will need to configure CORS for specific origins in production
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/user', userRoutes);
app.use('/jobs', authMiddleware, jobsRoute);
<<<<<<< HEAD
app.use('/skills', skillsRoutes);
app.use('/contacts', contactsRoutes);
=======
app.use('/skills', authMiddleware, skillsRoutes);
>>>>>>> origin/main

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Server started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});