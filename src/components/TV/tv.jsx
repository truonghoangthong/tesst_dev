import React, { useState, useEffect } from 'react';  
import useDataStore from "../../services/data"
import './tv.css';

const eventsData = [
  { id: 1, title: 'Event 1', content: 'A technology conference will take place at 10 AM on March 20th.' },
  { id: 2, title: 'Event 2', content: 'An art exhibition will be open from 2 PM to 6 PM on March 22nd.' },
  { id: 3, title: 'Event 3', content: 'An outdoor concert will be held on the evening of March 25th.' },
];

function EventsTabs() {
  const [expandedEventId, setExpandedEventId] = useState(null);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setExpandedEventId(eventsData[currentIndex].id); 
      currentIndex = (currentIndex + 1) % eventsData.length;

    }, 5000); 

    return () => clearInterval(interval); 
  }, []); 

  const handleClick = (id) => {
    setExpandedEventId(expandedEventId === id ? null : id); 
  };

  return (
    <div className="events-tabs">
      {eventsData.map(event => (
        <div key={event.id} className="event-item">
          <div
            className={`event-title ${expandedEventId === event.id ? 'active' : ''}`}
            onClick={() => handleClick(event.id)}
          >
            {event.title}
          </div>
          <div className={`event-content ${expandedEventId === event.id ? 'active' : ''}`}>
            {event.content}
          </div>
        </div>
      ))}
    </div>
  );
}

function WeatherSection() {
  const { fetchWeatherData, data } = useDataStore();
  const weather = data.weather;

  useEffect(() => {
    fetchWeatherData();  
  }, [fetchWeatherData]);

  if (!weather) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div className="weather-section">
      <h2>Weather</h2>
      <p><strong>Temperature:</strong> {weather.temperature}°C</p>
      <p><strong>Humidity:</strong> {weather.humidity}%</p>
      <p><strong>Wind Speed:</strong> {weather.windSpeed} km/h</p>
      <p><strong>Weather Condition:</strong> {weather.weatherCondition}</p>
    </div>
  );
}

function TvView() {
  return (
    <div className="app">
      <div className="left-panel">
        <WeatherSection />
      </div>
      <div className="right-panel">
        <h2>Events</h2>
        <EventsTabs />
      </div>
    </div>
  );
}

export default TvView;
