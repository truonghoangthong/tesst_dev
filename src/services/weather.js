import axios from 'axios';

const getWeatherData = async (callback) => {
  try {
    const response = await axios.get('http://8.215.20.85/info/weather?city=hyrynsalmi');
    
    // Access the 'newContent' array from the response
    const weatherDataArray = response.data.newContent;

    console.log('Weather data array received:', weatherDataArray);

    if (Array.isArray(weatherDataArray) && weatherDataArray.length > 0) {
      callback({
        weatherData: weatherDataArray, // Pass the array of weather data
      });
    } else {
      callback({ weatherData: null });
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    callback({ weatherData: null });
  }
};

export default getWeatherData;
