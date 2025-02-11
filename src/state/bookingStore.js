import { create } from 'zustand';

export const bookingStore = create((set) => ({
  rooms: ["A Lentäjän Poika 1", "B Lentäjän Poika 2", "C Henry Ford Cabin", "D Beach House"],
  
  bookings: [
    { 
      id: "100238", 
      room: "A Lentäjän Poika 1", 
      guestId: 1,
      checkIn: "27.05.2025", 
      checkOut: "30.05.2025", 
      status: "Available", 
      action: "Late check-out", 
      note: "--" 
    },
    { 
      id: "205332", 
      room: "B Lentäjän Poika 2", 
      guestId: 2,
      checkIn: "26.05.2025", 
      checkOut: "27.05.2025", 
      status: "Pending confirmation", 
      action: "Need cleaning", 
      note: "asdasd" 
    },
    { 
      id: "269797", 
      room: "B Lentäjän Poika 2", 
      guestId: 3,
      checkIn: "24.05.2025", 
      checkOut: "26.05.2025", 
      status: "Booked", 
      action: "30.01.2019", 
      note: "--" 
    },
    { 
      id: "387879", 
      room: "C Henry Ford Cabin", 
      guestId: 4,
      checkIn: "23.05.2025", 
      checkOut: "--", 
      status: "Triggered the trigger", 
      action: "28.01.2019", 
      note: "--" 
    },
    { 
      id: "857293", 
      room: "D Beach House", 
      guestId: 5,
      checkIn: "22.05.2025", 
      checkOut: "23.05.2025", 
      status: "Cleaning", 
      action: "10.01.2019", 
      note: "asdadc" 
    }
  ],
  sauna: [
    {
      id: 1,
      guestId: 103,
      from: '16:00',
      to: '17:00',
      status: 'Booked',
      action: 'View',
      note: 'Bring towels',
    },
    {
      id: 2,
      guestId: 104,
      from: '17:30',
      to: '18:30',
      status: 'Available',
      action: 'Edit',
      note: 'Bring water',
    },
  ],

  laundry: [
    {
      id: 1,
      guestId: 105,
      from: '09:00',
      to: '10:00',
      status: 'Booked',
      action: 'View',
      note: 'Use detergent',
    },
    {
      id: 2,
      guestId: 106,
      from: '10:30',
      to: '11:30',
      status: 'Cleaning',
      action: 'Edit',
      note: 'Dry only',
    },
  ],

  setRoomsBookings: (newRooms) => set({ rooms: newRooms }),
  setSaunaBookings: (newSauna) => set({ sauna: newSauna }),
  setLaundryBookings: (newLaundry) => set({ laundry: newLaundry }),
}));
