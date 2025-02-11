import  { create } from 'zustand';

export const complaintsStore = create((set) => ({
  complaints: [
    {
      id: 1,
      guestId: 1,
      dateSubmitted: "2025-02-01",
      details: "Room was not cleaned properly.",
      status: "Pending",
      action: "Review cleaning",
      note: "Guest requested an extra cleaning.",
    },
    {
      id: 2,
      guestId: 2,
      dateSubmitted: "2025-02-03",
      details: "The sauna temperature was too low.",
      status: "Resolved",
      action: "Check sauna settings",
      note: "Temperature adjusted.",
    },
  ],
  setComplaints: (updatedComplaints) => set({ complaints: updatedComplaints }),
}));
