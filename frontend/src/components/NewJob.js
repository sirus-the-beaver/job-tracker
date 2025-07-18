import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewJob = () => {
    const [classification, setClassification] = useState(['Job', 'Internship'])
    const [positionTitle, setPositionTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState(['Interested', 'Applied', 'Interviewing', 'Offer', 'Rejected']);
    const [tier, setTier] = useState(['Dream Position', 'Good Fit', 'Backup']);
    const [pay, setPay] = useState('');
    const [dateApplied, setDateApplied] = useState(new Date());
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const validateInput = (input) => {
        const regex = /^[a-zA-Z0-9\s,.'-]+$/;
        return regex.test(input) || input === '';
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!positionTitle || !company) {
            setError('Please fill in all required fields.');
            return;
        }

        if (!validateInput(positionTitle) || !validateInput(company) || !validateInput(location) || !validateInput(notes)) {
            setError('Invalid characters in input fields. Please use alphanumeric characters only.');
            return;
        }
        setError('');

        // TO_DO: Send data to backend endpoint once backend endpoint is setup
    };

    const handleReset = () => {
        setPositionTitle('');
        setCompany('');
        setLocation('');
        setPay('');
        setLink('');
        setNotes('');
        setDateApplied(new Date());
        setError('');
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div>
            {error && (
                <div>
                    <p>{error}</p>
                </div>
            )}
            <div>
                <div>
                    <h1>New application</h1>
                    <p>Please enter application details below</p>
                </div>

                <form onSubmit={handleSubmit} onReset={handleReset}>
                    <div>
                        <label htmlFor="classification">Classification</label>
                        <div>
                            <select 
                                id="classification" 
                                value={classification} 
                                onChange={(e) => setClassification(e.target.value)}
                            >
                                <option value="Job">Job</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="positionTitle">Position Title</label>
                        <input 
                            type="text" 
                            id="positionTitle" 
                            value={positionTitle} 
                            onChange={(e) => setPositionTitle(e.target.value)} 
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="company">Company</label>
                        <input 
                            type="text" 
                            id="company" 
                            value={company} 
                            onChange={(e) => setCompany(e.target.value)} 
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="location">Location</label>
                        <input 
                            type="text" 
                            id="location" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="status">Status</label>
                        <select 
                            id="status" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Interested">Interested</option>
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tier">Tier</label>
                        <select 
                            id="tier" 
                            value={tier} 
                            onChange={(e) => setTier(e.target.value)}
                        >
                            <option value="Dream Position">Dream Position</option>
                            <option value="Good Fit">Good Fit</option>
                            <option value="Backup">Backup</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pay">Pay (dollars/year)</label>
                        <input 
                            type="number" 
                            id="pay" 
                            value={pay} 
                            onChange={(e) => setPay(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="dateApplied">Date Applied</label>
                        <input 
                            type="date" 
                            id="dateApplied" 
                            value={dateApplied.toISOString().split('T')[0]} 
                            onChange={(e) => setDateApplied(new Date(e.target.value))} 
                        />
                    </div>

                    <div>
                        <label htmlFor="link">Link</label>
                        <input 
                            type="url" 
                            pattern="https?://.+"
                            placeholder="https://example.com"
                            id="link" 
                            value={link} 
                            onChange={(e) => setLink(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="notes">Notes</label>
                        <textarea 
                            id="notes" 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            rows="4"
                            placeholder="Enter any additional notes here"
                            className='resize-none'
                        ></textarea>
                    </div>

                    <div>
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default NewJob;