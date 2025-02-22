import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';  

const localizer = momentLocalizer(moment);

const flatBookingEvents = [
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

const facilitiesEvents = [
  {
    title: 'Sauna Session',
    start: new Date(moment().add(1, 'days').toDate()),
    end: new Date(moment().add(1, 'days').add(2, 'hours').toDate()),
    allDay: false,
    room: 'Sauna',
  },
  {
    title: 'Laundry Service',
    start: new Date(moment().add(2, 'days').toDate()),
    end: new Date(moment().add(2, 'days').add(3, 'hours').toDate()),
    allDay: false,
    room: 'Laundry',
  },
];

const MyCalendar = ({ calendarType }) => {
  const events = calendarType === 'flat' ? flatBookingEvents : facilitiesEvents;

  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    if (calendarType === 'flat') {
      if (event.room === 'A') backgroundColor = '#ff4d4d';
      else if (event.room === 'B') backgroundColor = '#4d79ff';
    } else if (calendarType === 'facilities') {
      if (event.room === 'Sauna') backgroundColor = '#ffcc00';
      else if (event.room === 'Laundry') backgroundColor = '#66cc66';
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
    <div style={{ padding: '5px' }}>
      <h2>{calendarType === 'flat' ? 'Flat Booking Calendar' : 'Facilities Calendar (Sauna & Laundry)'}</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: '100%' }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default MyCalendar;
