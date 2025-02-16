import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./sauna.css"; // Import file CSS

// Cấu hình moment localizer cho react-big-calendar
const localizer = momentLocalizer(moment);

// Hàm tạo các slot đặt chỗ
const generateSlots = () => {
  const slots = [];
  const startDate = moment().startOf("week").add(1, "day"); // Bắt đầu từ thứ 2
  const endDate = moment(startDate).endOf("week"); // Kết thúc vào chủ nhật

  for (let day = startDate; day.isBefore(endDate); day.add(1, "day")) {
    for (let hour = 8; hour <= 21; hour++) {
      const slotTime = moment(day).set({ hour, minute: 0, second: 0 });
      slots.push({
        id: `${day.format("YYYY-MM-DD")}-${hour}`,
        title: "available", // Chỉ hiển thị chữ "available" hoặc "booked"
        start: slotTime.toDate(),
        end: moment(slotTime).add(1, "hour").toDate(),
        status: "available", // Trạng thái ban đầu
      });
    }
  }
  return slots;
};

const BookingCalendar = () => {
  const [slots, setSlots] = useState(generateSlots());

  // Xử lý khi người dùng click vào một slot
  const handleSlotClick = (event) => {
    const updatedSlots = slots.map((slot) => {
      if (slot.id === event.id) {
        const newStatus = slot.status === "available" ? "booked" : "available";
        return {
          ...slot,
          status: newStatus,
          title: newStatus, // Cập nhật title thành "available" hoặc "booked"
        };
      }
      return slot;
    });
    setSlots(updatedSlots);
  };

  // Tùy chỉnh class cho các slot dựa trên trạng thái
  const eventPropGetter = (event) => {
    return {
      className: event.status === "booked" ? "booked" : "", // Thêm class "booked" nếu trạng thái là booked
    };
  };

  return (
    <div className="booking-calendar-container">
      <Calendar
        localizer={localizer}
        events={slots}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={["week"]}
        step={60} // Mỗi slot là 1 tiếng
        timeslots={1} // Hiển thị 1 slot mỗi giờ
        min={new Date(0, 0, 0, 8, 0, 0)} // Bắt đầu từ 8h
        max={new Date(0, 0, 0, 22, 0, 0)} // Kết thúc lúc 21h
        onSelectEvent={handleSlotClick} // Xử lý khi click vào slot
        eventPropGetter={eventPropGetter} // Tùy chỉnh class cho slot
      />
    </div>
  );
};

export default BookingCalendar;