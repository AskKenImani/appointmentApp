import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, getDocs, updateDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";

function ManagerPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), where("role", "!=", "admin"));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = collection(db, "appointments");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingList);
    });
    return () => unsubscribe();
  }, []);

  const updateCheckStatus = async (bookingId, status) => {
    const bookingRef = doc(db, "appointments", bookingId);
    await updateDoc(bookingRef, { checkStatus: status });
  };

  const confirmPayment = async (bookingId) => {
    const bookingRef = doc(db, "appointments", bookingId);
    await updateDoc(bookingRef, { paymentStatus: "Confirmed" });
  };

  const generateReceipt = (booking) => {
    const doc = new jsPDF();
    doc.text(`Receipt for ${booking.userName}`, 10, 10);
    doc.text(`Appointment Date: ${booking.appointmentDate}`, 10, 20);
    doc.text(`Room: ${booking.room || "N/A"}`, 10, 30);
    doc.text(`Payment Status: ${booking.paymentStatus}`, 10, 40);
    doc.text(`Transaction ID: ${booking.transactionId}`, 10, 50);
    doc.text(`Total Paid: NGN ${booking.totalAmount}`, 10, 60);
    doc.save(`Receipt_${booking.userName}.pdf`);
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <h3>All Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.fullName} - {u.email} ({u.role})</li>
        ))}
      </ul>
      <h3>Bookings</h3>
      <table border="1">
        <thead>
          <tr>
            <th>User</th>
            <th>Appointment Date</th>
            <th>Room</th>
            <th>Payment Status</th>
            <th>Transaction ID</th>
            <th>Total Paid</th>
            <th>Check Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.userName}</td>
              <td>{b.appointmentDate}</td>
              <td>{b.room || "N/A"}</td>
              <td>{b.paymentStatus}</td>
              <td>{b.transactionId}</td>
              <td>NGN {b.totalAmount}</td>
              <td>
                {b.checkStatus === "Checked-Out" ? (
                  "Checked-Out"
                ) : b.checkStatus === "Checked-In" ? (
                  <button onClick={() => updateCheckStatus(b.id, "Checked-Out")}>
                    Check-Out
                  </button>
                ) : (
                  <button onClick={() => updateCheckStatus(b.id, "Checked-In")}>
                    Check-In
                  </button>
                )}
              </td>
              <td>
                {b.paymentStatus !== "Confirmed" && (
                  <button onClick={() => confirmPayment(b.id)}>Confirm Payment</button>
                )}
                <button onClick={() => generateReceipt(b)}>Generate Receipt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerPanel;
