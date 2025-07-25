import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const NewSkill = () => {
  const [skills, setSkills] = useState([
    { id: 1, name: 'JavaScript', proficiency: 'Advanced' },
    { id: 2, name: 'React', proficiency: 'Intermediate' }
  ]);

  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');
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
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddSkill({ name: skillName, proficiency });
      setSkillName('');
      setProficiency('Beginner');
    }
  };

  return (
    <div className="skills-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Skills</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Skill</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
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
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{skill.name}</h3>
                      <p className="text-sm text-gray-500">
                        Proficiency: <span className="font-medium">{skill.proficiency}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
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