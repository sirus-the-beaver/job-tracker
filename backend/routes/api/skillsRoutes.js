const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector');

router.get('/', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const skills = await db.query('SELECT * FROM skills WHERE user_id = ?', [user_id]);
        res.send(skills);
    } catch (err) {
        console.error('Error fetching skills:', err);
        res.status(500).send('Error fetching skills');
    }
})

router.post('/', async (req, res) => {
    const user_id = req.user.user_id;
    const { name, description } = req.body;
    try {
        await db.query('INSERT INTO skills (user_id, name, description) VALUES (?, ?, ?)', [user_id, name, description]);
        res.status(201).send('Skill added successfully');
    } catch (err) {
        console.error('Error adding skill:', err);
        res.status(500).send('Error adding skill');
    }
})

module.exports = router;