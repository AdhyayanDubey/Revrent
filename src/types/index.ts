// src/types/index.ts

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  rating: number;
  tags: string[];
  pricePerHour: number;
  imageUrl: string;
  speed?: string;
  range?: string;
  chargeTime?: string;
  batteryStatus?: number;
  location?: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  userId: string;
  startTime: string;
  endTime: string;
  totalCost: number;
  status: 'Reserved' | 'Active' | 'Completed' | 'Cancelled';
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImage?: string;
}
