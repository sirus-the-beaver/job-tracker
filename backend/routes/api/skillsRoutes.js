const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector');

router.get('/', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        // Fetch all skills for the authenticated user
        const skills = await db.query('SELECT * FROM skills WHERE user_id = ?', [user_id]);
        res.send(skills[0]);
    } catch (err) {
        console.error('Error fetching skills:', err);
        res.status(500).send('Error fetching skills');
    }
})

router.post('/', async (req, res) => {
    const user_id = req.user.user_id;
    const { name, description, proficiency, confidence_score, last_practiced } = req.body;        
    try {
        // Insert new skill into the database
        await db.query('INSERT INTO skills (user_id, name, description) VALUES (?, ?, ?)', [user_id, name, description || null]);
        const lastId = await db.query('SELECT LAST_INSERT_ID()');
        const skillId = lastId[0][0]['LAST_INSERT_ID()'];
        // Insert proficiency and confidence score
        await db.query('INSERT INTO users_skills (user_id, skill_id, proficiency, confidence_score, last_practiced) VALUES (?, ?, ?, ?, ?)', [user_id, skillId, proficiency || null, confidence_score || null, last_practiced || null]);

        res.status(201).send('Skill added successfully');
    } catch (err) {
        console.error('Error adding skill:', err);
        res.status(500).send('Error adding skill');
    }
})

module.exports = router;