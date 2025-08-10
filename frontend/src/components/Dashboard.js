// Citation for authentication implementation:
// Date: 07/16/2025
// Source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
// Author(s): Makanju Oluwafemi
// Citation for Mobile Menu Implementation:
// Date: 08/10/2025
// Source: https://tailwindcss.com/docs/animation


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faClipboardQuestion, faPaperPlane, faBars, faX, faBriefcase, faHouse, faBuilding, faCode, faAddressBook, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import SideNav from './SideNav';

const Dashboard = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, []);

  // Fetch job data
  const [jobs, setJobs] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [interviews, setInterviews] = useState(0);
  const [offers, setOffers] = useState(0);
  const [pending, setPending] = useState(0);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data);
        setTotalApplications(response.data.length);
        setInterviews(response.data.filter(job => job.status === 'interviewing').length);
        setOffers(response.data.filter(job => job.status === 'offer').length);
        setPending(response.data.filter(job => job.status === 'applied').length);
        setRecentApps(response.data.slice(response.data.length - 3, response.data.length).reverse());
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

    if (token) {
      fetchJobs();
    }
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

  // Mobile menu toggle handler
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Authentication handlers
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faBriefcase} className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">JobTracker</h1>
            </div>
            
            <button 
              onClick={token ? handleLogout : handleLogin}
              className="flex items-center gap-1 px-1 py-2 rounded-md text-sm transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 absolute right-0 top-0 z-50"
              style={{ minWidth: '50px' }} 
            >
              <FontAwesomeIcon icon={token ? faSignOutAlt : faSignInAlt} className="h-4 w-4" />
              <span>{token ? 'Logout' : 'Login'}</span>
            </button>
            
            {/* Hamburger menu button - mobile only */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden px-1 p-1 py-1 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? 
                <FontAwesomeIcon icon={faX} className="h-6 w-6" /> : 
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute top-16 left-0 right-0 z-50 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="p-4 space-y-1">
            <button 
              onClick={token ? handleLogout : handleLogin}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 transition-colors hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={token ? faSignOutAlt : faSignInAlt} className="mr-3 h-5 w-5" />
              <span>{token ? 'Logout' : 'Login'}</span>
            </button>

            <Link 
              to="/" 
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 transition-colors hover:bg-blue-200"
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faHouse} className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <div className="flex flex-col items-start">
              <div className="flex flex-col items-start w-full">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4 flex items-center w-full">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2 h-4 w-4" /> 
                  Applications
                </h2>
                <ul className="space-y-2 flex flex-col w-full">
                  <li className="w-full">
                    <Link
                      to="/new-job"
                      className="block w-full px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 transition-colors hover:bg-blue-200"
                      onClick={toggleMobileMenu}
                    >
                      Add New Application
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link
                      to="/view-jobs"
                      className="block w-full px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 transition-colors hover:bg-blue-200"
                      onClick={toggleMobileMenu}
                    >
                      View Applications
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-start w-full">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4 flex items-center w-full">
                  <FontAwesomeIcon icon={faCode} className="mr-2 h-4 w-4" /> 
                  Skills
                </h2>
                <ul className="space-y-2 flex flex-col w-full">
                  <li className="w-full">
                    <Link
                      to="/new-skill"
                      className="block w-full px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 transition-colors hover:bg-blue-200"
                      onClick={toggleMobileMenu}
                    >
                      Add New Skill
                    </Link>
                  </li>
                  <li className="w-full">
                    <a
                      href="/skillFluency"
                      className="block w-full px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 transition-colors hover:bg-blue-200"
                      onClick={toggleMobileMenu}
                    >
                      View Skill Fluency
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-start w-full">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4 flex items-center w-full">
                  <FontAwesomeIcon icon={faAddressBook} className="mr-2 h-4 w-4" /> 
                  Contacts
                </h2>
                <ul className="space-y-2 flex flex-col w-full">
                  <li className="w-full">
                    <Link
                      to="/new-contact"
                      className="block w-full px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 transition-colors hover:bg-blue-200"
                      onClick={toggleMobileMenu}
                    >
                      Add New Contact
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link
                      to="/view-contacts"
                      className="block w-full px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 transition-colors hover:bg-blue-200"
                      onClick={toggleMobileMenu}
                    >
                      View Contacts
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <SideNav />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600 mt-1">Here's your job search summary</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalApplications}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <FontAwesomeIcon icon={faPaperPlane} className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interviews</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{interviews}</h3>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full">
                    <FontAwesomeIcon icon={faClipboardQuestion} className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-md">
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

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-md">
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

            {/* Recent Applications*/}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
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
                    {recentApps.length > 0 ? (
                      recentApps.map((app) => (
                        <tr key={app.job_id} className="hover:bg-gray-50 transition-colors duration-200">
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                          No recent applications found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
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
