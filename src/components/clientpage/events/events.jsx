import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./events.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleAddEvent = (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill out all required fields!");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title,
      image: image ? URL.createObjectURL(image) : null,
      content,
    };

    setEvents([...events, newEvent]);
    setTitle("");
    setImage(null);
    setContent("");
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <div className="events-page">
      <h1>Create Your Event</h1>
      <p>Organize your own events like camping trips, parties, or gatherings. Fill out the form below to get started!</p>

      <form onSubmit={handleAddEvent} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Name:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Summer Camping Trip 2023"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Event Image (optional):</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          <p className="hint">Upload a photo that represents your event.</p>
        </div>

        <div className="form-group">
          <label htmlFor="content">Event Details:</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="e.g., Join us for a fun camping trip at XYZ National Park! We'll have BBQ, games, and more."
          />
          <p className="hint">Describe your event in detail, including activities and any special instructions.</p>
        </div>

        <button type="submit" className="submit-button">
          Add Event
        </button>
      </form>

      {showSuccessMessage && (
        <div className="success-message">
          Event added successfully!
        </div>
      )}

      <div className="events-list">
        <h2>Event List</h2>
        {events.length === 0 ? (
          <p>No events added yet.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              {event.image && (
                <img src={event.image} alt={event.title} className="event-image" />
              )}
              <h3 className="event-title">{event.title}</h3>
              <div
                className="event-content"
                dangerouslySetInnerHTML={{ __html: event.content }}
              />
              <button
                className="delete-button"
                onClick={() => handleDeleteEvent(event.id)}
              >
                Delete Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;