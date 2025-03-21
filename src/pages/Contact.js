import React from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  return (
    <div className="form-container" style={{ textAlign: "center", padding: "50px" }}>
      <h2>Contact Us</h2>
      <p>We'd love to hear from you! Fill out the form below or call us.</p>
      
      <form style={{ display: "inline-block", textAlign: "left" }}>
        <label>Name:</label>
        <input type="text" name="name" required style={{ display: "block", width: "100%", marginBottom: "10px" }} />
        
        <label>Email:</label>
        <input type="email" name="email" required style={{ display: "block", width: "100%", marginBottom: "10px" }} />
        
        <label>Message:</label>
        <textarea name="message" required style={{ display: "block", width: "100%", marginBottom: "10px" }}></textarea>
        
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Send
        </button>
      </form>

      <button onClick={() => navigate("/")} style={{ display: "block", marginTop: "20px" }}>
        Back to Home
      </button>
    </div>
  );
}

export default Contact;
