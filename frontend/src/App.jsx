import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Lawbot from "./pages/Lawbot";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import LawyerDashboard from "./pages/LawyerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import UserDashboard from "./pages/UserDashboard";
import Dashboard from "./pages/Dashboard";
import FindLawyer from "./pages/FindLawyer";
import Internships from "./pages/Internships";
import About from "./pages/About";
import QuickLinks from "./pages/QuickLinks";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FindClient from "./pages/FindClient";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lawbot" element={<Lawbot />} />
        <Route path="/find-lawyer" element={<FindLawyer />} />
        <Route path="/find-client" element={<FindClient />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/quick-links" element={<QuickLinks />} />
        <Route path="/lawyer_dash" element={<LawyerDashboard />} />
        <Route path="/student_dash" element={<StudentDashboard />} />
        <Route path="/user_dash" element={<UserDashboard />} />
        <Route path="/client_dash" element={<UserDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
