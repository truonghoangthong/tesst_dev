import React, { useState, useEffect } from 'react';
import './tv.css';
import { WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiThermometer, WiHumidity, WiStrongWind, WiBarometer, WiTime9 } from 'react-icons/wi'; 
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // To display expand/collapse icon

const generateFakeWeatherData = () => {
  return {
    temperature: (Math.random() * 15 + 10).toFixed(1), // Temperature from 10 to 25 °C
    humidity: Math.floor(Math.random() * 50 + 50),     // Humidity from 50% to 100%
    windSpeed: (Math.random() * 20).toFixed(1),        // Wind speed from 0 to 20 km/h
    temperatureApparent: (Math.random() * 15 + 10).toFixed(1), // Apparent temp from 10 to 25 °C
    weather: ['Clear', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)], // Random weather condition
    uvIndex: Math.floor(Math.random() * 11),           // UV index from 0 to 10
    time: new Date().toLocaleTimeString(),             // Current time
  };
};

const getWeatherIcon = (weather) => {
  switch (weather) {
    case 'Clear':
      return <WiDaySunny size={50} />;
    case 'Cloudy':
      return <WiCloud size={50} />;
    case 'Rainy':
      return <WiRain size={50} />;
    case 'Stormy':
      return <WiThunderstorm size={50} />;
    default:
      return <WiDaySunny size={50} />;
  }
};

const eventsData = [
  { id: 1, title: 'Event 1', content: 'A technology conference will take place at 10 AM on March 20th.' },
  { id: 2, title: 'Event 2', content: 'An art exhibition will be open from 2 PM to 6 PM on March 22nd.' },
  { id: 3, title: 'Event 3', content: 'An outdoor concert will be held on the evening of March 25th.' },
];

function WeatherSection() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchFakeWeatherData = () => {
      const fakeData = generateFakeWeatherData();
      setWeatherData(fakeData);
    };

    fetchFakeWeatherData();
    const interval = setInterval(fetchFakeWeatherData, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div className="weather-section">
      <h2>Weather</h2>
      {getWeatherIcon(weatherData.weather)}
      <div className="weather-info">
        <div className="weather-details">
          <p><WiThermometer size={30} /> <strong>Temperature:</strong> {weatherData.temperature}°C</p>
          <p><WiThermometer size={30} /> <strong>Apparent Temperature:</strong> {weatherData.temperatureApparent}°C</p>
          <p><WiHumidity size={30} /> <strong>Humidity:</strong> {weatherData.humidity}%</p>
          <p><WiStrongWind size={30} /> <strong>Wind Speed:</strong> {weatherData.windSpeed} km/h</p>
          <p><WiBarometer size={30} /> <strong>UV Index:</strong> {weatherData.uvIndex}</p>
          <p><WiTime9 size={30} /> <strong>Time:</strong> {weatherData.time}</p>
        </div>
      </div>
    </div>
  );
}

function EventsTabs() {
  return (
    <div className="events-tabs">
      {eventsData.map(event => (
        <Accordion key={event.id} disableGutters elevation={0} square>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${event.id}-content`}
            id={`panel${event.id}-header`}
          >
            <Typography>{event.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{event.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

function TvView() {
  return (
    <div className="tv-app">
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

