import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import "./rooms.css"; 
import "../../variables.css";
import { bookingStore } from "../../../state/bookingStore.js";
import { userStore } from "../../../state/user.js";
import CardModal from "../../card/cardModel.jsx";
const Rooms = () => {
  const users = userStore((state) => state.users);
  const { rooms, bookings, setBookings } = bookingStore(); 
  const [activeRoom, setActiveRoom] = useState("B Lentäjän Poika 2");
  const statusOptions = ["Available", "Booked", "Pending confirmation", "Triggered the trigger", "Cleaning", "Occupied"];
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const updateStatus = (index, newStatus) => {
    const updatedBookings = bookings.map((booking, i) =>
      i === index ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    setDropdownOpen(null);
  };

  const bookingsWithGuests = useMemo(() => {
    return bookings.map((booking) => {
      const guest = users.find((user) => user.id === booking.guestId);
      return { ...booking, guest };
    });
  }, [bookings, users]);

  const handleGuestClick = (guest) => {
    setModalContent(
      <table className="info-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{guest.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{guest.email}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{guest.phone}</td>
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
    return ["Booking No.", "Guest", "Check-in", "Check-out", "Status", "Actions", "Note"];
  };

  return (
    <div className="rooms">
      <div className="dir">
        <span>Dashboard</span>
        <Icon icon="material-symbols:chevron-right-rounded" width="24" height="24" />
        <span>{activeRoom}</span>
      </div>

      <div className="tab-dropdown-container">
        <select
          className="tab-dropdown"
          value={activeRoom}
          onChange={(e) => setActiveRoom(e.target.value)}
        >
          {rooms.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
      </div>

      <div className="tabs">
        {rooms.map((room) => (
          <span
            key={room}
            className={`tab-item ${activeRoom === room ? "active" : ""}`}
            onClick={() => setActiveRoom(room)}
          >
            {room}
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
          {bookingsWithGuests.map((booking, index) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>
                <span variant="link" onClick={() => handleGuestClick(booking.guest)}>
                  {booking.guest ? booking.guest.name : "No Guest"}
                </span>
              </td>
              <td>{booking.checkIn}</td>
              <td>{booking.checkOut}</td>
              <td>
                <div className="dropdown-container">
                  <div
                    className={`status ${booking.status.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => toggleDropdown(index)}
                  >
                    {booking.status}
                    <Icon icon="material-symbols:arrow-drop-down" />
                  </div>
                  {dropdownOpen === index && (
                    <div className="dropdown">
                      {statusOptions.map((statusOption) => (
                        <div
                          key={statusOption}
                          className="dropdown-item"
                          onClick={() => updateStatus(index, statusOption)}
                        >
                          {statusOption}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <span variant="link" onClick={() => handleActionClick(booking.action)}>
                  {booking.action}
                </span>
              </td>
              <td>
                <span variant="link" onClick={() => handleNoteClick(booking.note)}>
                  {booking.note}
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
