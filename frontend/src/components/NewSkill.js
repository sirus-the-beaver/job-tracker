import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const VALIDATION_PATTERNS = {
  skillName: /^[a-zA-Z0-9+\s\-_()]+$/,
  description: /^[^<>&]*$/
};


const NewSkill = () => {
  const [skills, setSkills] = useState([
    { 
      id: 1, 
      name: 'SQL', 
      proficiency: 'beginner',
      description: 'Proficient in MySQL',
      confidence: 8, 
      lastPracticed: '2025-07-25'
    },
    { 
      id: 2, 
      name: 'React', 
      proficiency: 'Intermediate',
      description: 'Proficient in building custom components',
      confidence: 6, 
      lastPracticed: '2025-07-25'
    }
  ]);

  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [confidence_score, setConfidenceScore] = useState(5);
  const [last_practiced, setLastPracticed] = useState('');
  const [errors, setErrors] = useState({});

  const handleAddSkill = (newSkill) => {
    const skillWithId = { ...newSkill, id: Date.now() };
    setSkills([...skills, skillWithId]);
  };

  const handleDeleteSkill = (skillId) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddSkill({ 
        name: skillName, 
        proficiency,
        description: description,
        confidence: Number(confidence_score),
        last_practiced
      });
      
      // Reset form
      setSkillName('');
      setProficiency('Beginner');
      setDescription('');
      setConfidenceScore(5); 
      setLastPracticed('');
    }
  };

  return (
    <div className="skills-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Skills</h1>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Skill</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                    errors.description 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Describe your experience with this skill"
                  rows="3"
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
                  onChange={(e) => setConfidenceScore(Number(e.target.value))}
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
                  value={last_practiced}
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
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                Add Skill
              </button>
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
                    key={skill.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{skill.name}</h3>
                      <p className="text-sm text-gray-500">
                        Proficiency: <span className="font-medium">{skill.proficiency}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Confidence: <span className="font-medium">{skill.confidence}/10</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Last practiced: <span className="font-medium">{new Date(skill.lastPracticed).toLocaleDateString()}</span>
                      </p>
                      {skill.description && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          "{skill.description}"
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 mt-3 md:mt-0"
                      aria-label={`Delete ${skill.name}`}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
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
