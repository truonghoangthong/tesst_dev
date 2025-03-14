import React, { useState, useEffect } from "react";
import './RoomBooking.css';
import useRoomBookingStore from "../../../../../Backend/src/store/roomBookingStore";
import useAuthStore from '../../../../../Backend/src/store/authStore';
import { Timestamp } from "firebase/firestore"; 

const RoomBooking = () => {
  const [newBooking, setNewBooking] = useState({
    bookingPeriod: {
      startFrom: '',
      endAt: ''
    },
    room: ''
  });

  const { roomBookings, addRoomBooking, deleteRoomBooking, fetchRoomBookings } = useRoomBookingStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchRoomBookings();
    }
  }, [user, fetchRoomBookings]);

  const userBookings = roomBookings.filter(
    (booking) => booking.client.uid === user?.uid
  );

  const handleAddBooking = async (e) => {
    e.preventDefault();

    const startFrom = new Date(`${newBooking.bookingPeriod.startFrom}T14:00:00`);
    const endAt = new Date(`${newBooking.bookingPeriod.endAt}T12:00:00`);

    const bookingData = {
      ...newBooking,
      bookingPeriod: {
        startFrom: Timestamp.fromDate(startFrom), 
        endAt: Timestamp.fromDate(endAt),
      },
      client: {
        fullName: user.fullName,
        uid: user.uid,
      },
    };

    const response = await addRoomBooking(bookingData);
    alert(response.Message);
    if (response.Status === "success") {
      setNewBooking({
        bookingPeriod: {
          startFrom: '',
          endAt: ''
        },
        room: ''
      });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const response = await deleteRoomBooking(bookingId, user.uid);
    alert(response.Message);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <div className="rooms-client">
      <h2>Room Booking</h2>

      <form onSubmit={handleAddBooking}>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={newBooking.bookingPeriod.startFrom}
            onChange={(e) => setNewBooking({ ...newBooking, bookingPeriod: { ...newBooking.bookingPeriod, startFrom: e.target.value } })}
            required
          />
          <small>Default time: 2:00 PM</small>
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={newBooking.bookingPeriod.endAt}
            onChange={(e) => setNewBooking({ ...newBooking, bookingPeriod: { ...newBooking.bookingPeriod, endAt: e.target.value } })}
            required
          />
          <small>Default time: 12:00 PM</small>
        </div>
        <div>
          <label>Room:</label>
          <input
            type="text"
            value={newBooking.room}
            onChange={(e) => setNewBooking({ ...newBooking, room: e.target.value })}
            required
          />
        </div>
        <button type="submit">Add Booking</button>
      </form>

      <h3>Your Bookings</h3>
      <ul>
        {userBookings.map((booking) => (
          <li key={booking.bookingId}>
            <p>Room: {booking.room}</p>
            <p>Client: {booking.client.fullName}</p>
            <p>Start: {formatTimestamp(booking.bookingPeriod.startFrom)}</p>
            <p>End: {formatTimestamp(booking.bookingPeriod.endAt)}</p>
            <button onClick={() => handleDeleteBooking(booking.bookingId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomBooking;