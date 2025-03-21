import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, query, where, onSnapshot } from "firebase/firestore";

const ReceptionistPanel = () => {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), where("role", "not-in", ["admin", "manager"]));
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
      setReservations(bookingList);
    });
    return () => unsubscribe();
  }, []);

  const updateCheckStatus = async (bookingId, status) => {
    const bookingRef = doc(db, "appointments", bookingId);
    await updateDoc(bookingRef, { checkStatus: status });
  };

  return (
    <div>
      <h2>Receptionist Dashboard</h2>
      
      <h3>All Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.fullName} - {u.email} ({u.role})</li>
        ))}
      </ul>
      
      <h3>Guest Reservations</h3>
      <table border="1">
        <thead>
          <tr>
            <th>User</th>
            <th>Appointment Date</th>
            <th>Room</th>
            <th>Payment Status</th>
            <th>Check Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id}>
              <td>{res.userName}</td>
              <td>{res.appointmentDate}</td>
              <td>{res.room || "N/A"}</td>
              <td>{res.paymentStatus}</td>
              <td>
                {res.checkStatus === "Checked-Out" ? (
                  "Checked-Out"
                ) : res.checkStatus === "Checked-In" ? (
                  <button onClick={() => updateCheckStatus(res.id, "Checked-Out")}>
                    Check-Out
                  </button>
                ) : (
                  <button onClick={() => updateCheckStatus(res.id, "Checked-In")}>
                    Check-In
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceptionistPanel;
