import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./sauna.css"; // Import file CSS

// Cấu hình moment localizer cho react-big-calendar
const localizer = momentLocalizer(moment);

// Hàm tạo các slot đặt chỗ
const generateSlots = (startDate) => {
  const slots = [];
  const endDate = moment(startDate).endOf("week"); // Kết thúc vào chủ nhật

  for (let day = startDate; day.isBefore(endDate); day.add(1, "day")) {
    for (let hour = 8; hour <= 21; hour++) {
      const slotTime = moment(day).set({ hour, minute: 0, second: 0 });
      slots.push({
        id: `${day.format("YYYY-MM-DD")}-${hour}`,
        title: "Available", // Hiển thị chữ "Available"
        start: slotTime.toDate(),
        end: moment(slotTime).add(1, "hour").toDate(),
        status: "available", // Trạng thái ban đầu là available
      });
    }
  }
  return slots;
};

const BookingCalendar = () => {
  const [slots, setSlots] = useState(generateSlots(moment())); // Load slots mặc định cho tuần hiện tại
  const [currentView, setCurrentView] = useState("month"); // Chế độ mặc định là month
  const [selectedDate, setSelectedDate] = useState(null); // Ngày đã chọn trong tháng

  // Xử lý khi người dùng chọn một ngày trong chế độ tháng
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSlots(generateSlots(moment(date).startOf("week"))); // Cập nhật các slot cho tuần của ngày đã chọn
    setCurrentView("week"); // Chuyển sang chế độ tuần
  };

  // Xử lý khi người dùng click vào một slot trong chế độ tuần
  const handleSlotClick = (event) => {
    const updatedSlots = slots.map((slot) => {
      if (slot.id === event.id) {
        const newStatus = slot.status === "available" ? "booked" : "available";
        return {
          ...slot,
          status: newStatus,
          title: newStatus === "available" ? "Available" : "Booked", // Hiển thị chữ "Available" hoặc "Booked"
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

  // Function to calculate the number of booked slots for each day
  const getBookedSlotsCount = (date) => {
    return slots.filter(
      (slot) => moment(slot.start).isSame(date, "day") && slot.status === "booked"
    ).length;
  };

  // Custom date formatting and rendering
  const eventLabelGetter = ({ start }) => {
    const currentView = localizer.view();
    if (currentView === "month") {
      // For month view, show booked slot count
      const bookedCount = getBookedSlotsCount(moment(start).startOf('day'));
      return `${bookedCount} booked`; // Show number of booked slots
    }
    return undefined; // Default behavior for other views (week view will show default title)
  };

  return (
    <div className="booking-calendar-container">
      <Calendar
        localizer={localizer}
        events={slots}
        startAccessor="start"
        endAccessor="end"
        defaultView={currentView} // Chế độ view thay đổi theo state
        views={["month", "week"]}
        step={60} // Mỗi slot là 1 tiếng
        timeslots={1} // Hiển thị 1 slot mỗi giờ
        min={new Date(0, 0, 0, 8, 0, 0)} // Bắt đầu từ 8h
        max={new Date(0, 0, 0, 22, 0, 0)} // Kết thúc lúc 21h
        onSelectEvent={handleSlotClick} // Xử lý khi click vào slot (chỉ hoạt động trong chế độ tuần)
        onSelectSlot={currentView === "week" ? handleSelectDate : null} // Chỉ cho phép chọn slot trong chế độ tuần
        eventPropGetter={eventPropGetter} // Tùy chỉnh class cho slot
        eventLabelGetter={eventLabelGetter} // Tùy chỉnh nhãn cho sự kiện
        selectable={currentView === "week"} // Chỉ cho phép chọn slot trong chế độ tuần
        onDrillDown={handleSelectDate} // Chuyển sang chế độ tuần khi nhấn vào ngày trong chế độ tháng
      />
    </div>
  );
};

export default BookingCalendar;
