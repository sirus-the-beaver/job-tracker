import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const SkillFluency = () => {
  // Add skillComfort state to match your table usage
  const [skills, setSkills] = useState([]);
  const [skillComfort, setSkillComfort] = useState([]);
  const [skillFrequency, setSkillFrequency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchSkillFrequency = async () => {
    try {
      setLoading(true);
      // Fetch skill frequency data
      const frequencyResponse = await axios.get('https://job-tracker-backend-mu.vercel.app/skillFluency/skill-frequency', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSkillFrequency(frequencyResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching skill frequency:', err);
      setError('Failed to load skill frequency. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillFrequency();
  }, [token]);

  const fetchSkillComfort = async () => {
    try {
      setLoading(true);
      // Fetch skill comfort data
      const comfortResponse = await axios.get('https://job-tracker-backend-mu.vercel.app/skillFluency/skill-comfort', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSkillComfort(comfortResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching skill comfort:', err);
      setError('Failed to load skill comfort. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillComfort();
  }, [token]);

  // const fetchSkills = async () => {
  //   try {
  //     setLoading(true);
  //     // Fetch main skills data (adjust URL if needed)
  //     const skillsResponse = await axios.get('https://job-tracker-backend-mu.vercel.app/skills', {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     setSkills(skillsResponse.data);
  //     setError(null);
  //   } catch (err) {
  //     console.error('Error fetching skills:', err);
  //     setError('Failed to load skills. Please try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchSkills();
  // }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {error && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
          <div className='bg-white p-6 text-center space-y-4 rounded-xl shadow-xl max-w-sm w-full'>
              <h2 className='text-lg font-semibold text-red-600'>Error fetching skills fluency data</h2>
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
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full mx-auto fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center">Skills Fluency</h1>

        {loading ? (
          <p>Loading skills...</p>
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