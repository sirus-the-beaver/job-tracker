const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector');

// GET a specific resource (e.g., get all of the contacts a user has)
// GET route should basically return all of the contacts that a user has
router.get('/', async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const contacts = await db.query('SELECT * FROM contacts WHERE user_id = ?', [user_id]);
        res.send(contacts[0]);
    } catch (err) {
        console.error('Error getting contacts:', err)
        res.status(500).send('Query error');
    }
});

// GET a specific resource by ID (e.g., get a specific contact by contact_id)
router.get('/:contact_id', async (req, res) => {
    const user_id = req.user.user_id;
    const contact_id = req.params.contact_id;
    try {
        const contact = await db.query('SELECT * FROM contacts WHERE contact_id = ? AND user_id = ?', [contact_id, user_id]);
        if (contact[0].length === 0) {
            return res.status(404).send('Contact not found');
        }
        res.send(contact[0][0]);
    } catch (err) {
        console.error('Error getting contact by ID:', err);
        res.status(500).send('Query error');
    }
});

// POST: create a new resource (e.g., add a new contact to the database)
// POST route should receive data payload from frontend and store in DB
router.post('/', async (req, res) => {
    const user_id = req.user.user_id;
    const { first_name, last_name, email, phone, position, notes } = req.body;
    try {
        // Insert new contact into the database
        await db.query('INSERT INTO contacts (user_id, first_name, last_name, email, phone, position, notes) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            user_id,
            first_name,
            last_name,
            email || null,
            phone || null,
            position || null,
            notes || null,
        ]);
        res.status(201).send('Insert succeeded');
    } catch (err) {
        console.error('Error while adding a new contact:', err);
        res.status(500).send('Insert failed');
    }
});

// PUT: update an existing resource (or create a new one if it doesn't exist)
// PUT route should receive data payload and update DB for that contact ID
router.put('/:contact_id', async (req, res) => {
    const user_id = req.user.user_id;
    const contact_id = req.params.contact_id
    const { first_name, last_name, email, phone, position, notes } = req.body;
    try {
        // Update contacts
        await db.query('UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, position = ?, notes = ? WHERE contact_id = ? AND user_id = ?',  [
            first_name,
            last_name,
            email || null,
            phone || null,
            position || null,
            notes || null,
            contact_id,
            user_id,
        ]);
        res.status(204).send('Update succeeded');
    } catch (err) {
        console.error('Error while updating a preexisting contact:', err);
        res.status(500).send('Update failed');
    }
});

// DELETE the specificed resource
// DELETE route should delete row from DB for that contact ID
router.delete('/:contact_id', async (req, res) => {
    const user_id = req.user.user_id;
    const contact_id = req.params.contact_id;
    try {
        // Delete contact
        await db.query('DELETE FROM contacts WHERE contact_id = ? AND user_id = ?', [contact_id, user_id]);
        res.send(204).send('Contact deleted successfully');
    } catch (err) {
        console.error('Error while deleting contact:', err);
        res.status(500).send('Delete failed');
    }
});

// export the router module so that other files can use it
module.exports = router;
