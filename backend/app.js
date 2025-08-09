const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactsRoutes = require('./routes/api/contactsRoutes');
const jobsRoute = require('./routes/api/jobsRoutes');
const userRoutes = require('./routes/api/userRoutes');
const skillsRoutes = require('./routes/api/skillsRoutes');
const skillsFluencyRoutes = require('./routes/api/skillsFluencyRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
dotenv.config()
const PORT = process.env.PORT;

app.use(cors(
    {
        origin: 'https://job-tracker-steel-kappa.vercel.app',           
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/user', userRoutes);
app.use('/jobs', authMiddleware, jobsRoute);
app.use('/contacts', authMiddleware, contactsRoutes);
app.use('/skills', authMiddleware, skillsRoutes);
app.use('/skillFluency', authMiddleware, skillsFluencyRoutes);


app.listen(PORT, function () {
    console.log(
        'Server started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});

module.exports = app;