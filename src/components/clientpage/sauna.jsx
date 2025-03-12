import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./sauna.css"; // Import file CSS

const localizer = momentLocalizer(moment);

// Hàm tạo các slot đặt chỗ
const generateSlots = (startOfWeek) => {
  const slots = [];
  const startDate = moment(startOfWeek).startOf("week"); // Bắt đầu từ Chủ Nhật
  const endDate = moment(startDate).endOf("week"); // Kết thúc vào Thứ Bảy

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
  const [slots, setSlots] = useState(generateSlots(moment().startOf("week"))); // Khởi tạo slots cho tuần hiện tại

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

  // Xử lý khi người dùng chuyển tuần
  const handleNavigate = (newDate) => {
    const startOfWeek = moment(newDate).startOf("week"); // Lấy ngày bắt đầu của tuần mới
    const newSlots = generateSlots(startOfWeek); // Tạo slots mới cho tuần mới
    setSlots(newSlots);
  };

  // Tùy chỉnh class cho các slot dựa trên trạng thái
  const eventPropGetter = (event) => {
    return {
      className: event.status === "booked" ? "sauna-booked" : "", // Thêm class "sauna-booked" nếu trạng thái là booked
    };
  };

  // Custom component để chỉ hiển thị trạng thái (không hiển thị thời gian)
  const EventComponent = ({ event }) => (
    <span>{event.title}</span>
  );

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
          step={60} // Mỗi slot là 1 tiếng
          timeslots={1} // Hiển thị 1 slot mỗi giờ
          min={new Date(0, 0, 0, 8, 0, 0)} // Bắt đầu từ 8h
          max={new Date(0, 0, 0, 22, 0, 0)} // Kết thúc lúc 21h
          onSelectEvent={handleSlotClick} // Xử lý khi click vào slot
          onNavigate={handleNavigate} // Xử lý khi chuyển tuần
          eventPropGetter={eventPropGetter} // Tùy chỉnh class cho slot
          components={{
            event: EventComponent, // Sử dụng component tùy chỉnh để hiển thị sự kiện
          }}
        />
      </div>
    </div>
  );
};

export default BookingCalendar;