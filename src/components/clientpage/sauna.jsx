import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Function to generate time slots for booking
const generateSlots = () => {
  const slots = [];
  const startTime = moment().set({ hour: 8, minute: 0, second: 0 });
  const endTime = moment().set({ hour: 21, minute: 0, second: 0 });

  for (let time = startTime; time.isBefore(endTime); time.add(1, 'hour')) {
    slots.push({
      time: time.format('HH:mm'),
      status: 'available',
      date: time.format('YYYY-MM-DD'),
    });
  }
  return slots;
};

const BookingCalendar = () => {
  const [slots, setSlots] = useState(generateSlots());

  // Handle booking slot (toggle status between 'available' and 'booked')
  const handleSlotClick = (slotIndex) => {
    const updatedSlots = [...slots];
    updatedSlots[slotIndex].status = updatedSlots[slotIndex].status === 'available' ? 'booked' : 'available';
    setSlots(updatedSlots);
  };

  // Create events based on slots for react-big-calendar
  const events = slots
    .map((slot, index) => {
      // Skip invalid slots
      if (!slot.time || !slot.status || !slot.date) {
        console.warn('Invalid slot skipped:', slot);
        return null;
      }

      const startTime = moment(`${slot.date} ${slot.time}`, 'YYYY-MM-DD HH:mm').toDate();
      const endTime = moment(startTime).add(1, 'hour').toDate();

      return {
        title: `Slot: ${slot.time} - ${slot.status}`, // Ensure title is always present
        start: startTime,
        end: endTime,
        status: slot.status,
        resourceId: index,
      };
    })
    .filter(Boolean); // Remove null entries

  console.log('Generated Events:', events); // Check the events array structure

  // Check for invalid events
  if (events.some(event => !event)) {
    console.error('Invalid events detected:', events);
    return <div>Error: Invalid events data.</div>;
  }

  return (
    <div>
      <h1>Booking Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['week']} // Display calendar in weekly view
        step={60} // 1 hour per slot
        timeslots={1} // 1 time slot per hour
        onSelectSlot={({ start, end }) => {
          // Match selected slot based on start and end times
          const selectedSlot = slots.find((slot) => {
            return (
              moment(slot.date + " " + slot.time).isSame(start) &&
              moment(slot.date + " " + slot.time).add(1, 'hour').isSame(end)
            );
          });

          if (selectedSlot) {
            const slotIndex = slots.indexOf(selectedSlot);
            handleSlotClick(slotIndex); // Toggle status on click
          } else {
            console.error("No valid slot found for selection.");
          }
        }}
        eventPropGetter={(event) => {
          // Style events based on their status (available or booked)
          const backgroundColor = event.status === 'available' ? 'green' : event.status === 'booked' ? 'red' : 'gray';
          return {
            style: {
              backgroundColor,
              color: 'white', // Ensure white text on the background
              borderRadius: '5px', // Rounded corners for better look
            },
          };
        }}
      />
    </div>
  );
};

export default BookingCalendar;