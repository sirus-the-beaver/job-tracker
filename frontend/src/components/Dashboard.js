// Citation for authentication implementation:
// Date: 07/16/2025
// Source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
// Author(s): Makanju Oluwafemi


import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faChartLine, faSignOutAlt, faPlus, faCheckCircle, faClock, faSearch, faBuilding, faHouse, faAddressBook, faCode } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const token = localStorage.getItem('token');

  const [jobs, setJobs] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [interviews, setInterviews] = useState(0);
  const [offers, setOffers] = useState(0);
  const [pending, setPending] = useState(0);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5045/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data);
        setTotalApplications(response.data.length);
        setInterviews(response.data.filter(job => job.status === 'interviewing').length);
        setOffers(response.data.filter(job => job.status === 'offer').length);
        setPending(response.data.filter(job => job.status === 'applied').length);
        setRecentApps(response.data.slice(response.data.length - 3, response.data.length).reverse()); // Get the most recent 3 applications
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        setTotalApplications(0);
        setInterviews(0);
        setOffers(0);
        setPending(0);
        setRecentApps([]);
      }
    };
    fetchJobs();
  }, [token]);

  const getStatusBadge = (status) => {
    const styles = {
      'interviewing': 'bg-purple-100 text-purple-800',
      'applied': 'bg-blue-100 text-blue-800',
      'offer': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'interested': 'bg-amber-100 text-amber-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faBriefcase} className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">JobTracker</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                  {user?.email || user?.name}
                </span>
                <button 
                  onClick={logout}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Logout"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:block">
          <nav className="p-4 space-y-1">
            <a 
              href="/" 
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-700 text-white transition-colors"
            >
              <FontAwesomeIcon icon={faHouse} className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <div className="flex flex-col items-start">
              <div className="flex flex-col items-start">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4"><FontAwesomeIcon icon={faBuilding} /> Applications</h2>
                <ul className="space-y-4 flex flex-col">
                  <li>
                    <a
                      href="/new-job"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      Add New Application
                    </a>
                  </li>
                  <li>
                    <a
                      href="/view-jobs"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700" 
                    >
                      View Applications
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-start">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4"><FontAwesomeIcon icon={faCode} /> Skills</h2>
                <ul className="space-y-4 flex flex-col">
                  <li>
                    <a
                      href="/new-skill"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      Add New Skill
                    </a>
                  </li>
                  <li>
                    <a
                      href="/skillFluency"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      View Skill Fluency
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-start">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4"><FontAwesomeIcon icon={faAddressBook} /> Contacts</h2>
                <ul className="space-y-4 flex flex-col">
                  <li>
                    <a
                      href="/new-contact"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      Add New Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="/view-contacts"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      View Contacts
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600 mt-1">Here's your job search summary</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalApplications}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <FontAwesomeIcon icon={faBriefcase} className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interviews</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{interviews}</h3>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full">
                    <FontAwesomeIcon icon={faBriefcase} className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Offers</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{offers}</h3>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{pending}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-full">
                    <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentApps.map((app) => (
                    <tr key={app.job_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.positionTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                        {app.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.application_date ? new Date(app.application_date).toLocaleDateString() : 'N/A'}
                    </td>

                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            ❤️ Sirus Salari, Thomas Murray, Chengjie Shen
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;