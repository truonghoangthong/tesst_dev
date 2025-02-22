import { create } from 'zustand';
import { getHumid } from './humid';
import { getTemp } from './temp';

const useDataStore = create((set, get) => ({
  data: { humid: [], temp: [] },  
  fetchData: async () => {
    try {
      const humidity = await getHumid();
      const temperature = await getTemp();

      const humidityData = typeof humidity === 'string' ? JSON.parse(humidity) : humidity;
      const temperatureData = typeof temperature === 'string' ? JSON.parse(temperature) : temperature;

      const sortedHumid = humidityData.humid.sort((a, b) => new Date(b.time) - new Date(a.time));
      const sortedTemp = temperatureData.temp.sort((a, b) => new Date(b.time) - new Date(a.time));

      set({
        data: {
          humid: sortedHumid,  
          temp: sortedTemp,    
        },
      });
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
    }
  },
  startFetching: () => {
    const { fetchData } = get();
    fetchData();
    setInterval(fetchData, 30000);
  },
}));

export default useDataStore;
