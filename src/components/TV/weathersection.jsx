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
import './tv.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const WeatherSection = ({ updateWeatherBackground }) => {
  const dailyStats = getLowHighTempHumid();
  const { data, fetchWeatherData } = useDataStore();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (data.weatherData.length === 0) {
      fetchWeatherData();
    }
  }, [data.weatherData, fetchWeatherData]);

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
    const range = calculateHumidityRange();
    const currentHumidity = extendedFilteredData[0]?.humidity || 0;
    const minY = currentHumidity - (range / 2);
    const maxY = currentHumidity + (range / 2);
    return { minY, maxY };
  }, [extendedFilteredData, calculateHumidityRange]);

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
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}°C`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 45, 
          minRotation: 30,
          stepSize: 3,  
          font: {
            size: 14,  
            weight: 'bold',  
          },
          callback: (value, index) => {
            return index % 2 === 0 ? value : ''; 
          },
        },
      },
      y: {
        display: true,
        min: tempMinY - 3,
        max: tempMaxY + 3,
        ticks: { beginAtZero: false, stepSize: 1 },
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
        draw: function (chart) {
          const ctx = chart.ctx;
          const chartData = chart.data;
          const dataset = chartData.datasets[chart.datasetIndex];
          const meta = chart.getDatasetMeta(chart.datasetIndex);
  
          meta.data.forEach((point, index) => {
            const value = dataset.data[index]; 
            const x = point.x;
            const y = point.y;
  
            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(`${value}°C`, x, y - 10); 
          });
        },
      },
    },
  }), [tempMinY, tempMaxY]);
  
  const optionsHumidity = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Humidity Data' },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}%`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 45,
          minRotation: 30,
          stepSize: 3, 
          font: {
            size: 14,  
            weight: 'bold',  
          },
          callback: (value, index) => {
            return index % 2 === 0 ? value : ''; 
          },
        },
      },
      y: {
        display: true,
        min: humidityMinY - 3,
        max: humidityMaxY + 3,
        ticks: { beginAtZero: false, stepSize: 1 },
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
        draw: function (chart) {
          const ctx = chart.ctx;
          const chartData = chart.data;
          const dataset = chartData.datasets[chart.datasetIndex];
          const meta = chart.getDatasetMeta(chart.datasetIndex);
  
          meta.data.forEach((point, index) => {
            const value = dataset.data[index]; 
            const x = point.x;
            const y = point.y;
  
            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(`${value}%`, x, y - 10);
          });
        },
      },
    },
  }), [humidityMinY, humidityMaxY]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const latestWeather = extendedFilteredData[0];

  if (!latestWeather) {
    return <div>Loading weather data...</div>;
  }

  useEffect(() => {
    if (latestWeather) {
      updateWeatherBackground(latestWeather.weather);  
    }
  }, [latestWeather, updateWeatherBackground]);

  const todaytime = getDayAndTime(latestWeather.time);

  return (
    <div className="weather-section">
      <Tabs value={selectedTab} onChange={handleChange} centered>
        <Tab label="Temperature" />
        <Tab label="Humidity" />
      </Tabs>
      <div className="tab-content">
        {selectedTab === 0 && (
          <div>
            <h2>Temperature: {todaytime.time}</h2>
            <Line data={temperatureData} options={optionsTemperature} />
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            <h2>Humidity: {todaytime.time}</h2>
            <Line data={humidityData} options={optionsHumidity} />
          </div>
        )}
      </div>
      <WeatherDay weatherData={latestWeather} />
    </div>
  );
};

export default WeatherSection;
