import React, { useEffect, useState } from 'react';
import useDataStore from '../../../services/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HumidTempChart = () => {
  const { humid, temp, weather } = useDataStore((state) => state.data);  
  const fetchWeatherData = useDataStore((state) => state.fetchWeatherData);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();  
  }, [fetchWeatherData]);

  useEffect(() => {
    if (humid.length > 0 && temp.length > 0 && weather && weather.time) {  
      setLoading(false);
    }
  }, [humid, temp, weather]); 

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  // Define a fixed time (e.g., "12:00 PM") for testing
  const fixedTime = '12:00';  


  const combinedData = humid.map((item, index) => {

    const itemTime = new Date(item.time);
    itemTime.setHours(12);  
    itemTime.setMinutes(0);
    itemTime.setSeconds(0);

    const matchingWeather = weather && weather.time 
      ? new Date(weather.time).setHours(12, 0, 0, 0) === itemTime.getTime() 
        ? weather 
        : null 
      : null;

    return {
      time: itemTime,  
      humidityIndoor: item.humidity,  
      temperatureIndoor: temp[index]?.temperature || null,  
      humidityOutdoor: matchingWeather?.humidity || null, 
      temperatureOutdoor: matchingWeather?.temperature || null,  
    };
  });

  combinedData.sort((a, b) => a.time - b.time);

  const chartData = combinedData.map(item => ({
    time: item.time.toLocaleTimeString(),  
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
