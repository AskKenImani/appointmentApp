import React, { useState, useEffect } from "react";

function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <footer style={{ background: "#222", color: "#fff", textAlign: "center", padding: "20px" }}>
      
      <p>Follow us on:</p>
      <a href="mailto:imamikenny27@gmail.com">
        <img src="https://cdn-icons-png.flaticon.com/512/281/281769.png" width="30" alt="Gmail" />
      </a>
      <a href="https://www.instagram.com/kenmano2020">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="30" alt="Instagram" />
      </a>
      <a href="https://tiktok.com/@kehindeimani">
        <img src="https://cdn-icons-png.flaticon.com/512/3046/3046127.png" width="30" alt="Tiktok" />
      </a>

      <p>
        Current Nigerian Time:{" "}
        {time.toLocaleTimeString("en-NG", { timeZone: "Africa/Lagos", hour12: true })}
      </p>
      <p>
        Date: {time.toLocaleDateString("en-NG", { timeZone: "Africa/Lagos" })}
      </p>
      
    </footer>
  );
}

export default Footer;
