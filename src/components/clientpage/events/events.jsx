import React, { useState } from "react";
import "./events.css"; 

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); 
  const [content, setContent] = useState(""); 

  const handleAddEvent = (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please enter a title and content for the event!");
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
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="events-page">
      <h1>Add Event</h1>
      <form onSubmit={handleAddEvent} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image (optional):</label>
          <input
            type="file"
            id="image"
            accept="image/*" 
            onChange={handleImageChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter event content"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Event
        </button>
      </form>

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
              <p className="event-content">{event.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;