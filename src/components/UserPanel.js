import React, { useState, useEffect, useRef } from "react";
import { PaystackButton } from "react-paystack";
import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";

function UserPanel() {
  const { user } = useAuth();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [room, setRoom] = useState("");
  const [fullName, setFullName] = useState("Unknown");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookings, setBookings] = useState([]);
  const receiptRef = useRef();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFullName(userSnap.data().fullName || "Unknown");
        }
      }
    };
    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (user?.uid) {
        const q = query(collection(db, "appointments"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userBookings = querySnapshot.docs.map((doc) => doc.data());
        setBookings(userBookings);
      }
    };
    fetchUserBookings();
  }, [user]);

  const publicKey = "pk_test_1be7c3acc288ee8b9f77120f66d70c01e3d6d2e8";
  const amount = 5000000;

  const onSuccess = async (reference) => {
    try {
      await addDoc(collection(db, "appointments"), {
        userId: user.uid,
        userName: fullName,
        userEmail: user.email,
        appointmentDate,
        room,
        paymentStatus: "Paid",
        transactionId: reference.reference,
        totalAmount: amount / 100,
        timestamp: new Date(),
      });

      setSuccess("Appointment booked successfully!");
      setError("");
      setAppointmentDate("");
      setRoom("");
    } catch (err) {
      setError("Error saving appointment: " + err.message);
    }
  };

  const onClose = () => {
    setError("Payment was not completed. Please try again.");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Receipt for ${fullName}`, 10, 10);
    let yPos = 20;
    bookings.forEach((booking, index) => {
      doc.text(`Appointment ${index + 1}: ${booking.appointmentDate}`, 10, yPos);
      doc.text(`Room: ${booking.room || "N/A"}`, 10, yPos + 10);
      doc.text(`Payment Status: ${booking.paymentStatus}`, 10, yPos + 20);
      doc.text(`Transaction ID: ${booking.transactionId}`, 10, yPos + 30);
      doc.text(`Total Paid: NGN ${booking.totalAmount}`, 10, yPos + 40);
      yPos += 50;
    });
    doc.save("Receipt.pdf");
  };

  const componentProps = {
    email: user?.email || "guest@example.com",
    amount,
    currency: "NGN",
    publicKey,
    text: "Pay Now",
    onSuccess,
    onClose,
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p>Booking as: {fullName}</p>
      <input
        type="datetime-local"
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Enter Room (Optional)"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <PaystackButton {...componentProps} />
      <h3>Your Bookings</h3>
      <ul>
        {bookings.map((booking, index) => (
          <li key={index}>
            Appointment: {booking.appointmentDate} - Room: {booking.room || "N/A"} - Payment Status: {booking.paymentStatus} (Transaction ID: {booking.transactionId}) - Total Paid: NGN {booking.totalAmount}
          </li>
        ))}
      </ul>
      <button onClick={generatePDF}>Print</button>
    </div>
  );
}

export default UserPanel;
