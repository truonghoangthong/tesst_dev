import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./sauna.css"; // Import file CSS

const localizer = momentLocalizer(moment);

// Function to generate slots for a given start date (entire week)
const generateSlots = (startDate) => {
  const slots = [];
  const endDate = moment(startDate).endOf("week"); // End of the week (Sunday)

  for (let day = moment(startDate); day.isBefore(endDate); day.add(1, "day")) {
    for (let hour = 8; hour <= 21; hour++) {
      const slotTime = moment(day).set({ hour, minute: 0, second: 0 });
      slots.push({
        id: `${day.format("YYYY-MM-DD")}-${hour}`,
        title: "Available", // Display "Available" by default
        start: slotTime.toDate(),
        end: moment(slotTime).add(1, "hour").toDate(),
        status: "available", // Set status as "available" initially
      });
    }
  }
  return slots;
};

const BookingCalendar = () => {
  const [slots, setSlots] = useState(generateSlots(moment())); // Default slots for the current week
  const [currentView, setCurrentView] = useState("month"); // Start with "month" view
  const [selectedDate, setSelectedDate] = useState(null); // Store selected date

  // Handle selecting a date in "month" view (drill down to "week")
  const handleSelectDate = (date) => {
    console.log("Selected date in month view:", date); // Debugging log
    setSelectedDate(date);
    setSlots(generateSlots(moment(date).startOf("week"))); // Generate slots for the selected week
    setCurrentView("week"); // Change view to "week"
  };

  // Handle slot click in "week" view
  const handleSlotClick = (event) => {
    const updatedSlots = slots.map((slot) => {
      if (slot.id === event.id) {
        const newStatus = slot.status === "available" ? "booked" : "available";
        return {
          ...slot,
          status: newStatus,
          title: newStatus === "available" ? "Available" : "Booked", // Update title to reflect the status
        };
      }
      return slot;
    });
    setSlots(updatedSlots);
  };

  const eventPropGetter = (event) => {
    return {
      className: event.status === "booked" ? "booked" : "",
    };
  };

  // Render only "Available" or "Booked" status in the event
  const eventLabelGetter = ({ start }) => {
    const currentView = localizer.view();
    if (currentView === "month") {
      return ""; // Hide times and only show status in month view
    }
    return `${start && start.title === "Available" ? "Available" : "Booked"}`; // Show only status in week view
  };

  // Use onDrillDown to switch views from month to week when a day is clicked
  const handleDrillDown = (date) => {
    console.log("Drill down clicked, switching to week view for date:", date); // Debugging log
    setSelectedDate(date);
    setSlots(generateSlots(moment(date).startOf("week"))); // Generate slots for the selected week
    setCurrentView("week"); // Force view change to "week"
  };

  // Render only slots in the week view, hide in month view
  const eventsToDisplay = currentView === "week" ? slots : [];

  return (
    <div className="booking-calendar-container sauna-calendar">
      <Calendar
        localizer={localizer}
        events={eventsToDisplay} // Only show slots if in week view
        startAccessor="start"
        endAccessor="end"
        defaultView={currentView} // Use state to control view
        views={["month", "week"]} // Only allow "month" and "week" views
        step={60} // Each slot is 1 hour
        timeslots={1} // Show 1 slot per hour
        min={new Date(0, 0, 0, 8, 0, 0)} // Start from 8 AM
        max={new Date(0, 0, 0, 22, 0, 0)} // End at 10 PM
        onSelectEvent={handleSlotClick} // Slot click handler
        onSelectSlot={currentView === "week" ? handleSelectDate : null} // Only allow selecting a date in "week" view
        eventPropGetter={eventPropGetter}
        eventLabelGetter={eventLabelGetter}
        selectable={currentView === "week"} // Only allow selecting a slot in "week" view
        onDrillDown={handleDrillDown} // Drill down when clicking on a day in the "month" view
      />
    </div>
  );
};

export default BookingCalendar;
