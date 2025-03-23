import React, { useState, useEffect } from "react";
import "./adminEvents.css";
import CardModal from "../../card/cardModel";
import { Icon } from "@iconify/react";

const AdminEvents = () => {
  const [events, setEvents] = useState([]); 
  const [isModalOpen, setModalOpen] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState(null); 

  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "Event 1",
        content: "This is the content of Event 1.",
        image: "https://via.placeholder.com/150",
        status: "pending",
      },
      {
        id: 2,
        title: "Event 2",
        content: "This is the content of Event 2.",
        image: "https://via.placeholder.com/150",
        status: "approved",
      },
      {
        id: 3,
        title: "Event 3",
        content: "This is the content of Event 3.",
        image: "https://via.placeholder.com/150",
        status: "rejected",
      },
    ];
    setEvents(mockEvents);
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleApprove = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, status: "approved" } : event
      )
    );
  };

  const handleReject = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, status: "rejected" } : event
      )
    );
  };

  return (
    <div className="admin-events">
      <div className="dir">
        <span>Dashboard</span>
        <Icon icon="material-symbols:chevron-right-rounded" width="24" height="24" />
        <span>Events</span>
      </div>

      <h1>Event Approval</h1>

      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} onClick={() => handleEventClick(event)}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>
                <span className={`status ${event.status}`}>
                  {event.status.toUpperCase()}
                </span>
              </td>
              <td>
                <button
                  className="approve-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(event.id);
                  }}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(event.id);
                  }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        content={
          selectedEvent && (
            <div className="event-details">
              <h2>{selectedEvent.title}</h2>
              {selectedEvent.image && (
                <img src={selectedEvent.image} alt={selectedEvent.title} />
              )}
              <p>{selectedEvent.content}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${selectedEvent.status}`}>
                  {selectedEvent.status.toUpperCase()}
                </span>
              </p>
            </div>
          )
        }
      />
    </div>
  );
};

export default AdminEvents;