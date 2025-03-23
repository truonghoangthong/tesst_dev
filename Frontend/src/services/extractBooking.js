export const extractBookings = (slots, user) => {
  const bookedSlots = slots.filter((slot) => slot.status === "booked");

  const bookings = bookedSlots.map((slot) => ({
    userId: user.uid,
    fullName: user.fullName,
    from: slot.start,
    to: slot.end,
  }));

  return bookings;
};