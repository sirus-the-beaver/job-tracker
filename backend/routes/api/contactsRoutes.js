const express = require('express');
const router = express.Router();
const db = require('../../database/db-connector');

// GET a specific resource (e.g., get all of the contacts a user has)
// GET route should basically return all of the contacts that a user has
router.get('/', async (req, res) => {
    const user_id = req.user.user_id;
    const contact_id = req.params.contact_id
    const job_id = req.params.job_id;
    try {
        // Fetch all contacts for the authenticated user
        const contactsQuery = await db.query('SELECT * FROM contacts WHERE user_id = ?', [user_id]);
        const contactsJobsQuery = await db.query('SELECT * FROM jobs_contacts WHERE contact_id = ?', [contact_id]);
        
         // Combine data from contacts and jobs_contacts tables into a single array of contacts objects
        const contacts = contactsQuery[0].map(contact => {
            // Find the corresponding contact data based on contact_id
            const userContact = contactsJobsQuery[0].find(us => us.contact_id === contact.contact_id);
            return {
                ...contact,
                relationship_type: userContact ? userContact.relationship_type : null
            };
        });
        res.status(200).send(contacts);
    } catch (err) {
        console.error('Error getting contacts:', err)
        res.status(500).send('Query error');
    }
});

// POST: create a new resource (e.g., add a new contact to the database)
// POST route should receive data payload from frontend and store in DB
router.post('/', async (req, res) => {
    const user_id = req.user.user_id;
    const { first_name, last_name, email, phone, position, notes, relationship_type } = req.body;
    try {
        // Insert new contact into the database
        await db.query('INSERT INTO contacts (user_id, first_name, last_name, email, phone, position, notes) VALUES (?, ?, ?, ?, ?, ?)', [
            user_id,
            first_name,
            last_name,
            email || null,
            phone || null,
            position || null,
            notes || null,
        ]);
        // Insert relationship_type
        await db.query('INSERT INTO jobs_contacts (job_id, contact_id, relationship_type) VALUES (?, ?, ?)', [job_id, contact_id, relationship_type || null]);
        res.status(201).send('Insert succeeded');
    } catch (err) {
        console.error('Error while adding a new contact:', err);
        res.status(500).send('Insert failed');
    }
});

// PUT: update an existing resource (or create a new one if it doesn't exist)
// PUT route should receive data payload and update DB for that contact ID
router.put('/', async (req, res) => {
    const user_id = req.user.user_id;
    const contact_id = req.params.contact_id
    const job_id = req.params.job_id;
    const { first_name, last_name, email, phone, position, notes, relationship_type } = req.body;
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
        // Update jobs_contacts
        await db.query('UPDATE jobs_contacts SET relationship_type = ? WHERE job_id = ? AND contact_id = ?', [
            relationship_type || null, 
            job_id, 
            contact_id,
        ]);
        res.status(204).send('Update succeeded');
    } catch (err) {
        console.error('Error while updating a preexisting contact:', err);
        res.status(500).send('Update failed');
    }
});

// DELETE the specificed resource
// DELETE route should delete row from DB for that contact ID
router.delete('/', async (req, res) => {
    const user_id = req.user.user_id;
    const contact_id = req.params.contact_id;
    const job_id = req.params.job_id;
    try {
        // Delete contact and associated jobs_contacts data
        await db.query('DELETE FROM contacts WHERE contact_id = ? AND user_id = ?', [contact_id, user_id]);
        await db.query('DELETE FROM job_contacts WHERE contact_id = ? AND job_id = ?', [contact_id, job_id]);
        res.send(204).send('Contact deleted successfully');
    } catch (err) {
        console.error('Error while deleting contact:', err);
        res.status(500).send('Delete failed');
    }
});

// export the router module so that other files can use it
module.exports = router;
