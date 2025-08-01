import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:5045/jobs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setJobs(response.data);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [token]);

    const handleDeleteJob = async (jobId) => {
        try {
            await axios.delete(`http://localhost:5045/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setJobs(jobs.filter(job => job.job_id !== jobId));
        } catch (err) {
            console.error('Error deleting job:', err);
            setError('Failed to delete job. Please try again later.');
        }
    };
    const handleEditJob = (jobId) => {
        navigate(`/edit-job/${jobId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto fade-in">
                <h1 className="text-2xl font-bold mb-6 text-center">View Jobs</h1>
                {loading ? (
                    <p>Loading jobs...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ul className="space-y-4">
                        {jobs.map(job => (
                            <li key={job.job_id} className="border rounded-lg p-4">
                                <h2 className="text-xl font-semibold">{job.positionTitle} at {job.company}</h2>
                                {job.city && (
                                    <p className="text-gray-600">City: {job.city}</p>
                                )}
                                {job.state && (
                                    <p className="text-gray-600">State: {job.state}</p>
                                )}
                                <p>Status: {job.status}</p>
                                <p>Classification: {job.classification}</p>
                                <p>Tier: {job.tier}</p>
                                {job.salary_min && (
                                    <p>Salary Min: ${job.salary_min}</p>
                                )
                                }
                                {job.salary_max && (
                                    <p>Salary Max: ${job.salary_max}</p>
                                )}
                                {job.application_date && (
                                    <p>Application Date: {new Date(job.application_date).toLocaleDateString()}</p>
                                )}
                                {job.notes && (
                                    <p>Notes: {job.notes}</p>
                                )}
                                { job.link && (
                                    <p>Link: {job.link}</p>
                                )}
                                <button
                                    onClick={() => handleEditJob(job.job_id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteJob(job.job_id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
};

export default ViewJobs;