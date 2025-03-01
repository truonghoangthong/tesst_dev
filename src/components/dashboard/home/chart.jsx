import React, { useEffect } from 'react';
import useDataStore from '../../../services/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HumidTempChart = () => {
  const { humid, temp, weather } = useDataStore((state) => state.data);
  const startWeatherUpdateInterval = useDataStore((state) => state.startWeatherUpdateInterval);

  useEffect(() => {
    startWeatherUpdateInterval(); 
  }, [startWeatherUpdateInterval]);

  if (!humid.length || !temp.length || !weather) {
    return <div>Loading chart data...</div>; 
  }

  const combinedData = humid.map((item, index) => ({
    time: new Date(item.time),
    humidityIndoor: item.humidity,
    temperatureIndoor: temp[index]?.temperature || null,
    humidityOutdoor: weather?.humidity || null,  
    temperatureOutdoor: weather?.temperature || null,  
  }));

  combinedData.sort((a, b) => a.time - b.time);

  const chartData = combinedData.map(item => ({
    time: item.time.toLocaleDateString(),
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
          {/* Line cho dữ liệu trong phòng */}
          <Line type="monotone" dataKey="humidityIndoor" stroke="#8884d8" activeDot={{ r: 8 }} name="Humidity (Indoor)" />
          <Line type="monotone" dataKey="temperatureIndoor" stroke="#82ca9d" name="Temperature (Indoor)" />
          {/* Line cho dữ liệu ngoài trời */}
          <Line type="monotone" dataKey="humidityOutdoor" stroke="#ff7300" name="Humidity (Outdoor)" />
          <Line type="monotone" dataKey="temperatureOutdoor" stroke="#387908" name="Temperature (Outdoor)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HumidTempChart;
