import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => console.log("User logged out"))
      .catch((error) => console.error("Logout Error:", error));
  };

  return (
    <header style={{ background: "#333", color: "#fff", padding: "10px 20px" }}>
      <h1>Appointment System</h1>
      <nav>
        <Link to="/">Home</Link> | 
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link> | 
            <button onClick={handleLogout} style={{ background: "none", color: "white", border: "none", cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | 
            <Link to="/register">Register</Link> | 
          </>
        )}
        <Link to="/about">About</Link> | 
        <Link to="/contact">Contact Us</Link>
      </nav>
    </header>
  );
}

export default Header;
