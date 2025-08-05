import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditJob = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const token = localStorage.getItem('token');

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
    const [notes, setNotes] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const validateInput = (input) => {
        const regex = /^[a-zA-Z0-9\s,.'-]+$/;
        return regex.test(input) || input === '';
    }
};