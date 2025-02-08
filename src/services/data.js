import { create } from 'zustand';
import { getHumid } from './humid';
import { getTemp } from './temp';

const useDataStore = create((set, get) => ({
  data: { humid: [], temp: [] },  // Initial state
  fetchData: async () => {
    try {
      const humidity = await getHumid();
      const temperature = await getTemp();

      const sortedHumid = humidity.humid.sort((a, b) => new Date(b.time) - new Date(a.time));
      const sortedTemp = temperature.temp.sort((a, b) => new Date(b.time) - new Date(a.time));

      set({
        data: {
          humid: sortedHumid,  
          temp: sortedTemp,    
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  startFetching: () => {
    const { fetchData } = get();
    fetchData();
    setInterval(fetchData, 30000);
  },
}));

export default useDataStore;
