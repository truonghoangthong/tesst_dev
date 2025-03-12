export const extractBookings = (slots) => {
  const bookedSlots = slots.filter((slot) => slot.status === "booked"); 
  bookedSlots.sort((a, b) => a.start - b.start); 

  const bookings = [];
  let currentBooking = null;

  bookedSlots.forEach((slot) => {
    if (!currentBooking) {
      currentBooking = {
        userId: "user-id", 
        fullName: "User Full Name", 
        from: slot.start,
        to: slot.end,
        saunaBookingId: `booking-${slot.id}`, 
      };
    } else {
      if (slot.start.getTime() === currentBooking.to.getTime()) {
        currentBooking.to = slot.end;
      } else {
        bookings.push(currentBooking);
        currentBooking = {
          userId: "user-id", 
          fullName: "User Full Name", 
          from: slot.start,
          to: slot.end,
          saunaBookingId: `booking-${slot.id}`, 
        };
      }
    }
  });

  if (currentBooking) {
    bookings.push(currentBooking);
  }

  return bookings;
};