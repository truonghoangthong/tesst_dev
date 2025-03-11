import { create } from 'zustand';
import { getHumid } from './humid';
import { getTemp } from './temp';
import getWeatherData from './weather'; 

const useDataStore = create((set) => {
  let weatherIntervalId = null;

  return {
    data: { humid: [], temp: [], weatherData: [] },

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
        await getWeatherData((data) => {
          if (data.weatherData) {
            set((state) => ({
              data: {
                ...state.data,
                weatherData: data.weatherData, 
              },
            }));
            console.log('Weather data successfully set in the store:', data.weatherData);
          } else {
            console.log('Invalid weather data received:', data);
          }
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    },

    startWeatherDataInterval: () => {
      if (!weatherIntervalId) {
        weatherIntervalId = setInterval(() => {
          console.log('Fetching weather data automatically...');
          useDataStore.getState().fetchWeatherData();
        }, 30 * 60 * 1000); // 30 minutes 
      }
    },
  };
});

export default useDataStore;
