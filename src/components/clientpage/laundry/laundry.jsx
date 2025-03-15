import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./laundry.css";
import useAuthStore from '../../../../../Backend/src/store/authStore';
import useLaundryBookingStore from '../../../../../Backend/src/store/laundryBookingStore';
import Popup from "../../popup/popup";

const localizer = momentLocalizer(moment);

const generateSlots = (startOfWeek) => {
  const slots = [];
  const startDate = moment(startOfWeek).startOf("week");
  const endDate = moment(startDate).endOf("week");

  for (let day = startDate; day.isBefore(endDate); day.add(1, "day")) {
    for (let hour = 8; hour <= 21; hour++) {
      const slotTime = moment(day).set({ hour, minute: 0, second: 0 });
      slots.push(
        {
          id: `${day.format("YYYY-MM-DD")}-${hour}-washer`,
          title: "available",
          start: slotTime.toDate(),
          end: moment(slotTime).add(1, "hour").toDate(),
          status: "available",
          type: "washer", 
        },
        {
          id: `${day.format("YYYY-MM-DD")}-${hour}-dryer`,
          title: "available",
          start: slotTime.toDate(),
          end: moment(slotTime).add(1, "hour").toDate(),
          status: "available",
          type: "dryer", 
        }
      );
    }
  }
  return slots;
};

const LaundryCalendar = () => {
  const [slots, setSlots] = useState(generateSlots(moment().startOf("week")));
  const user = useAuthStore((state) => state.user);
  const { addLaundryBooking, deleteLaundryBooking, fetchLaundryBookings, laundryBookings } = useLaundryBookingStore();
  const [popup, setPopup] = useState({
      show: false,
      title: "",
      message: "",
      status: "",
    });

  const closePopup = () => {
    setPopup({ show: false, title: "", message: "", status: "" });
  };

  useEffect(() => {
    fetchLaundryBookings();
  }, [fetchLaundryBookings]);

  useEffect(() => {
    const updatedSlots = slots.map((slot) => {
      const isBooked = laundryBookings.some((booking) => {
        const startFrom = booking.bookingPeriod.startFrom;
        const endAt = booking.bookingPeriod.endAt;

        const startFromDate = startFrom?.toDate ? startFrom.toDate() : startFrom;
        const endAtDate = endAt?.toDate ? endAt.toDate() : endAt;

        const facilities = booking.facilities || {};
        const isWasherBooked = slot.type === "washer" && facilities.isWashingMachine;
        const isDryerBooked = slot.type === "dryer" && facilities.isDryer;

        return (
          startFromDate.getTime() === slot.start.getTime() &&
          endAtDate.getTime() === slot.end.getTime() &&
          (isWasherBooked || isDryerBooked)
        );
      });

      return {
        ...slot,
        status: isBooked ? "booked" : "available",
        title: isBooked ? "booked" : "available",
      };
    });
    setSlots(updatedSlots);
  }, [laundryBookings]);

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
        facilities: {
          isWashingMachine: clickedSlot.type === "washer",
          isDryer: clickedSlot.type === "dryer",
        },
      };
      await addLaundryBooking(newBooking); 
    } else {
      const bookingToDelete = laundryBookings.find((booking) => {
        const startFrom = booking.bookingPeriod.startFrom;
        const endAt = booking.bookingPeriod.endAt;

        const startFromDate = startFrom?.toDate ? startFrom.toDate() : startFrom;
        const endAtDate = endAt?.toDate ? endAt.toDate() : endAt;

        const facilities = booking.facilities || {};
        const isWasherBooking = clickedSlot.type === "washer" && facilities.isWashingMachine;
        const isDryerBooking = clickedSlot.type === "dryer" && facilities.isDryer;

        return (
          startFromDate.getTime() === clickedSlot.start.getTime() &&
          endAtDate.getTime() === clickedSlot.end.getTime() &&
          (isWasherBooking || isDryerBooking)
        );
      });

      if (bookingToDelete) {
        console.log("Booking id:", bookingToDelete.laundryBookingId);
        console.log("Booking uid:", user.uid);
        const result = await deleteLaundryBooking(bookingToDelete.laundryBookingId, user.uid); 
        setPopup({
          show: true,
          title: result.Title,
          message: result.Message,
          status: result.Status,
        });
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
      className: event.status === "booked" ? `${event.type}-booked` : "",
    };
  };

  const EventComponent = ({ event }) => <span>{event.title}</span>;

  return (
    <div className="laundry-calendar">
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
      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          status={popup.status}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default LaundryCalendar;