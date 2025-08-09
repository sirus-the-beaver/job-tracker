import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';


const Header = () => {
    const { logout } = useAuth();
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faBriefcase} className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">JobTracker</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
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
    )
};

export default Header;