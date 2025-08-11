import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faSignOutAlt, faHouse, faBuilding, faCode, faAddressBook, faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';


const Header = () => {
    const { logout } = useAuth();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
      <div className="bg-gray-100">
        <header className="bg-white shadow-sm border-gray-200 sticky top-0 z-40">
        {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute top-16 left-0 right-0 z-50 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="p-4 space-y-1">
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
            <button 
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 transition-colors hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faBriefcase} className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">JobTracker</h1>
            </div>

            <div className="flex items-center ml-auto">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle mobile menu"
              >
                <FontAwesomeIcon icon={mobileMenuOpen ? faCircleXmark : faBars} className="h-7 w-7" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={logout}
                  className="hidden md:flex items-center rounded-md text-sm transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50"
                  aria-label="Logout"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      </div>
    )
};

export default Header;