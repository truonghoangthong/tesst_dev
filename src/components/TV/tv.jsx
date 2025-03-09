import React, { useEffect } from 'react';
import './tv.css';
import { Icon } from '@iconify/react';  
import useDataStore from '../../services/data';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const getWeatherIcon = (weather) => {
  switch (weather) {
    case 'Clear':
      return <Icon icon="twemoji:sunny" className="weather-icon" />; 
    case 'Cloudy':
      return <Icon icon="twemoji:cloud" className="weather-icon" />;
    case 'Mostly clear':
      return <Icon icon="twemoji:sunny" className="weather-icon" />;
    case 'Partly cloudy':
      return <Icon icon="twemoji:cloud" className="weather-icon" />;
    case 'Light rain':
      return <Icon icon="twemoji:cloud-with-rain" className="weather-icon" />;
    case 'Rain':
      return <Icon icon="twemoji:cloud-with-rain" className="weather-icon" />;
    case 'Thunderstorm':
      return <Icon icon="twemoji:cloud-with-lightning" className="weather-icon" />;
    case 'Light snow':
      return <Icon icon="twemoji:snowflake" className="weather-icon" />;
    case 'Flurries':
      return <Icon icon="twemoji:snowflake" className="weather-icon" />;
    default:
      return <Icon icon="twemoji:sunny" className="weather-icon" />;
  }
};

function getDayAndTime(timestamp) {
  const date = new Date(timestamp);

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  
  const day = daysOfWeek[date.getUTCDay()]; 

  const formattedDate = date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return {
    day: day,             // Monday
    date: formattedDate,  // Full date
    time: formattedTime   // Time in HH:MM format
  };
}

function WeatherSection() {
  const { data, fetchWeatherData } = useDataStore();

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  if (!data.weatherData || data.weatherData.length === 0) {
    return <div>Loading weather data...</div>;
  }

  const latestWeather = data.weatherData[0];
  const dayAndTime = getDayAndTime(latestWeather.time);

  return (
    <div className="weather-section">
      <div className="top-panel">
        {getWeatherIcon(latestWeather.weather)}        
        <h1>
          <span className="temperature">{latestWeather.temperature}</span>
          <span className="temperature-unit">°C</span>
        </h1>
        
        <div className="top-panel-data">
          <p>Feels like: {latestWeather.temperatureApparent}°C</p>
          <p>UV Index: {latestWeather.uvIndex}</p>
          <p>Wind speed: {latestWeather.windSpeed} m/s</p>
        </div>
        
        <div className="top-panel right">
          <h2 className="date">{dayAndTime.date}</h2> 
          <div className="day-time">
            <p className="day">{dayAndTime.day}</p> 
            <p className="time">{dayAndTime.time}</p> 
          </div>
        </div>
      </div>
    </div>
  );
}




const eventsData = [
  { id: 1, title: 'Event 1', content: 'A technology conference will take place at 10 AM on March 20th.' },
  { id: 2, title: 'Event 2', content: 'An art exhibition will be open from 2 PM to 6 PM on March 22nd.' },
  { id: 3, title: 'Event 3', content: 'An outdoor concert will be held on the evening of March 25th.' },
];

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