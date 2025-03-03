import axios from 'axios';

const getWeatherData = async (callback) => {
  try {
    const response = await axios.get('http://8.215.20.85/info/weather?city=hyrynsalmi');
    const weatherData = response.data;

    console.log('Weather data received:', weatherData);

    if (weatherData.temperature && weatherData.humidity) {
      callback({
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        temperatureApparent: weatherData.temperatureApparent,
        weatherCondition: weatherData.weather,
        uvIndex: weatherData.uvIndex,
        time: weatherData.time,
      });
    } else {
      callback({ weather: null });
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    callback({ weather: null });
  }
};

// Default export
export default getWeatherData;
