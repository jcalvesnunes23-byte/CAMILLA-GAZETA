
export enum Page {
  LANDING = 'landing',
  CHECKOUT = 'checkout',
  ADMIN = 'admin'
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean;
}

export interface BookingState {
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentOption: 'full' | 'deposit';
}

export interface Booking extends BookingState {
  id: string;
  createdAt: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  depositAmount: number;
  isMaintenance?: boolean;
}
