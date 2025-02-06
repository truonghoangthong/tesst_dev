import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';  

const localizer = momentLocalizer(moment);
const myEventsList = [
  {
    title: 'Meeting in Room A',
    start: new Date(),
    end: new Date(moment().add(1, 'hours').toDate()),
    allDay: false,
    room: 'A',  
  },
  {
    title: 'Lunch in Room B',
    start: new Date(moment().add(1, 'days').toDate()),
    end: new Date(moment().add(1, 'days').add(1, 'hours').toDate()),
    allDay: false,
    room: 'B',  
  },
  {
    title: 'Conference in Room A',
    start: new Date(moment().add(2, 'days').toDate()),
    end: new Date(moment().add(2, 'days').add(2, 'hours').toDate()),
    allDay: false,
    room: 'A',  
  },
];

const MyCalendar = (props) => {
  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    
    if (event.room === 'A') {
      backgroundColor = '#ff4d4d';  //Red for Room A
    } else if (event.room === 'B') {
      backgroundColor = '#4d79ff';  //Blue for Room B
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: '100%' }}
        eventPropGetter={eventStyleGetter}  //Apply the event styles dynamically
      />
    </div>
  );
};

export default MyCalendar;
