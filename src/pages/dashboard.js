import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";
import ManagerPanel from "../components/ManagerPanel";
import ReceptionistPanel from "../components/ReceptionistPanel";
import UserPanel from "../components/UserPanel";

const Dashboard = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "Not Assigned");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userRef = doc(db, "users", currentUser.uid);

        // Listen for real-time role updates
        const unsubscribeRole = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setRole(userData.role);
            localStorage.setItem("role", userData.role);
          } else {
            console.warn("User data not found in Firestore.");
          }
        });

        return () => unsubscribeRole();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <section className="dashboard">
      {user ? (
        <>
          <h2>Welcome, {user.email} 👋</h2>
          <p><strong>Your Role:</strong> {role}</p>

          {/* Render dashboard based on role */}
          {role === "admin" && <AdminPanel />}
          {role === "manager" && <ManagerPanel />}
          {role === "receptionist" && <ReceptionistPanel />}
          {role === "user" && <UserPanel />}

          {role === "Not Assigned" && <p>Your role has not been assigned yet. Contact an admin.</p>}

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </section>
  );
};

export default Dashboard;
