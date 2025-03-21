import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim()) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        phoneNumber,
        email: user.email,
        role: "user",
        createdAt: new Date().toISOString(),
      });
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.section className="form-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister}>
        <label>Full Name</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <label>Phone Number</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="submit">Sign Up</motion.button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </motion.section>
  );
};

export default Register;
