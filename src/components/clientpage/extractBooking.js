export const extractBookings = (gridData) => {
  const bookings = [];

  gridData.forEach((row, rowIndex) => {
    Object.keys(row).forEach((day) => {
      if (day !== 'time' && row[day] === 'Booked') {
        const from = row.time;  

        const to = rowIndex === gridData.length - 1 ? '22:00' : gridData[rowIndex + 1].time;  

        bookings.push({
          guestName: 'Tên khách hàng',  
          from,                         
          to,                            
          day: day.charAt(0).toUpperCase() + day.slice(1), 
        });
      }
    });
  });

  return bookings;
};
