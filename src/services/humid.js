import axios from 'axios';

const API_URL = 'http://8.215.20.85/api/v1/get-hum'; 

export const getHumid = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('API Response:', response);

    const sortedData = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
    //const latestHumidity = sortedData[0]?.humidity; 
    //console.log("Sorted data", sortedData);
    //console.log(`Latest Humidity: ${latestHumidity}%`);

    return { humid: sortedData };
  } catch (error) {
    console.error('Error fetching humidity and temperature:', error);
    return { humid: null }
  }
}

