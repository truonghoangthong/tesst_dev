import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./sauna.css";
import useAuthStore from '../../../../Backend/src/store/authStore';
import useSaunaBookingStore from '../../../../Backend/src/store/saunaBookingStore';

const localizer = momentLocalizer(moment);

const generateSlots = (startOfWeek) => {
  const slots = [];
  const startDate = moment(startOfWeek).startOf("week");
  const endDate = moment(startDate).endOf("week");

  for (let day = startDate; day.isBefore(endDate); day.add(1, "day")) {
    for (let hour = 8; hour <= 21; hour++) {
      const slotTime = moment(day).set({ hour, minute: 0, second: 0 });
      slots.push({
        id: `${day.format("YYYY-MM-DD")}-${hour}`,
        title: "available",
        start: slotTime.toDate(),
        end: moment(slotTime).add(1, "hour").toDate(),
        status: "available",
      });
    }
  }
  return slots;
};

const BookingCalendar = () => {
  const [slots, setSlots] = useState(generateSlots(moment().startOf("week")));
  const user = useAuthStore((state) => state.user);
  const { addSaunaBooking, deleteSaunaBooking, fetchSaunaBookings, saunaBookings } = useSaunaBookingStore();

  useEffect(() => {
    fetchSaunaBookings();
  }, [fetchSaunaBookings]);

  useEffect(() => {
    const updatedSlots = slots.map((slot) => {
      const isBooked = saunaBookings.some((booking) => {

        const startFrom = booking.bookingPeriod.startFrom;
        const endAt = booking.bookingPeriod.endAt;

        const startFromDate = startFrom?.toDate ? startFrom.toDate() : startFrom;
        const endAtDate = endAt?.toDate ? endAt.toDate() : endAt;

        return (
          startFromDate.getTime() === slot.start.getTime() &&
          endAtDate.getTime() === slot.end.getTime()
        );
      });

      return {
        ...slot,
        status: isBooked ? "booked" : "available",
        title: isBooked ? "booked" : "available",
      };
    });
    setSlots(updatedSlots);
  }, [saunaBookings]);

  const handleSlotClick = async (event) => {
    const updatedSlots = slots.map((slot) => {
      if (slot.id === event.id) {
        const newStatus = slot.status === "available" ? "booked" : "available";
        return {
          ...slot,
          status: newStatus,
          title: newStatus,
        };
      }
      return slot;
    });
    setSlots(updatedSlots);

    const clickedSlot = updatedSlots.find((slot) => slot.id === event.id);

    if (clickedSlot.status === "booked") {
      const newBooking = {
        bookingPeriod: {
          startFrom: clickedSlot.start,
          endAt: clickedSlot.end,
        },
        client: {
          fullName: user.fullName,
          uid: user.uid,
        },
      };
      await addSaunaBooking(newBooking); 
    } else {
      const bookingToDelete = saunaBookings.find((booking) => {
        const startFrom = booking.bookingPeriod.startFrom;
        const endAt = booking.bookingPeriod.endAt;

        const startFromDate = startFrom?.toDate ? startFrom.toDate() : startFrom;
        const endAtDate = endAt?.toDate ? endAt.toDate() : endAt;

        return (
          startFromDate.getTime() === clickedSlot.start.getTime() &&
          endAtDate.getTime() === clickedSlot.end.getTime()
        );
      });

      if (bookingToDelete) {
        console.log("Booking to delete:", bookingToDelete);
        await deleteSaunaBooking(bookingToDelete.saunaBookingId, user.uid); 
      }
    }
  };

  const handleNavigate = (newDate) => {
    const startOfWeek = moment(newDate).startOf("week");
    const newSlots = generateSlots(startOfWeek);
    setSlots(newSlots);
  };

  const eventPropGetter = (event) => {
    return {
      className: event.status === "booked" ? "sauna-booked" : "",
    };
  };

  const EventComponent = ({ event }) => <span>{event.title}</span>;

  return (
    <div className="sauna-calendar">
      <div className="booking-calendar-container">
        <Calendar
          localizer={localizer}
          events={slots}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={["week"]}
          step={60}
          timeslots={1}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
          onSelectEvent={handleSlotClick}
          onNavigate={handleNavigate}
          eventPropGetter={eventPropGetter}
          components={{
            event: EventComponent,
          }}
        />
      </div>
    </div>
  );
};

export default BookingCalendar;