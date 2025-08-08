const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector');

// GET all skills for the authenticated user
router.get('/', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        // Fetch all skills for the authenticated user
        const skillsQuery = await db.query('SELECT * FROM skills WHERE user_id = ?', [user_id]);
        const skillsUserQuery = await db.query('SELECT * FROM users_skills WHERE user_id = ?', [user_id]);

        // Combine data from skills and users_skills tables into a single array of skill objects
        const skills = skillsQuery[0].map(skill => {
            // Find the corresponding user skill data based on skill_id
            const userSkill = skillsUserQuery[0].find(us => us.skill_id === skill.skill_id);
            return {
                ...skill,
                proficiency: userSkill ? userSkill.proficiency : null,
                confidence_score: userSkill ? userSkill.confidence_score : null,
                last_practiced: userSkill ? userSkill.last_practiced : null
            };
        });
        res.status(200).send(skills);
    } catch (err) {
        console.error('Error fetching skills:', err);
        res.status(500).send('Error fetching skills');
    }
});

// GET a single skill by skill_id for the authenticated user
router.get('/:skill_id', async (req, res) => {
    const user_id = req.user.user_id;
    const skill_id = req.params.skill_id;
    try {
        // Fetch skill by skill_id for the authenticated user
        const skillQuery = await db.query('SELECT * FROM skills WHERE skill_id = ? AND user_id = ?', [skill_id, user_id]);
        const userSkillQuery = await db.query('SELECT * FROM users_skills WHERE skill_id = ? AND user_id = ?', [skill_id, user_id]);

        const skill = skillQuery[0][0];
        const userSkill = userSkillQuery[0][0];

        // Combine data into a single object
        const result = {
            ...skill,
            proficiency: userSkill ? userSkill.proficiency : null,
            confidence_score: userSkill ? userSkill.confidence_score : null,
            last_practiced: userSkill ? userSkill.last_practiced : null
        };
        res.status(200).send(result);
    } catch (err) {
        console.error('Error fetching skill:', err);
        res.status(500).send('Error fetching skill');
    }
});

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

router.put('/:skill_id', async (req, res) => {
    const user_id = req.user.user_id;
    const skill_id = req.params.skill_id;
    const { name, description, proficiency, confidence_score, last_practiced } = req.body;
    try {
        // Update skill
        await db.query('UPDATE skills SET name = ?, description = ? WHERE skill_id = ? AND user_id = ?', [name, description || null, skill_id, user_id]);
        // Update proficiency and confidence score
        await db.query('UPDATE users_skills SET proficiency = ?, confidence_score = ?, last_practiced =? WHERE user_id = ? AND skill_id =?', [proficiency || null, confidence_score || null, last_practiced || null, user_id, skill_id])
        res.status(200).send('Skill updated successfully');
    } catch (err) {
        console.error('Error updating skill:', err);
        res.status(500).send('Error updating skill');
    }
});

router.delete('/:skill_id', async (req, res) => {
    const user_id = req.user.user_id;
    const skill_id = req.params.skill_id;
    try {
        // Delete skill and associated users_skills data
        await db.query('DELETE FROM users_skills WHERE skill_id = ? AND user_id = ?', [skill_id, user_id]);
        await db.query('DELETE FROM skills WHERE skill_id = ? AND user_id = ?', [skill_id, user_id]);
        res.status(200).send('Skill deleted successfully');
    } catch (err) {
        console.error('Error deleting skill:', err);
        res.status(500).send('Error deleting skill');
    }
});

module.exports = router;