import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import About from "./pages/About"; // ✅ Import About Page
import Contact from "./pages/Contact"; // ✅ Import Contact Page
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./style.css";

function App() {
  return (
    <AuthProvider> {/* Ensure AuthProvider wraps the entire app */}
      <Router>
        <Header />
        <AppRoutes />
        <Footer />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth(); // Get auth state from context

  if (loading) return <p>Please wait...</p>; // Show loading screen while checking auth state

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/about" element={<About />} /> {/* ✅ About Page */}
      <Route path="/contact" element={<Contact />} /> {/* ✅ Contact Page */}
    </Routes>
  );
}

export default App;
