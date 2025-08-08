/* Citation for lines 15-18:
Date: 07/11/2025
Based on:
Source: GeeksforGeeks
Section: Steps to Create Routes using React Router
Subsection: Example: This example demonstrates implemeting basic routes in a React App.
URL: https://www.geeksforgeeks.org/reactjs/reactjs-router/ */

/* Citation for lines 19 and 24, 26-29:
Date: 07/16/2025
Source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
Author(s): Makanju Oluwafemi */

import { Routes, Route } from "react-router-dom";
import AuthProvider from './contexts/AuthContext';
import PrivateRoute from './contexts/PrivateRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import NewJob from './components/NewJob';
import NewSkill from './components/NewSkill';
import NewContact from './components/NewContact';
import ViewJobs from './components/ViewJobs';
import EditJob from './components/EditJob';
import EditSkill from './components/EditSkill';
import ViewContacts from './components/ViewContacts';
import EditContact from './components/EditContact';
import SkillFluency from './components/skillFluency';



function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Add private routes here */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />

          {/* Jobs */}
          <Route path="/new-job" element={<NewJob />} />
          <Route path="/view-jobs" element={<ViewJobs />} />
          <Route path="/edit-job/:jobId" element={<EditJob />} />

          {/* Skills */}
          <Route path="/new-skill" element={<NewSkill />} />
          <Route path="/skillFluency" element={<SkillFluency />} />
          <Route path="/edit-skill/:skillId" element={<EditSkill />} />

          {/* Contacts */}
          <Route path="/new-contact" element={<NewContact />} />
          <Route path="/view-contacts" element={<ViewContacts />} />
          <Route path="/edit-contact/:contactId" element={<EditContact />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
