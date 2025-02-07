import React from 'react';
import { useDataStore } from '../../state/dataStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const { humid, temp } = useDataStore((state) => state.data);  

  // Combine the humidity and temperature data into one array for chart
  const mergedData = humid.map((h, index) => ({
    time: h.time,  // Assuming both humidity and temperature data have a 'time' field
    humidity: h.value,
    temperature: temp[index]?.value || null,
  }));

  return (
    <div>
      <h1>Reports</h1>
      {humid.length > 0 && temp.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="humidity" stroke="#8884d8" />
            <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Reports;
