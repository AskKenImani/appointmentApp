import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate(); 

  return (
    <div className="about" style={{ textAlign: "center", padding: "50px" }}>
      <h2>About Our Spa</h2>
      <p>Relax, rejuvenate, and refresh with our premium spa services.</p>

      <motion.img
        src="https://anantaralawana.guestservice.guru/wp-content/uploads/sites/11/kids-spa-treatment.jpg"
        alt="Spa Image 1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ width: "30%", borderRadius: "45px", margin: "20px 10px" }}
      />

      <motion.img
        src="https://static.vecteezy.com/system/resources/previews/013/898/887/large_2x/woman-enjoying-pedicure-spa-treatment-at-a-beauty-salon-photo.jpg"
        alt="Spa Image 2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        style={{ width: "30%", borderRadius: "45px", margin: "20px 10px" }}
      />

       <motion.img
        src="https://www.szechenyibath.hu/static/dokumentumtar/Massz%C3%A1zsok/_SIM1038a.jpg"
        alt="Spa Image 2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        style={{ width: "30%", borderRadius: "45px", margin: "20px 10px" }}
      />

       <motion.img
        src="https://villagrouploreto.s3.amazonaws.com/uploads/article/cover/436/experiencias-de-spa-para-ninos-en-sabila-spa-en-loreto.jpg"
        alt="Spa Image 2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        style={{ width: "30%", borderRadius: "45px", margin: "20px 10px" }}
      />

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default About;
