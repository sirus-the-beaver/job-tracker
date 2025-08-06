import { useState, useEffect, use } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VALIDATION_PATTERNS = {
  skillName: /^[a-zA-Z0-9+\s\-_()]+$/,
  description: /^[^<>&]*$/
};


const NewSkill = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [confidence_score, setConfidenceScore] = useState(5);
  const [last_practiced, setLastPracticed] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch existing skills on component mount and when user adds new skill
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:5045/skills', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setSkills(response.data);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        setServerError('Failed to load skills. Please try again later.');
      }
    };
    fetchSkills();
  }, [token, success]);

  const handleDeleteSkill = async (skillId) => {
    try {
      await axios.delete(`http://localhost:5045/skills/${skillId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Remove the deleted skill from the state
      setSkills(skills.filter(skill => skill.skill_id !== skillId));
    } catch (error) {
      console.error('Error deleting skill:', error);
      setServerError('Failed to delete skill. Please try again later.');
    }
  };

  const handleEditSkill = (skillId) => {
    navigate(`/edit-skill/${skillId}`);
  };

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
    if (validateForm()) {
      // Create new skill object
      const newSkill = {
        name: skillName,
        description: description || null,
        proficiency,
        confidence_score: confidence_score || null,
        last_practiced
      };
      try {
        const response = await axios.post('http://localhost:5045/skills', newSkill, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 201) {
          // Reset form
          setSkillName('');
          setProficiency('Beginner');
          setDescription('');
          setConfidenceScore(5); 
          setLastPracticed('');
          setSuccess(true);
        }
      } catch (error) {
          setServerError('Failed to add skill. Please try again later.');
          return;
      };
    }
  };

  return (
    <div className="skills-page">
      <div className="container mx-auto px-4 py-8">
        {serverError && (
          <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
              <div className='bg-white p-6 text-center space-y-4 rounded-xl shadow-xl max-w-sm w-full'>
                  <h2 className='text-lg font-semibold text-red-600'>Submission Failed</h2>
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
          { success && (
            <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
                <div className='bg-white p-6 text-center space-y-4 rounded-xl shadow-xl max-w-sm w-full'>
                    <h2 className='text-lg font-semibold text-green-600'>Submission Successful</h2>
                    <p className='text-sm text-gray-700'>Your skill has been saved successfully!</p>
                    <button
                        onClick={() => setSuccess(false)}
                        className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                    >
                        Dismiss
                    </button>
                </div>
            </div>
          )}  
        <div className="space-y-8">
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
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
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
                  <label htmlFor="lastPracticed" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Practiced <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="last_practiced"
                    value={last_practiced ? last_practiced : new Date().toISOString().split('T')[0]}
                    onChange={(e) => setLastPracticed(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      errors.lastPracticed 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  {errors.lastPracticed && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastPracticed}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                  Add Skill
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Skill List</h2>
            {skills.length === 0 ? (
              <p className="text-gray-500">No skills added yet. Add your first skill!</p>
            ) : (
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div
                    key={skill.skill_id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{skill.name}</h3>
                      <p className="text-sm text-gray-500">
                        Proficiency: <span className="font-medium">{skill.proficiency}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Confidence: <span className="font-medium">{skill.confidence_score}/10</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Last practiced: <span className="font-medium">{new Date(skill.last_practiced).toLocaleDateString()}</span>
                      </p>
                      {skill.description && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          "{skill.description}"
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditSkill(skill.skill_id)} className="text-blue-500 hover:text-blue-100 hover:bg-blue-500 bg-blue-100">
                        <FontAwesomeIcon icon={faPenToSquare} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.skill_id)}
                        className="text-red-500 hover:text-red-100 hover:bg-red-500 bg-red-100"
                        aria-label={`Delete ${skill.name}`}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSkill;
