import { create } from "zustand";

const useFeedbackStore = create((set) => ({
  feedback: [],
}));

export default useFeedbackStore;
