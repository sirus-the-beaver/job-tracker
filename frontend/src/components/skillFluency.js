import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const SkillFluency = () => {
  // Add skillComfort state to match your table usage
  const [skills, setSkills] = useState([]);
  const [skillComfort, setSkillComfort] = useState([]); // New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchSkills = async () => {
    try {
      setLoading(true);
      // Fetch main skills data (adjust URL if needed)
      const skillsResponse = await axios.get('http://localhost:5045/skills', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setSkills(skillsResponse.data);

      // Fetch skill comfort data (add this if using the /skill-comfort endpoint)
      const comfortResponse = await axios.get('http://localhost:5045/skills', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setSkillComfort(comfortResponse.data);

      setError(null);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [token]); // Add token as a dependency (if it can change)

  // Define calculateAvgConfidence to use skillComfort
  const calculateAvgConfidence = () => {
    if (skillComfort.length === 0) return '0';
    const total = skillComfort.reduce((sum, skill) => sum + skill.confidence_score, 0);
    return (total / skillComfort.length).toFixed(2);
  };

  const calculateStats = () => {
    const total = skills.length;
    if (total === 0) return null;

    const avgConfidence = (skills.reduce((sum, s) => sum + s.confidence_score, 0) / total).toFixed(2);
    return { avgConfidence };
  };

  const stats = calculateStats();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full mx-auto fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center">Skills Fluency</h1>

        {loading ? (
          <p>Loading skills...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {skills.length === 0 && skillComfort.length === 0 ? (
              <p className="text-gray-500">No skills found. Please add some skills.</p>
            ) : (
              <>
                {/* Summary Stats */}
                <div className="mb-10 bg-gray-100 p-4 rounded-lg shadow text-center">
                  <h2 className="text-xl font-semibold mb-2">Summary</h2>
                  <p><strong>Total Skills Tracked:</strong> {skillComfort.length}</p>
                  <p><strong>Average Confidence Score:</strong> {calculateAvgConfidence()}/10</p>
                </div>

                {/* Table: Skill Comfort Details */}
                {skillComfort.length > 0 && (
                  <div className="mb-10"> {/* Add margin to separate from chart */}
                    <h2 className="text-xl font-semibold mb-4 text-center">Skill Comfort Breakdown</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Skill Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Proficiency
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Confidence Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Last Practiced
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {skillComfort.map((skill) => (
                            <tr key={skill.skill_id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b">
                                {skill.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                                {skill.proficiency}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                                {skill.confidence_score}/10
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                                {new Date(skill.last_practiced).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Graph: Use skill_name for X-axis (matches API) */}
                {/* Graph */}
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 text-center">Confidence</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skills}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="confidence_score" fill="#82ca9d" name="Confidence" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SkillFluency;