import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full mx-auto fade-in">
                <h1 className="text-2xl font-bold mb-6 text-center">Jobs</h1>
                {loading ? (
                    <p>Loading jobs...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.job_id} className="bg-gray-100 p-4 rounded-lg shadow">
                                <h2 className="text-xl font-semibold">{job.positionTitle} at {job.company}</h2>
                                <p><strong>Classification:</strong> {job.classification}</p>
                                <p><strong>Status:</strong> {job.status}</p>
                                <p><strong>Tier:</strong> {job.tier}</p>
                                {job.city && (
                                    <p><strong>City:</strong> {job.city}</p>
                                )}
                                {job.state && (
                                    <p><strong>State:</strong> {job.state}</p>
                                )}
                                {job.salary_min && (
                                    <p><strong>Salary Min:</strong> ${job.salary_min.toLocaleString()}</p>
                                )}
                                {job.salary_max && (
                                    <p><strong>Salary Max:</strong> ${job.salary_max.toLocaleString()}</p>
                                )}
                                {job.application_date && (
                                    <p><strong>Application Date:</strong> {new Date(job.application_date).toLocaleDateString()}</p>
                                )}
                                {job.notes && (
                                    <p><strong>Notes:</strong> {job.notes}</p>
                                )}
                                { job.link && (
                                    <p><strong>Link:</strong> {job.link}</p>
                                )}
                                <div className="flex justify-center mt-4">
                                    <button onClick={() => handleEditJob(job.job_id)} className="text-blue-500 hover:text-blue-100 hover:bg-blue-500 bg-blue-100">
                                        <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteJob(job.job_id)} className="text-red-500 hover:text-red-100 hover:bg-red-500 bg-red-100">
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {jobs.length === 0 && (
                            <p className="text-gray-500">No jobs found. Please add some jobs.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
};

export default ViewJobs;