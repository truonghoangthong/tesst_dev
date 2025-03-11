import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { getDayAndTime } from '../../services/getDayandTime';
import useDataStore from '../../services/data';
import WeatherDay from './weatherday';
import getLowHighTempHumid from '../../services/get7days';
import getWeatherIcon from '../../services/getWeatherIcon.jsX';
import { Skeleton } from '@mui/material';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './tv.css';

// Đăng ký các thành phần của Chart.js và plugin datalabels
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Đăng ký plugin datalabels
);

const WeatherSection = ({ updateWeatherBackground }) => {
  const dailyStats = getLowHighTempHumid();
  const { data, fetchWeatherData } = useDataStore();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const weatherData = useMemo(() => data.weatherData || [], [data.weatherData]);

  const roundToNearestHour = () => {
    const currentTime = new Date();
    currentTime.setMinutes(0, 0, 0);
    return currentTime;
  };

  const filteredWeatherData = useMemo(() => {
    const currentDate = new Date().toDateString(); 
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);  
    const nextDayString = nextDay.toDateString(); 
    return weatherData.filter((dataItem) => {
      const dataTime = new Date(dataItem.time);
      const dataDateString = dataTime.toDateString();
      return dataDateString === currentDate || dataDateString === nextDayString;
    });
  }, [weatherData]);

  const filteredDataEvery3Hours = useMemo(() => {
    const currentTime = roundToNearestHour();
    return filteredWeatherData.filter((dataItem) => {
      const dataTime = new Date(dataItem.time).getTime();
      const roundedTime = currentTime.getTime();
      return (dataTime - roundedTime) % (3 * 60 * 60 * 1000) === 0;
    });
  }, [filteredWeatherData]);

  const extendedFilteredData = useMemo(() => {
    const currentTime = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const tomorrowData = filteredWeatherData.filter((dataItem) => {
      const dataTime = new Date(dataItem.time);
      return dataTime > endOfDay;
    });
    return [...filteredDataEvery3Hours, ...tomorrowData];
  }, [filteredDataEvery3Hours, filteredWeatherData]);

  const labelsWithInterval = useMemo(() => {
    return extendedFilteredData.map((dataItem) => getDayAndTime(dataItem.time).time);
  }, [extendedFilteredData]);

  const calculateTemperatureRange = useCallback(() => {
    const temperatureValues = extendedFilteredData.map((dataItem) => dataItem.temperature);
    const maxTemp = Math.max(...temperatureValues);
    const minTemp = Math.min(...temperatureValues);
    return Math.abs(maxTemp - minTemp);
  }, [extendedFilteredData]);

  const calculateHumidityRange = useCallback(() => {
    const humidityValues = extendedFilteredData.map((dataItem) => dataItem.humidity);
    const maxHumidity = Math.max(...humidityValues);
    const minHumidity = Math.min(...humidityValues);
    return Math.abs(maxHumidity - minHumidity);
  }, [extendedFilteredData]);

  const calculateTemperatureYAxisLimits = useCallback(() => {
    const range = calculateTemperatureRange();
    const currentTemperature = extendedFilteredData[0]?.temperature || 0;
    const minY = currentTemperature - (range / 2);
    const maxY = currentTemperature + (range / 2);
    return { minY, maxY };
  }, [extendedFilteredData, calculateTemperatureRange]);

  const calculateHumidityYAxisLimits = useCallback(() => {
    const humidityValues = extendedFilteredData.map((dataItem) => dataItem.humidity);
    const maxHumidity = Math.max(...humidityValues);
    const minHumidity = Math.min(...humidityValues);
    const minY = Math.max(minHumidity - 3, 0);  
    const maxY = Math.min(maxHumidity + 3, 100);  
    return { minY, maxY };
  }, [extendedFilteredData]);

  const { minY: tempMinY, maxY: tempMaxY } = calculateTemperatureYAxisLimits();
  const { minY: humidityMinY, maxY: humidityMaxY } = calculateHumidityYAxisLimits();

  const limitedData = useMemo(() => {
    return extendedFilteredData.slice(0, 15);  
  }, [extendedFilteredData]);

  const temperatureData = useMemo(() => ({
    labels: labelsWithInterval,
    datasets: [{
      label: 'Temperature (°C)',
      data: limitedData.map((dataItem) => dataItem.temperature),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      pointRadius: 5,
      tension: 0.4,
    }],
  }), [labelsWithInterval, limitedData]);
  
  const humidityData = useMemo(() => ({
    labels: labelsWithInterval,
    datasets: [{
      label: 'Humidity (%)',
      data: limitedData.map((dataItem) => dataItem.humidity),
      borderColor: 'rgba(153, 102, 255, 1)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      fill: true,
      pointRadius: 5,
      tension: 0.4,
    }],
  }), [labelsWithInterval, limitedData]);

  const optionsTemperature = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Temperature Data' },
      tooltip: { enabled: false },
      datalabels: {
        color: 'white',
        anchor: 'end',
        align: 'top',
        formatter: (value) => `${value}°C`,
        font: { size: 12, weight: 'bold' },
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 45, 
          minRotation: 30,
          stepSize: 3,
          font: { size: 14, weight: 'bold' },
          color: 'white',
          callback: (value, index) => {
            const date = new Date(extendedFilteredData[index]?.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          },
        },
      },
      y: {
        display: true,
        min: tempMinY - 3,
        max: tempMaxY + 3,
        ticks: { beginAtZero: false, stepSize: 1, color: 'white' },
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'white',
        borderWidth: 2,
        hitRadius: 10,
      },
    },
  }), [tempMinY, tempMaxY, extendedFilteredData]);
  
  const optionsHumidity = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Humidity Data' },
      tooltip: { enabled: false },
      datalabels: {
        color: 'white',
        anchor: 'end',
        align: 'top',
        formatter: (value) => `${value}%`,
        font: { size: 12, weight: 'bold' },
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 45,
          minRotation: 30,
          stepSize: 3,
          font: { size: 14, weight: 'bold' },
          color: 'white',
          callback: (value, index) => {
            const date = new Date(extendedFilteredData[index]?.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          },
        },
      },
      y: {
        display: true,
        min: humidityMinY - 3,
        max: humidityMaxY + 3,
        ticks: { beginAtZero: false, stepSize: 1, color: 'white' },
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
        backgroundColor: 'rgba(153, 102, 255, 1)',
        borderColor: 'white',
        borderWidth: 2,
        hitRadius: 10,
      },
    },
  }), [humidityMinY, humidityMaxY, extendedFilteredData]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const latestWeather = extendedFilteredData[0];

  if (!latestWeather) {
    return <div>Loading weather data...</div>;
  }

  const todaytime = getDayAndTime(latestWeather.time);

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
          <h2 className="date">{todaytime.date}</h2>
          <div className="day-time">
            <p className="day">{todaytime.day}</p>
            <p className="time">{todaytime.time}</p>
          </div>
        </div>
      </div>
      <div className="bottom-panel">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="weather data tabs"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            '& .MuiTabs-indicator': { backgroundColor: 'white' },
          }}
        >
          <Tab label="Temperature" sx={{ color: 'white', '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Humidity" sx={{ color: 'white', '&.Mui-selected': { color: 'white' } }} />
        </Tabs>
        <div className="chart-container">
          {selectedTab === 0 && <Line data={temperatureData} options={optionsTemperature} />}
          {selectedTab === 1 && <Line data={humidityData} options={optionsHumidity} />}
        </div>
      </div>
      <div className="weather-summary">
        {dailyStats.length === 0 ? (
          <p>Loading data...</p>
        ) : (
          dailyStats.map((stat, index) => (
            <WeatherDay
              key={index}
              day={stat.shortDay}
              weather={stat.weather}
              tempHigh={stat.maxTemp}
              tempLow={stat.minTemp}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WeatherSection;