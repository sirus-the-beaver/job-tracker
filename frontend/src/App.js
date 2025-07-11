/* Citation for the following:
Date: 07/11/2025
Based on:
Source: GeeksforGeeks
Section: Steps to Create Routes using React Router
Subsection: Example: This example demonstrates implemeting basic routes in a React App.
URL: https://www.geeksforgeeks.org/reactjs/reactjs-router/ */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup'

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/Signup">Sign Up</Link>
          </li>
        </ul>
      </nav>
      {/* Implementing Routes for respective Path */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
