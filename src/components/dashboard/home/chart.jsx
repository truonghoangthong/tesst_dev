import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDataStore } from '../../../services/data';  

const Chart = () => {
  const { data, fetchHumidity, fetchTemperature } = useDataStore(); 
  const { humid, temp } = data;
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchHumidity();  
        await fetchTemperature();  
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); 
      }
    };
    fetchData();
  }, [fetchHumidity, fetchTemperature]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (!Array.isArray(humid) || !Array.isArray(temp) || humid.length === 0 || temp.length === 0) {
    return <div>No data available</div>;
  }

  const formatTime = (timeStr) => {
    return timeStr.slice(0, 16); 
  };

  const combinedData = humid.map((humidityItem) => {
    const formattedHumidityTime = formatTime(humidityItem.time);
    const tempItem = temp.find((tempItem) => formatTime(tempItem.time) === formattedHumidityTime);
    return tempItem && !isNaN(humidityItem.humidity) && !isNaN(tempItem.temperature)
      ? { 
          time: humidityItem.time, 
          humidity: humidityItem.humidity, 
          temperature: tempItem.temperature 
        }
      : null;
  }).filter(item => item !== null); 

  if (combinedData.length === 0) {
    console.log("Combined data is empty:", combinedData);
    return <div>No matching data available for both humidity and temperature</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={combinedData} margin={{ top: 60, right: 30, left: 140, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          tickFormatter={(timeStr) => new Date(timeStr).toLocaleString()}  
        />
        
        {/* Left Y-axis for Humidity */}
        <YAxis 
          yAxisId="left" 
          orientation="left" 
          label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }}
        />
        
        {/* Right Y-axis for Temperature */}
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight' }} 
        />
        
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
        <Legend />
        
        {/* Line for Humidity */}
        <Line 
          type="monotone" 
          dataKey="humidity" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
          name="Humidity"
          yAxisId="left"  // Bind to the left Y-axis
        />
        
        {/* Line for Temperature */}
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#82ca9d" 
          activeDot={{ r: 8 }} 
          name="Temperature"
          yAxisId="right"  // Bind to the right Y-axis
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
