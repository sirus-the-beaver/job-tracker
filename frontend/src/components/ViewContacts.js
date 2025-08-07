import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const ViewContacts = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://localhost:5045/contacts', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContacts(response.data);
            } catch (err) {
                console.error('Error fetching contacts:', err);
                setError('Failed to load contacts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [token]);

    const handleDeleteContact = async (contactId) => {
        try {
            await axios.delete(`http://localhost:5045/contacts/${contactId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContacts(contacts.filter(contact => contact.contact_id !== contactId));
        } catch (err) {
            console.error('Error deleting contact:', err);
            setError('Failed to delete contact. Please try again later.');
        }
    };

    const handleEditContact = (contactId) => {
        // navigate(`/edit-contact/${contactId}`);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full mx-auto fade-in">
                <h1 className="text-2xl font-bold mb-6 text-center">Contacts</h1>
                {loading ? (
                    <p>Loading contacts...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="space-y-4">
                        {contacts.map(contact => (
                            <div key={contact.contact_id} className="border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{contact.first_name} {contact.last_name}</h2>
                                    <p>{contact.email || 'No email provided'}</p>
                                    <p>{contact.phone || 'No phone number provided'}</p>
                                    <p>{contact.position || 'No position provided'}</p>
                                    <p>{contact.notes || 'No notes available'}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button onClick={() => handleEditContact(contact.contact_id)} className="text-blue-500 hover:text-blue-100 hover:bg-blue-500 bg-blue-100">
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button>
                                    <button onClick={() => handleDeleteContact(contact.contact_id)} className="text-red-500 hover:text-red-100 hover:bg-red-500 bg-red-100">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewContacts;