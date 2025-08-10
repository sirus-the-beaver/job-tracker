import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const SkillFluency = () => {
  // Add skillComfort state to match your table usage
  const [skillComfort, setSkillComfort] = useState([]);
  const [skillFrequency, setSkillFrequency] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
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

      // Prepare data for pie chart
      setPieChartData(frequencyResponse.data.map(skill => {
        return {
          name: skill.skill_name,
          value: skill.frequency_in_applications,
          fill: `#${Math.floor(Math.random() * 16777215).toString(16)}` // Random color for each skill
        }
      }))
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
        <h1 className="text-2xl font-bold mb-6 text-center">Skills Fluency Tracking</h1>

        {loading ? (
          <p>Loading skills...</p>
        ) : (
          <div>
              <div>
                {skillFrequency.length === 0 ? (
                  <p className="text-center text-gray-500">No skills found in your applications.</p>
                ) :
                {/* Pie chart: skill frequency */}
                (
                  <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-center underline">Frequency of each skill in your applications</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Table: skill comfort */}
                {skillComfort.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-center underline">Skills that you should improve</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Skill
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
                                {skill.skill_name}
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
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillFluency;