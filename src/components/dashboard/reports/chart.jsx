import React, { useEffect, useState } from 'react';
import useDataStore from '../../../services/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HumidTempChart = () => {
  const { humid, temp, weatherData } = useDataStore((state) => state.data);  
  const fetchWeatherData = useDataStore((state) => state.fetchWeatherData);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (humid.length > 0 && temp.length > 0 && weatherData.length > 0) {  
      setLoading(false);
    }
  }, [humid, temp, weatherData]); 

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  // Filter data by specific hours (e.g., 1h, 2h, etc.)
  const filterDataByHour = (hour) => {
    return humid.map((item, index) => {
      const itemTime = new Date(item.time);
      if (itemTime.getHours() === hour) {
        const matchingWeather = weatherData.find(weather => {
          const weatherTime = new Date(weather.time);
          return weatherTime.getTime() === itemTime.getTime();
        });

        return {
          time: itemTime,  
          humidityIndoor: item.humidity,  
          temperatureIndoor: temp[index]?.temperature || null,  
          humidityOutdoor: matchingWeather?.humidity || null,  
          temperatureOutdoor: matchingWeather?.temperature || null,  
        };
      }
      return null;
    }).filter(item => item !== null);  
  };

  const selectedHours = [1, 2, 3]; 

  let filteredData = [];
  selectedHours.forEach(hour => {
    filteredData = filteredData.concat(filterDataByHour(hour));
  });

  filteredData.sort((a, b) => a.time - b.time);

  const chartData = filteredData.map(item => ({
    time: item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
    humidityIndoor: item.humidityIndoor,
    temperatureIndoor: item.temperatureIndoor,
    humidityOutdoor: item.humidityOutdoor,
    temperatureOutdoor: item.temperatureOutdoor,
  }));

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Humidity and Temperature Comparison (Indoor vs Outdoor)
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="humidityIndoor" stroke="#8884d8" activeDot={{ r: 8 }} name="Humidity (Indoor)" />
          <Line type="monotone" dataKey="temperatureIndoor" stroke="#82ca9d" name="Temperature (Indoor)" />
          <Line type="monotone" dataKey="humidityOutdoor" stroke="#ff7300" name="Humidity (Outdoor)" />
          <Line type="monotone" dataKey="temperatureOutdoor" stroke="#387908" name="Temperature (Outdoor)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HumidTempChart;
