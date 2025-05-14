export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export type EventCategory = 'social' | 'professional' | 'cultural' | 'sports';

export const EVENT_CATEGORIES = {
  social: 'Social Events (Parties, reunions, weddings)',
  professional: 'Professional Events (Conferences, workshops)',
  cultural: 'Cultural Events (Concerts, art exhibitions)',
  sports: 'Sports Events (Marathons, tournaments)'
} as const;

export interface Event {
  id: string;
  Name: string;
  Description: string;
  category: EventCategory;
  Date: string;
  Venue: string;
  Price: number;
  Image: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  bookingDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  quantity: number;
  totalPrice: number;
}