import { create } from 'zustand';
import { getHumid } from './humid'; 
import { getTemp } from './temp'; 

//error, file return latest value, not array
export const useDataStore = create((set) => ({
  data: { humid: [], temp: [] }, 
  fetchHumidity: async () => {
    try {
      const humidityData = await getHumid();
      set((state) => ({ data: { ...state.data, humid: humidityData } })); 
    } catch (error) {
      console.error('Error fetching humidity data:', error);
    }
  },
  fetchTemperature: async () => {
    try {
      const temperatureData = await getTemp();
      set((state) => ({ data: { ...state.data, temp: temperatureData } })); 
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    }
  },
}));
