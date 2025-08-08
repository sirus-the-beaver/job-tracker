import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// TO_DO: https://github.com/sirus-the-beaver/job-tracker/pull/22#discussion_r2255855409

const NewJob = () => {
    const classifications = ['Job', 'Internship'];
    const statuses = ['Interested', 'Applied', 'Interviewing', 'Offer', 'Rejected'];
    const tiers = ['Dream Position', 'Good Fit', 'Backup'];

    const [classification, setClassification] = useState(classifications[0]);
    const [positionTitle, setPositionTitle] = useState('');
    const [company, setCompany] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [status, setStatus] = useState(statuses[0]);
    const [tier, setTier] = useState(tiers[0]);
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [dateApplied, setDateApplied] = useState(null);
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const [skills, setSkills] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const validateInput = (input) => {
        const regex = /^[a-zA-Z0-9\s,.'-]+$/;
        return regex.test(input) || input === '';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!positionTitle || !company) {
            setError('Please fill in all required fields.');
            return;
        }

        if (!validateInput(positionTitle) || !validateInput(company) || !validateInput(city) || !validateInput(state) || !validateInput(notes)) {
            setError('Invalid characters in input fields. Please use alphanumeric characters only.');
            return;
        }
        setError('');

        const jobData = {
            classification,
            positionTitle,
            company,
            city: city || null,
            state: state || null,
            status,
            tier,
            salary_min: salaryMin || null,
            salary_max: salaryMax || null,
            application_date: dateApplied || null,
            notes: notes || null,
            link: link || null
        };
        try {
            const response = await axios.post('http://localhost:5045/jobs', jobData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status === 201) {
                setSuccess(true);
                handleReset();
            }
        } catch (error) {
            setError('Failed to submit job application. Please try again later.');
            return;
        }
    };

    const handleReset = () => {
        setClassification(classifications[0]);
        setPositionTitle('');
        setCompany('');
        setCity('');
        setState('');
        setStatus(statuses[0]);
        setTier(tiers[0]);
        setSalaryMin('');
        setSalaryMax('');
        setLink('');
        setNotes('');
        setSkills([]);
        setDateApplied(null);
        setError('');
    };

    const handleCancel = () => {
        navigate('/');
    };

    //  Fetch existing skills on component mount
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get('http://localhost:5045/skills', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setSkills(response.data);
                }
            } catch (err) {
                console.error('Error fetching skills:', err);
                setError('Failed to load skills. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, [token]);

    useEffect(() => {
        if (status !== 'Interested') {
            setDateApplied(new Date().toISOString().split('T')[0]);
        }
    }, [status]);

    return (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            {error && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
                    <div className='bg-white p-6 text-center space-y-4 rounded-xl shadow-xl max-w-sm w-full'>
                        <h2 className='text-lg font-semibold text-red-600'>Submission Failed</h2>
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
            { success && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
                    <div className='bg-white p-6 text-center space-y-4 rounded-xl shadow-xl max-w-sm w-full'>
                        <h2 className='text-lg font-semibold text-green-600'>Submission Successful</h2>
                        <p className='text-sm text-gray-700'>Your job application has been submitted successfully!</p>
                        <button
                            onClick={() => navigate('/')}
                            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
                <div className='bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4'>
                    <h1 className='text-xl sm:text-2xl font-semibold text-white'>New application</h1>
                    <p className='text-sm text-blue-100'>Please enter application details below</p>
                </div>

                <form onSubmit={handleSubmit} onReset={handleReset} className='p-6 space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor="classification" className='block text-sm font-medium text-gray-700'>Classification</label>
                            <select 
                                id="classification" 
                                value={classification} 
                                onChange={(e) => setClassification(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            >
                                <option value="Job">Job</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="positionTitle" className='block text-sm font-medium text-gray-700'>Position Title</label>
                            <input 
                                type="text" 
                                id="positionTitle" 
                                value={positionTitle} 
                                onChange={(e) => setPositionTitle(e.target.value)} 
                                required
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className='block text-sm font-medium text-gray-700'>Company</label>
                            <input 
                                type="text" 
                                id="company" 
                                value={company} 
                                onChange={(e) => setCompany(e.target.value)} 
                                required
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className='block text-sm font-medium text-gray-700'>Status</label>
                            <select 
                                id="status" 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            >
                                <option value="Interested">Interested</option>
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="city" className='block text-sm font-medium text-gray-700'>City</label>
                            <input 
                                type="text" 
                                id="city" 
                                value={city} 
                                onChange={(e) => setCity(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor="state" className='block text-sm font-medium text-gray-700'>State</label>
                            <input 
                                type="text" 
                                id="state" 
                                value={state} 
                                onChange={(e) => setState(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor="tier" className='block text-sm font-medium text-gray-700'>Tier</label>
                            <select 
                                id="tier" 
                                value={tier} 
                                onChange={(e) => setTier(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            >
                                <option value="Dream Position">Dream Position</option>
                                <option value="Good Fit">Good Fit</option>
                                <option value="Backup">Backup</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="salaryMin" className='block text-sm font-medium text-gray-700'>Minimum Salary (USD/year)</label>
                            <input 
                                type="number" 
                                id="salaryMin" 
                                value={salaryMin} 
                                onChange={(e) => setSalaryMin(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor="salaryMax" className='block text-sm font-medium text-gray-700'>Maximum Salary (USD/year)</label>
                            <input 
                                type="number" 
                                id="salaryMax" 
                                value={salaryMax} 
                                onChange={(e) => setSalaryMax(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        {status !== 'Interested' && 
                        (
                            <div>
                                <label htmlFor="dateApplied" className='block text-sm font-medium text-gray-700'>Date Applied</label>
                                <input 
                                    type="date" 
                                    id="dateApplied" 
                                    value={dateApplied ? dateApplied : new Date().toISOString().split('T')[0]} 
                                    onChange={(e) => setDateApplied(new Date(e.target.value).toISOString().split('T')[0])}
                                    className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="link" className='block text-sm font-medium text-gray-700'>Link</label>
                            <input 
                                type="url" 
                                pattern="https?://.+"
                                placeholder="https://example.com"
                                id="link" 
                                value={link} 
                                onChange={(e) => setLink(e.target.value)}
                                className='mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            />
                        </div>

                        <div>
                            <label htmlFor="notes" className='block text-sm font-medium text-gray-700'>Notes</label>
                            <textarea 
                                id="notes" 
                                value={notes} 
                                onChange={(e) => setNotes(e.target.value)} 
                                rows="4"
                                placeholder="Enter any additional notes here"
                                className='mt-1 w-full resize-none border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
                            ></textarea>
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
                                Skills Required for Position <span className="text-red-500">*</span>
                            </label>
                            {skills.map((skill) => (
                            <div
                                key={skill.skill_id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <label>
                                    <input type="checkbox" />
                                    {skill.name}
                                </label>
                            </div>
                            ))}
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => navigate('/new-skill')}
                                    className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                                >
                                    Add New Skill
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-4 justify-end pt-4'>
                        <button type="button" onClick={handleCancel} className='w-full sm:w-auto px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 shadow-sm transition'>Cancel</button>
                        <button type="reset" className='w-full sm:w-auto px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 shadow-sm transition'>Reset</button>
                        <button type="submit" className='w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default NewJob;