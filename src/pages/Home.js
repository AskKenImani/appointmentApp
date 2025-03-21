import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="home" style={{ textAlign: "center", padding: "50px" }}>
      <h2>Welcome to the Appointment Booking System</h2>
      <p>Book an appointment and get confirmation after payment.</p>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <img 
          src="https://estheva.com/wp-content/uploads/2015/08/Spa_Booking_Online_Singapore.jpg" 
          alt="Appointment Booking" 
          style={{ width: "60%", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
        />
      </div>

      {!user && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              margin: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "10px 20px",
              margin: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
