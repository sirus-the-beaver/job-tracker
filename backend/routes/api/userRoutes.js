const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector')

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if an account is already registered with the email
        const existingUser = await db.query('SELECT * FROM users where email = ?', [email]);
        if (existingUser[0].length > 0) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        // Hash and salt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Retrieve user from database
        const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user[0].length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        
        const userData = user[0][0];
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Create a JWT token
        const token = jwt.sign({ user_id: userData.user_id, email: userData.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user_id: userData.user_id, email: userData.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required.' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newToken = jwt.sign({ user_id: decoded.user_id, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ user_id: decoded.user_id, email: decoded.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
});

module.exports = router;