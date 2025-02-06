import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import "./rooms.css";
import "../../variables.css";
import { roomStore } from "../../../state/booking-room.js";
import { userStore } from "../../../state/user.js";
import CardModel from "../../cardModel";

const Rooms = () => {
  const users = userStore((state) => state.users);
  const { rooms, bookings, setBookings } = roomStore();
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
    setModalContent({ type: 'guest', content: guest?.name || "No Guest" }); // Pass guest name only
    setModalOpen(true);
  };

  // Handle action modal
  const handleActionClick = (action) => {
    setModalContent({ type: 'action', content: action || "No Action" }); // Handle action content
    setModalOpen(true);
  };

  // Handle note modal
  const handleNoteClick = (note) => {
    setModalContent({ type: 'note', content: note || "No Note" }); // Handle note content
    setModalOpen(true);
  };

  return (
    <div className="rooms">
      <div className="dir">
        <span>Dashboard</span>
        <Icon icon="material-symbols:chevron-right-rounded" width="24" height="24" />
        <span>{activeRoom}</span>
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
            <th>Booking No.</th>
            <th>Guest</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {bookingsWithGuests.map((booking, index) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>
                <span
                  variant="link"
                  onClick={() => handleGuestClick(booking.guest)}
                >
                  {booking.guest ? booking.guest.name : "No Guest"}  {/* Render guest name */}
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
                  {booking.action || "No Action"} {/* Render action */}
                </span>
              </td>
              <td>
                <span variant="link" onClick={() => handleNoteClick(booking.note)}>
                  {booking.note || "No Note"} {/* Render note */}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CardModel
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        content={modalContent}
        setModalContent={setModalContent}
      />
    </div>
  );
};

export default Rooms;
