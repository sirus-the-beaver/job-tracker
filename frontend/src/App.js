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
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
  );
}

export default App;
