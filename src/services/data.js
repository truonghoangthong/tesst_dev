import { create } from 'zustand';
import { getHumid } from './humid';
import { getTemp } from './temp';

const useDataStore = create((set) => ({
  data: { humid: [], temp: [] }, 

  fetchHumidityStream: () => {
    getHumid((data) => {
      if (data.humid) {
        set((state) => ({
          data: {
            ...state.data,
            humid: data.humid, 
          },
        }));
      }
    });
  },

  fetchTemperatureStream: () => {
    getTemp((data) => {
      if (data.temp) {
        set((state) => ({
          data: {
            ...state.data,
            temp: data.temp, 
          },
        }));
      }
    });
  },
}));

export default useDataStore;
