// Citation for authentication implementation:
// Date: 07/16/2025
// Source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
// Author(s): Makanju Oluwafemi


import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { 
  faBriefcase, faChartLine, faSignOutAlt, faPlus,
  faCheckCircle, faClock, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const dashboardStats = {
  totalApplications: 3,
  interviews: 3,
  offers: 2,
  pending: 1
};

const recentApplications = [
  { id: 1, title: 'Frontend Developer', skill: 'React, JavaScript, HTML, CSS' ,company: 'TechCorp', status: 'Interviewing', date: '2025-07-24' },
  { id: 2, title: 'Technical Support Engineer',skill: 'Windows, Office 365, Intune, Troubleshooting',company: 'Microsoft', status: 'Applied', date: '2025-07-22' },
  { id: 3, title: 'Software Developer', skill: 'Python, Java, Algorithms, System Design' ,company: 'Google', status: 'Offer', date: '2025-07-20' }
];

const Dashboard = () => {
  const { user, logout } = useAuth();

  const getStatusBadge = (status) => {
    const styles = {
      'Interviewing': 'bg-purple-100 text-purple-800',
      'Applied': 'bg-blue-100 text-blue-800',
      'Offer': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Interested': 'bg-amber-100 text-amber-800'
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
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <a
              href="/view-jobs"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FontAwesomeIcon icon={faBriefcase} className="mr-3 h-5 w-5" />
              View Jobs
            </a>
            <a
              href="/skillFluency"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
              aria-label="View skill fluency dashboard"
            >
              <FontAwesomeIcon 
                icon={faGraduationCap}  // Skill/education related icon
                className="h-5 w-5 flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors" 
                aria-hidden="true"
              />
              View Skill Fluency
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600 mt-1">Here's your job search summary</p>
            </div>

            {/* Action Button */}
            <div className="mb-6">
            <a 
            href="/new-job"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            Add New Application
            </a>
            <a 
            href="/new-skill" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
            <FontAwesomeIcon icon={faPlus} className="mr-3 h-5 w-5" />
            Add Skill
            </a>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats.totalApplications}</h3>
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
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats.interviews}</h3>
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
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats.offers}</h3>
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
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats.pending}</h3>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.skill || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                        {app.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.date).toLocaleDateString()}
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