import axios from 'axios';

const API_URL = 'https://api.example.com/weather'; 

export const getHumidTemp = async () => {
  try {
    const response = await axios.get(API_URL);
    const humid = response.data.humidity;
    const temp  =response.data.temp;
    console.log(`Humidity: ${humid}%`);
    console.log(`Temperature: ${temp}°C`);
    return {
      humid, temp
    }
  } catch (error) {
    console.error('Error fetching humidity and temperature:', error);
    return {humid: null, temp: null}
  }
}

