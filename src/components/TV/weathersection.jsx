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
    scales: {
      y: {
        min: tempMinY - 3,
        max: tempMaxY + 3,
      },
    },
  }), [tempMinY, tempMaxY]);

  const optionsHumidity = useMemo(() => ({
    responsive: true,
    scales: {
      y: {
        min: humidityMinY - 3,
        max: humidityMaxY + 3,
      },
    },
  }), [humidityMinY, humidityMaxY]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const latestWeather = extendedFilteredData[0];

  useEffect(() => {
    if (latestWeather) {
      updateWeatherBackground(latestWeather.weather);
    }
  }, [latestWeather, updateWeatherBackground]);

  const todaytime = getDayAndTime(latestWeather?.time);

  return (
    <div className="weather-section">
      <div className="top-panel">
        {latestWeather ? getWeatherIcon(latestWeather.weather) : <Skeleton variant="circle" width={40} height={40} />}
        <h1>
          <span className="temperature">{latestWeather ? latestWeather.temperature : <Skeleton width={50} />}</span>
          <span className="temperature-unit">°C</span>
        </h1>
        <h2 className="weather-description">{latestWeather ? latestWeather.weather : <Skeleton width={100} />}</h2>
        <p className="weather-summary">
          {todaytime ? `${todaytime.time}, ${todaytime.date}` : <Skeleton width={150} />}
        </p>
      </div>
      <div className="bottom-panel">
        <Tabs value={selectedTab} onChange={handleChange}>
          <Tab label="Temperature" />
          <Tab label="Humidity" />
        </Tabs>
        <div>
          {selectedTab === 0 && (
            <Line data={temperatureData} options={optionsTemperature} />
          )}
          {selectedTab === 1 && (
            <Line data={humidityData} options={optionsHumidity} />
          )}
        </div>
      </div>
      <div className="weather-summary">
        <WeatherDay
          weatherData={extendedFilteredData}
          labels={labelsWithInterval}
          humidityRange={calculateHumidityRange()}
          temperatureRange={calculateTemperatureRange()}
        />
      </div>
    </div>
  );
};

export default WeatherSection;
