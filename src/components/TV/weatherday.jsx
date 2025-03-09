import React from 'react';
import getWeatherIcon from '../../services/getWeatherIcon.jsX';
import './weatherday.css'; 

const WeatherDay = ({ day, weather, tempHigh, tempLow }) => {
  const icon = getWeatherIcon(weather);

  return (
    <div className="weather-day-card">
      <p className="day">{day}</p>
      {React.cloneElement(icon, { className: 'day-icon' })}
      <div className="temperature-range">
        <span>{tempHigh}°</span> / <span>{tempLow}°</span>
      </div>
    </div>
  );
};

export default WeatherDay;
