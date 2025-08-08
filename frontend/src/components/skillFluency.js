import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkillFluency = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5045/skills', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setSkills(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full mx-auto fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center">Skills</h1>

        {loading ? (
          <p>Loading skills...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {skills.map(skill => (
              <div key={skill.skill_id} className="bg-gray-100 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold">{skill.name}</h2>
                {skill.description && <p className="text-gray-600">{skill.description}</p>}
                <p><strong>Proficiency:</strong> {skill.proficiency}</p>
                <p><strong>Confidence:</strong> {skill.confidence_score}</p>
                <p><strong>Last Practiced:</strong> {skill.last_practiced ? new Date(skill.last_practiced).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Proficiency Required:</strong> {skill.proficiency_required}</p>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-gray-500">No skills found. Please add some skills.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillFluency;