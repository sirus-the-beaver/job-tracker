import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VALIDATION_PATTERNS = {
    skillName: /^[a-zA-Z0-9+\s\-_()]+$/,
    description: /^[^<>&]*$/
  };

const EditSkill = () => {
    const navigate = useNavigate();
    const { skillId } = useParams();
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
      const handleTokenChange = () => {
        setToken(localStorage.getItem('token'));
      };
      window.addEventListener('storage', handleTokenChange);
  
      return () => {
        window.removeEventListener('storage', handleTokenChange);
      };
    }, []);

    const [skillName, setSkillName] = useState('');
    const [proficiency, setProficiency] = useState('Beginner');
    const [description, setDescription] = useState('');
    const [confidence_score, setConfidenceScore] = useState(5);
    const [last_practiced, setLastPracticed] = useState(null);
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!skillName.trim()) {
          newErrors.skillName = 'Skill name is required';
        } else if (skillName.length > 100) {
          newErrors.skillName = 'Skill name cannot exceed 100 characters';
        }else if (!VALIDATION_PATTERNS.skillName.test(skillName)) {
          newErrors.skillName = 'Invalid characters. Letters, numbers, spaces, and +-_() are allowed.';
        }
        
        if (description.length > 500) {
          newErrors.description = 'Description cannot exceed 500 characters';
        }else if (description && !VALIDATION_PATTERNS.description.test(description)) {
          newErrors.description = 'Invalid characters. Avoid <, >, & symbols.';
        }
        
        if (confidence_score < 1 || confidence_score > 10) {
          newErrors.confidence = 'Confidence score must be between 1 and 10';
        }
        
        if (!last_practiced) {
          newErrors.last_practiced = 'Please select when you last practiced this skill';
        } else {
          const selectedDate = new Date(last_practiced);
          const today = new Date();
          if (selectedDate > today) {
            newErrors.last_practiced = 'Last practiced date cannot be in the future';
          }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const skillData = {
            name: skillName,
            proficiency,
            description: description || null,
            confidence_score: confidence_score || null,
            last_practiced
        };
        try {
            const response = await axios.put(`https://job-tracker-backend-mu.vercel.app/skills/${skillId}`, skillData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setSuccess(true);
                setServerError('');
            }
        } catch (error) {
            console.error('Error updating skill:', error);
            if (error.response && error.response.data) {
                setServerError(error.response.data);
            } else {
                setServerError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        navigate('/new-skill');
    };

    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const response = await axios.get(`https://job-tracker-backend-mu.vercel.app/skills/${skillId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const skill = response.data;
                setSkillName(skill.name);
                setProficiency(skill.proficiency || 'Beginner');
                setDescription(skill.description || '');
                setConfidenceScore(skill.confidence_score || 5);
                setLastPracticed(skill.last_practiced ? new Date(skill.last_practiced).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
            } catch (error) {
                console.error('Error fetching skill:', error);
                setServerError('Failed to fetch skill details. Please try again.');
            }
        };
        fetchSkill();
    }, [skillId, token]);

    return (
        <div>
            {serverError && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
                    <div className='bg-white p-6 text-center space-y-4 rounded-xl shadow-xl max-w-sm w-full'>
                        <h2 className='text-lg font-semibold text-red-600'>Edit Failed</h2>
                        <p className='text-sm text-gray-700'>{serverError}</p>
                        <button
                            onClick={() => setServerError('')}
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
                        <p className='text-sm text-gray-700'>Your skill has been updated successfully!</p>
                        <button
                            onClick={() => navigate('/new-skill')}
                            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                        >
                            Go back to view skills
                        </button>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Skill</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
                            Skill Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="skillName"
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                            errors.skillName 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:border-blue-500'
                            }`}
                            placeholder="e.g., Python, UI/UX Design"
                        />
                        {errors.skillName && (
                            <p className="text-red-500 text-xs mt-1">{errors.skillName}</p>
                        )}
                        </div>

                        <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`resize-none w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                            errors.description 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:border-blue-500'
                            }`}
                            placeholder="Describe your experience with this skill"
                            rows="2"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                        )}
                        </div>

                        <div>
                        <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 mb-1">
                            Proficiency Level
                        </label>
                        <select
                            id="proficiency"
                            value={proficiency}
                            onChange={(e) => setProficiency(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:border-blue-500"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                        </div>

                        <div>
                        <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-1">
                            Confidence Score (1-10) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="confidence_score"
                            value={confidence_score}
                            onChange={(e) => setConfidenceScore(Number(e.target.value).toString())}
                            min="1" 
                            max="10" 
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                            errors.confidence 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:border-blue-500'
                            }`}
                        />
                        {errors.confidence && (
                            <p className="text-red-500 text-xs mt-1">{errors.confidence}</p>
                        )}
                        </div>

                        <div>
                        <label htmlFor="last_practiced" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Practiced <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="last_practiced"
                            value={last_practiced ? last_practiced : new Date().toISOString().split('T')[0]}
                            onChange={(e) => setLastPracticed(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                            errors.last_practiced 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:border-blue-500'
                            }`}
                        />
                        {errors.last_practiced && (
                            <p className="text-red-500 text-xs mt-1">{errors.last_practiced}</p>
                        )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-end pt-4">
                            <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">Cancel</button>
                            <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">Edit Skill</button>
                        </div>
                    </div>
                </form>
          </div>
        </div>
    );
};

export default EditSkill;
