// Zustand State Management
import { create } from 'zustand';
import { User, Vehicle, Booking } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  activeBooking: Booking | null;
  setActiveBooking: (booking: Booking | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  selectedVehicle: null,
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  activeBooking: null,
  setActiveBooking: (booking) => set({ activeBooking: booking }),
}));
