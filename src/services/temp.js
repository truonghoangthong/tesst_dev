import axios from 'axios';

const API_URL = 'http://8.215.20.85/api/v1/get-tem'; 

export const getTemp = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('API Response:', response);
    
    const sortedData = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
    const latestTemperature = sortedData[0]?.temperature; 
    console.log(`Latest Temperature: ${latestTemperature}°C`);

    return { temp: latestTemperature };
  } catch (error) {
    console.error('Error fetching humidity and temperature:', error);
    return { temp: null }
  }
}

