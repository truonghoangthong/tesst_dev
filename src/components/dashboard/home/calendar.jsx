import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useRoomBookingStore from '../../../../../Backend/src/store/roomBookingStore';
import useLaundryBookingStore from '../../../../../Backend/src/store/laundryBookingStore';
import useSaunaBookingStore from '../../../../../Backend/src/store/saunaBookingStore';
import './calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ calendarType }) => {
  const { laundryBookings, fetchLaundryBookings } = useLaundryBookingStore();
  const { saunaBookings, fetchSaunaBookings } = useSaunaBookingStore();
  const { roomBookings, fetchRoomBookings } = useRoomBookingStore();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchLaundryBookings();
    fetchSaunaBookings();
    fetchRoomBookings();
  }, [fetchLaundryBookings, fetchSaunaBookings, fetchRoomBookings]);

  useEffect(() => {
    const formattedEvents = [];

    if (calendarType === 'flat') {
      roomBookings.forEach((booking) => {
        formattedEvents.push({
          title: `Room Booking - ${booking.room}`,
          start: booking.bookingPeriod.startFrom.toDate(),
          end: booking.bookingPeriod.endAt.toDate(),
          allDay: false,
          room: booking.room,
        });
      });
    } else if (calendarType === 'facilities') {
      laundryBookings.forEach((booking) => {
        const startTime = moment(booking.bookingPeriod.startFrom.toDate()).format('HH:mm');
        formattedEvents.push({
          title: `${startTime} Laundry`, 
          start: booking.bookingPeriod.startFrom.toDate(),
          end: booking.bookingPeriod.endAt.toDate(),
          allDay: false,
          room: 'Laundry',
        });
      });

      saunaBookings.forEach((booking) => {
        const startTime = moment(booking.bookingPeriod.startFrom.toDate()).format('HH:mm');
        formattedEvents.push({
          title: `${startTime} Sauna`, 
          start: booking.bookingPeriod.startFrom.toDate(),
          end: booking.bookingPeriod.endAt.toDate(),
          allDay: false,
          room: 'Sauna',
        });
      });
    }

    setEvents(formattedEvents);
  }, [calendarType, laundryBookings, saunaBookings, roomBookings]);

  const eventStyleGetter = (event) => {
    let className = 'calendar-event';
    if (calendarType === 'flat') {
      if (event.room === 'A') className += ' calendar-event-room-a';
      else if (event.room === 'B') className += ' calendar-event-room-b';
    } else if (calendarType === 'facilities') {
      if (event.room === 'Sauna') className += ' calendar-event-sauna';
      else if (event.room === 'Laundry') className += ' calendar-event-laundry';
    }

    return {
      className,
    };
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">
        {calendarType === 'flat' ? 'Flat Booking Calendar' : 'Facilities Calendar (Sauna & Laundry)'}
      </h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800, width: '100%' }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default MyCalendar;