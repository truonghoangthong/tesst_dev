import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "./rooms.css";
import "../../components/variables.css";
import { roomStore } from "../../state/booking-room";

const Rooms = () => {
  const [activeRoom, setActiveRoom] = useState("B Lentäjän Poika 2");
  const [dropdownOpen, setDropdownOpen] = useState(null); 
  const { rooms, bookings, setBookings } = roomStore();  

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

  const statusOptions = ["Available", "Booked", "Pending confirmation", "Triggered the trigger", "Cleaning", "Occupied"];

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
          {bookings.map((booking, index) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.guest}</td>
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
                          onClick={() => {
                            updateStatus(index, statusOption); 
                          }}
                        >
                          {statusOption}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td>{booking.action}</td>
              <td>{booking.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rooms;
