import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./laundry.css";
import useAuthStore from '../../../../../Backend/src/store/authStore';
import useLaundryBookingStore from '../../../../../Backend/src/store/laundryBookingStore';
import Popup from "../../popup/popup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [selectedDate, setSelectedDate] = useState(new Date());
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
      const booking = laundryBookings.find((booking) => {
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

      if (booking) {
        return {
          ...slot,
          status: "booked",
          title: booking.client.uid === user.uid ? "my-reservation" : "booked",
        };
      } else {
        return slot;
      }
    });
    setSlots(updatedSlots);
  }, [laundryBookings, user.uid]);

  const handleSlotClick = async (event) => {
    const currentTime = new Date();
    const twoHoursAfter = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // 2 giờ sau

    if (event.start < twoHoursAfter) {
      setPopup({
        show: true,
        title: "Error",
        message: "You cannot modify a slot that is within 2 hours of the current time.", 
        status: "error",
      });
      return; 
    }

    const updatedSlots = slots.map((slot) => {
      if (slot.id === event.id) {
        const newStatus = slot.status === "available" ? "booked" : "available";
        return {
          ...slot,
          status: newStatus,
          title: newStatus === "booked" ? "my-reservation" : "available",
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

    const updatedSlots = newSlots.map((slot) => {
      const booking = laundryBookings.find((booking) => {
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

      if (booking) {
        return {
          ...slot,
          status: "booked",
          title: booking.client.uid === user.uid ? "my-reservation" : "booked",
        };
      } else {
        return slot;
      }
    });

    setSlots(updatedSlots);
  };

  const eventPropGetter = (event) => {
    const currentTime = new Date();
    const twoHoursAfter = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); //2 giờ sau
    const isWithinTwoHours = event.start < twoHoursAfter;

    if (isWithinTwoHours) {
      if (event.title === "my-reservation") {
        return {
          className: "laundry-my-reservation laundry-past", 
        };
      } else if (event.status === "booked") {
        return {
          className: "laundry-booked laundry-past", 
        };
      } else {
        return {
          className: "laundry-past", 
        };
      }
    } else {
      if (event.title === "my-reservation") {
        return {
          className: "laundry-my-reservation",
        };
      } else if (event.status === "booked") {
        return {
          className: "laundry-booked",
        };
      } else {
        return {
          className: "laundry-available",
        };
      }
    }
  };

  const EventComponent = ({ event }) => {
    const currentTime = new Date();
    const twoHoursAfter = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); //2 giờ sau
    const isWithinTwoHours = event.start < twoHoursAfter;

    if (isWithinTwoHours) {
      if (event.title === "my-reservation") {
        return <span>My Reservation</span>; 
      } else if (event.status === "booked") {
        return <span>Booked</span>; 
      } else {
        return <span>Past</span>; 
      }
    } else {
      if (event.title === "my-reservation") {
        return <span>Cancel</span>; 
      } else if (event.status === "booked") {
        return <span>Booked</span>; 
      } else {
        return <span>Available</span>; 
      }
    }
  };

  const isMobile = window.innerWidth <= 768; 

  return (
    <div className="laundry-calendar">
      <div className="booking-calendar-container">
        {isMobile && (
          <div style={{ marginBottom: "10px" }}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        )}
        <Calendar
          localizer={localizer}
          events={slots.filter((slot) => {
            if (isMobile) {
              return moment(slot.start).isSame(selectedDate, 'day');
            } else {
              return true; 
            }
          })}
          startAccessor="start"
          endAccessor="end"
          defaultView={isMobile ? "day" : "week"}
          views={isMobile ? ["day"] : ["week", "day"]}
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