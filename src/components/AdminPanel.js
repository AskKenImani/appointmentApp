import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import jsPDF from "jspdf";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const appointmentsCollection = collection(db, "appointments");

    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeAppointments = onSnapshot(appointmentsCollection, (snapshot) => {
      setAppointments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeAppointments();
    };
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleConfirmPayment = async (apptId) => {
    try {
      await updateDoc(doc(db, "appointments", apptId), { paymentStatus: "Paid" });
      alert("Payment Confirmed!");
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  const handleCheckIn = async (apptId) => {
    try {
      await updateDoc(doc(db, "appointments", apptId), { status: "Checked-in" });
      alert("User Checked-in!");
    } catch (error) {
      console.error("Error checking in user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        alert("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleDeleteAppointment = async (apptId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteDoc(doc(db, "appointments", apptId));
        alert("Appointment deleted successfully.");
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleGenerateReceipt = (appt) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Appointment Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`User: ${appt.userName || "Unknown"}`, 20, 40);
    doc.text(`Email: ${appt.userEmail}`, 20, 50);
    doc.text(`Appointment Date: ${appt.appointmentDate}`, 20, 60);
    doc.text(`Status: ${appt.status || "Pending"}`, 20, 70);
    doc.text(`Payment Status: ${appt.paymentStatus || "Unpaid"}`, 20, 80);
    doc.save(`receipt_${appt.userName || "appointment"}.pdf`);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <h3>Manage Users</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Current Role</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.displayName || "Unknown"}</td>
              <td>{user.role}</td>
              <td>
                <select onChange={(e) => handleRoleChange(user.id, e.target.value)} value={user.role}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)} style={{ color: "red", fontWeight: "bold" }}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Appointments</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Appointment Date</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Actions</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>{appt.userName || "Unknown"}</td>
              <td>{appt.userEmail}</td>
              <td>{appt.appointmentDate}</td>
              <td>{appt.status || "Pending"}</td>
              <td>{appt.paymentStatus || "Unpaid"}</td>
              <td>
                <button onClick={() => handleConfirmPayment(appt.id)}>Confirm Payment</button>
                <button onClick={() => handleCheckIn(appt.id)}>Check-In</button>
                <button onClick={() => handleGenerateReceipt(appt)}>Generate Receipt</button>
              </td>
              <td>
                <button onClick={() => handleDeleteAppointment(appt.id)} style={{ color: "red", fontWeight: "bold" }}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
