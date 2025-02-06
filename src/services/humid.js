import axios from 'axios';

//const API_URL = 'http://8.215.20.85/api/v1/get-tem-hum'; 

export const getHumidTemp = async () => {
  try {
    const response = await axios.get(API_URL);
    const humid = response.data.humidity;
    const temp  =response.data.temperature;
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

