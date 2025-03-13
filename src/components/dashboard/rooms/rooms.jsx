import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import "./rooms.css"; 
import "../../variables.css";
import useRoomBookingStore from "../../../../../Backend/src/store/roomBookingStore.js";
import CardModal from "../../card/cardModel.jsx";

const Rooms = () => {
  const { roomBookings, fetchRoomBookings } = useRoomBookingStore();
  const [activeRoom, setActiveRoom] = useState("A"); // Still using "A", "B", "C" internally
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch bookings when the component loads
  useEffect(() => {
    fetchRoomBookings();
  }, [fetchRoomBookings]);

  const bookingsForActiveRoom = useMemo(() => {
    return roomBookings.filter((booking) => booking.room === activeRoom);
  }, [roomBookings, activeRoom]);

  const handleGuestClick = (guest) => {
    setModalContent(
      <table className="info-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{guest.fullName}</td>
          </tr>
          <tr>
            <th>UID</th>
            <td>{guest.uid}</td>
          </tr>
        </tbody>
      </table>
    );
    setModalOpen(true);
  };

  const handleActionClick = (action) => {
    setModalContent(`Edit Action: ${action}`);
    setModalOpen(true);
  };

  const handleNoteClick = (note) => {
    setModalContent(`Edit Note: ${note}`);
    setModalOpen(true);
  };

  const getColumns = () => {
    return ["Booking No.", "Guest", "Check-in", "Check-out", "Actions", "Note"];
  };

  const roomTabs = [
    { code: "A", label: "A Lentäjän Poika 1" },
    { code: "B", label: "B Lentäjän Poika 2" },
    { code: "C", label: "C Henry Ford Cabin" },
    { code: "D", label: "D Beach House" },
  ];

  return (
    <div className="rooms">
      <div className="dir">
        <span>Dashboard</span>
        <Icon icon="material-symbols:chevron-right-rounded" width="24" height="24" />
        <span>{roomTabs.find((room) => room.code === activeRoom)?.label}</span>
      </div>

      <div className="tab-dropdown-container">
        <select
          className="tab-dropdown"
          value={activeRoom}
          onChange={(e) => setActiveRoom(e.target.value)}
        >
          {roomTabs.map((room) => (
            <option key={room.code} value={room.code}>
              {room.label}
            </option>
          ))}
        </select>
      </div>

      <div className="tabs">
        {roomTabs.map((room) => (
          <span
            key={room.code}
            className={`tab-item ${activeRoom === room.code ? "active" : ""}`}
            onClick={() => setActiveRoom(room.code)}
          >
            {room.label}
          </span>
        ))}
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            {getColumns().map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookingsForActiveRoom.map((booking) => (
            <tr key={booking.bookingId}>
              <td>{booking.bookingId}</td>
              <td>
                <span variant="link" onClick={() => handleGuestClick(booking.client)}>
                  {booking.client.fullName}
                </span>
              </td>
              <td>{new Date(booking.bookingPeriod.startFrom.toMillis()).toLocaleString()}</td>
              <td>{new Date(booking.bookingPeriod.endAt.toMillis()).toLocaleString()}</td>
              <td>
                <span variant="link" onClick={() => handleActionClick(booking.action)}>
                  {booking.action || "No Action"}
                </span>
              </td>
              <td>
                <span variant="link" onClick={() => handleNoteClick(booking.note)}>
                  {booking.note || "No Note"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        content={modalContent}
        setModalContent={setModalContent}
      />
    </div>
  );
};

export default Rooms;
