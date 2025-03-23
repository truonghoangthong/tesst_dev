import axios from 'axios';

const getTemperatureRange = async (callback) => {
  try {
    const response = await axios.get('http://8.215.20.85/info/temperature-range?city=hyrynsalmi');
    const temperatureRangeData = response.data;

    console.log('Temperature range data received:', temperatureRangeData);

    if (temperatureRangeData) {
      callback(temperatureRangeData);
    } else {
      callback(null);
    }
  } catch (error) {
    console.error('Error fetching temperature range data:', error);
    callback(null);
  }
};

export default getTemperatureRange;