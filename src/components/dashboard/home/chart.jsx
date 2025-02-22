import React from 'react';
import useDataStore from '../../../services/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HumidTempChart = () => {
  const { humid, temp } = useDataStore((state) => state.data);

  if (!humid.length || !temp.length) {
    return <div>Loading chart data...</div>; 
  }

  const chartData = humid.map((item, index) => ({
    time: new Date(item.time).toLocaleTimeString(),
    humidity: item.humidity,
    temperature: temp[index]?.temperature || null, 
  }));

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Humidity and Temperature over Time
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="humidity" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HumidTempChart;
