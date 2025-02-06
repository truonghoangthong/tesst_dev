import { create } from "zustand";

export const userStore = create((set) => ({
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "098-765-4321" },
  ],

  //user: null,
  //login: (user) => set ({ user }),
  //logout: () => set({ user: null})
  //setUser: (user) => set({ user })
}));