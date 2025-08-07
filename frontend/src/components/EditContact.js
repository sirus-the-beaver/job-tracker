import React, { useState, useEffect, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditContact = () => {
    const navigate = useNavigate();
    const { contactId } = useParams();
    const token = localStorage.getItem('token');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^\+?[0-9\s-]+$/;
    const ALPHA_REGEX = /^[a-zA-Z\s]+$/;

    const validateInput = () => {
        if (!firstName || !ALPHA_REGEX.test(firstName)) {
            setError('First name is required and must contain only letters.');
            return false;
        };
        if (!lastName || !ALPHA_REGEX.test(lastName)) {
            setError('Last name is required and must contain only letters.');
            return false;
        };
        if (email && !EMAIL_REGEX.test(email)) {
            setError('Email is invalid.');
            return false;
        };
        if (phone && !PHONE_REGEX.test(phone)) {
            setError('Phone number is invalid.');
            return false;
        };
        if (position && !ALPHA_REGEX.test(position)) {
            setError('Position must contain only letters.');
            return false;
        };
        if (notes && !ALPHA_REGEX.test(notes)) {
            setError('Notes must contain only letters.');
            return false;
        };
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateInput()) {
            return;
        }

        const contactData = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            position,
            notes
        };
        try {
            const response = await axios.put(`http://localhost:5045/contacts/${contactId}`, contactData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                setSuccess(true);
            } else {
                setError('Update failed. Please try again.');
            }
        } catch (err) {
            console.error('Error updating contact:', err);
            setError('Update failed. Please try again.');
        }
    }

    const handleCancel = () => {
        navigate('/view-contacts');
    }

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await axios.get(`http://localhost:5045/contacts/${contactId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const contact = response.data;
                setFirstName(contact.first_name);
                setLastName(contact.last_name);
                setEmail(contact.email || '');
                setPhone(contact.phone || '');
                setPosition(contact.position || '');
                setNotes(contact.notes || '');
            } catch (err) {
                console.error('Error fetching contact:', err);
                setError('Failed to load contact details. Please try again later.');
            }
        };

        fetchContact();
    }, [contactId, token]);

    return (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            {error && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
                    <div className='bg-white p-6 text-center space-y-4 rounded-xl shadow-xl max-w-sm w-full'>
                        <h2 className='text-lg font-semibold text-red-600'>Edit Failed</h2>
                        <p className='text-sm text-gray-700'>{error}</p>
                        <button
                            onClick={() => setError('')}
                            className='mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition'
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
            {success && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
                    <div className='bg-white p-6 text-center space-y-4 rounded-xl shadow-xl max-w-sm w-full'>
                        <h2 className='text-lg font-semibold text-green-600'>Edit Successful</h2>
                        <p className='text-sm text-gray-700'>Your contact has been edited successfully!</p>
                        <button
                            onClick={() => navigate('/view-contacts')}
                            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
                <div className='bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4'>
                    <h1 className='text-xl sm:text-2xl font-semibold text-white'>Edit Contact</h1>
                    <p className='text-sm text-blue-100'>Please edit contact information below for this individual.</p>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>First Name*</label>
                            <input
                                type='text'
                                id='firstName'
                                placeholder='John'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>Last Name*</label>
                            <input
                                type='text'
                                id='lastName'
                                placeholder='Doe'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                            <input
                                type='email'
                                id='email'
                                placeholder='example@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>Phone</label>
                            <input
                                type='tel'
                                id='phone'
                                placeholder='123-555-0100'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor='position' className='block text-sm font-medium text-gray-700'>Position</label>
                            <input
                                type='text'
                                id='position'
                                placeholder='Software Engineer'
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor='notes' className='block text-sm font-medium text-gray-700'>Notes</label>
                            <textarea
                                id='notes'
                                placeholder='Additional notes about this contact'
                                value={notes}
                                rows='4'
                                onChange={(e) => setNotes(e.target.value)}
                                className='mt-1 w-full resize-none border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-4 justify-end pt-4'>
                        <button type='button' onClick={handleCancel} className='w-full sm:w-auto px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 shadow-sm transition'>Cancel</button>
                        <button type='submit' className='w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default EditContact;