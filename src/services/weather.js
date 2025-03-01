import axios from 'axios';

const getWeatherData = async () => {
  try {
    const response = await axios.get('http://8.215.20.85/info/weather?city=hyrynsalmi');

    if (response.status === 200) {
      const weatherData = response.data;
      console.log('Weather data:', weatherData);
      return {
        temperature: weatherData.temperature,  
        humidity: weatherData.humidity,        
      }; 
    } else {
      console.log('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
  }
};

export default getWeatherData;
