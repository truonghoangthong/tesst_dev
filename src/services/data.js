import { create } from 'zustand';
import { getHumid } from './humid';
import { getTemp } from './temp';
import getWeatherData from './weather';

const useDataStore = create((set) => ({
  data: { humid: [], temp: [], weather: null },  

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

  fetchWeatherData: async () => {
    try {
      const weatherData = await getWeatherData(); 
      set((state) => ({
        data: {
          ...state.data,
          weather: weatherData,  
        },
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  },

  startWeatherUpdateInterval: () => {
    setInterval(async () => {
      console.log('Fetching weather data...');
      await useDataStore.getState().fetchWeatherData();
    }, 30 * 60 * 1000);  // 30 phút
  },
}));

export default useDataStore;
