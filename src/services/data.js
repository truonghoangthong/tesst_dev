import { create } from 'zustand';
import { getHumid } from './humid'; 
import { getTemp } from './temp'; 

export const useDataStore = create((set) => ({
  data: { humid: [], temp: [] },  // Default empty arrays
  fetchHumidity: async () => {
    try {
      const humidity = await getHumid();  
      console.log('Sorted Humidity Data:', humidity.humid);

      set((state) => ({ 
        data: { 
          ...state.data, 
          humid: humidity.humid  
        } 
      }));
    } catch (error) {
      console.error('Error fetching humidity data:', error);
    }
  },
  fetchTemperature: async () => {
    try {
      const temperature = await getTemp();  
      console.log('Sorted Temperature Data:', temperature.temp);
      set((state) => ({ 
        data: { 
          ...state.data, 
          temp: temperature.temp  
        } 
      }));
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    }
  },
}));
