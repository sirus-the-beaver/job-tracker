import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBuilding, faCode, faAddressBook } from '@fortawesome/free-solid-svg-icons';

const SideNav = () => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:block">
          <nav className="p-4 space-y-1">
            <Link 
              to="/" 
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-50 text-gray-900 bg-blue-100 text-blue-700"
            >
              <FontAwesomeIcon icon={faHouse} className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <div className="flex flex-col items-start">
              <div className="flex flex-col items-start">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4"><FontAwesomeIcon icon={faBuilding} /> Applications</h2>
                <ul className="space-y-4 flex flex-col">
                  <li>
                    <Link
                      to="/new-job"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      Add New Application
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/view-jobs"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700" 
                    >
                      View Applications
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-start">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4"><FontAwesomeIcon icon={faCode} /> Skills</h2>
                <ul className="space-y-4 flex flex-col">
                  <li>
                    <Link
                      to="/new-skill"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      Add New Skill
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-start">
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4"><FontAwesomeIcon icon={faAddressBook} /> Contacts</h2>
                <ul className="space-y-4 flex flex-col">
                  <li>
                    <Link
                      to="/new-contact"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      Add New Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/view-contacts"
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors bg-blue-100 text-blue-700"
                    >
                      View Contacts
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </aside>
    )
};

export default SideNav;