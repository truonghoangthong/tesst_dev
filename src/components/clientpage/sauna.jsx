import React, { useEffect, useRef, useState } from 'react';
import Grid from 'tui-grid';
import 'tui-grid/dist/tui-grid.css';
import './sauna.css'; 

const BookingGrid = () => {
  const gridRef = useRef(null);  
  const [gridData, setGridData] = useState([
    { time: '08:00', monday: 'Available', tuesday: 'Available', wednesday: 'Available', thursday: 'Available', friday: 'Available', saturday: 'Available', sunday: 'Available' },
    { time: '09:00', monday: 'Booked', tuesday: 'Available', wednesday: 'Available', thursday: 'Booked', friday: 'Available', saturday: 'Available', sunday: 'Available' },
    { time: '10:00', monday: 'Available', tuesday: 'Booked', wednesday: 'Available', thursday: 'Available', friday: 'Booked', saturday: 'Available', sunday: 'Available' },
    // Thêm dữ liệu nếu cần
  ]);

  useEffect(() => {
    if (!gridRef.current) {
      gridRef.current = new Grid({
        el: document.getElementById('grid'),
        data: gridData,
        columns: [
          { header: 'Time', name: 'time', width: 100 },
          { header: 'Monday', name: 'monday', editor: 'text', align: 'center' },
          { header: 'Tuesday', name: 'tuesday', editor: 'text', align: 'center' },
          { header: 'Wednesday', name: 'wednesday', editor: 'text', align: 'center' },
          { header: 'Thursday', name: 'thursday', editor: 'text', align: 'center' },
          { header: 'Friday', name: 'friday', editor: 'text', align: 'center' },
          { header: 'Saturday', name: 'saturday', editor: 'text', align: 'center' },
          { header: 'Sunday', name: 'sunday', editor: 'text', align: 'center' },
        ],
        rowHeaders: ['rowNum'],
        bodyHeight: 400,
      });

      console.log('Grid initialized', gridRef.current);  
    } else {
      console.log('Grid is already initialized:', gridRef.current);

      if (gridRef.current.resetData) {
        gridRef.current.resetData(gridData); 
      } else {
        console.warn('TUI Grid method resetData is not available');
      }
    }

    const handleClick = (ev) => {
      if (ev.columnName !== 'time') {
        const value = gridRef.current.getValue(ev.rowKey, ev.columnName);
        const newValue = value === 'Available' ? 'Booked' : 'Available';
        gridRef.current.setValue(ev.rowKey, ev.columnName, newValue);

        const updatedData = [...gridData];
        updatedData[ev.rowKey][ev.columnName] = newValue;
        setGridData(updatedData);

        localStorage.setItem('bookingData', JSON.stringify(updatedData));
      }
    };

    if (gridRef.current) {
      gridRef.current.on('click', handleClick);
    }

    return () => {
      if (gridRef.current) {
        gridRef.current.off('click', handleClick);
      }
    };
  }, [gridData]);  

  return (
    <div className="sauna-container">
      <div className="sauna-header">
        <h2>Booking Grid</h2>
      </div>
      <div id="grid" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default BookingGrid;
