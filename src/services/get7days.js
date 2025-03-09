import { useMemo } from 'react';
import useDataStore from './data'; // Import store dữ liệu
import { getDayAndTime } from './getDayandTime'; // Import hàm getDayAndTime

const getLowHighTempHumid = () => {
  const { data } = useDataStore(); // Lấy dữ liệu từ store
  const weatherData = data.weatherData || []; // Dữ liệu thời tiết

  const get7DaysData = useMemo(() => {
    const currentDate = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date();
      targetDate.setDate(currentDate.getDate() + i); // Lấy ngày hôm nay và 6 ngày tiếp theo
      days.push(targetDate.toDateString()); // Định dạng ngày để so sánh
    }

    return weatherData.filter((dataItem) => {
      const dataTime = new Date(dataItem.time);
      return days.includes(dataTime.toDateString());
    });
  }, [weatherData]);

  // Hàm tính toán nhiệt độ min, max và độ ẩm min, max cho mỗi ngày
  const calculateMinMax = useMemo(() => {
    const dailyStats = [];

    // Duyệt qua các ngày trong tuần để tính toán min, max
    get7DaysData.forEach((dataItem) => {
      const dayDate = new Date(dataItem.time).toDateString(); // Lấy ngày của item

      // Tìm trong dailyStats xem ngày này đã có chưa
      let dayStats = dailyStats.find((stat) => stat.date === dayDate);

      if (!dayStats) {
        // Nếu chưa có, tạo object mới cho ngày đó
        dayStats = { 
          date: dayDate, 
          minTemp: Infinity, 
          maxTemp: -Infinity, 
          minHumidity: Infinity, 
          maxHumidity: -Infinity,
          weather: dataItem.weather, // Thêm trường weather
          shortDay: getDayAndTime(dayDate).shortDay, // Thêm trường shortDay
        };
        dailyStats.push(dayStats);
      }

      // Cập nhật min và max temperature
      dayStats.minTemp = Math.min(dayStats.minTemp, dataItem.temperature);
      dayStats.maxTemp = Math.max(dayStats.maxTemp, dataItem.temperature);

      // Cập nhật min và max humidity
      dayStats.minHumidity = Math.min(dayStats.minHumidity, dataItem.humidity);
      dayStats.maxHumidity = Math.max(dayStats.maxHumidity, dataItem.humidity);
    });

    return dailyStats;
  }, [get7DaysData]);

  return calculateMinMax;
};

export default getLowHighTempHumid;
