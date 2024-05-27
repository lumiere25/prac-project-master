import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Pages/Home";
import Navbar from "./components/Navbar";
import { Auth } from "./Firebase";


export default function App() {

  // State variables that determine if a user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ loggedInEmail, setLoggedInEmail ] = useState("");
 

  const handleSignIn = (email) => {
    console.log("signing in with email", email);
      // Passes the value of email into the setter function
    setLoggedInEmail(email);
    setIsAuthenticated(true);
  }


  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInEmail(null);
    Auth.signOut();
    } 



  return (
    <Router>
      <div className="app">
      {isAuthenticated && <Navbar loggedInEmail={loggedInEmail} onLogout={handleLogout} />}
        <Routes>
          {/* One route for the root, Home will handle what to display */}
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} handleAppSignIn={handleSignIn} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}
