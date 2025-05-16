export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export enum EventCategory {
  SOCIAL = 'social',
  PROFESSIONAL = 'professional',
  CULTURAL = 'cultural',
  SPORTS = 'sports'
}

export const EventCategoryLabels: Record<EventCategory, string> = {
  [EventCategory.SOCIAL]: 'Social Events (Parties, reunions, weddings)',
  [EventCategory.PROFESSIONAL]: 'Professional Events (Conferences, workshops)',
  [EventCategory.CULTURAL]: 'Cultural Events (Concerts, art exhibitions)',
  [EventCategory.SPORTS]: 'Sports Events (Marathons, tournaments)'
};

export const EventCategoryImages: Record<EventCategory, string> = {
  [EventCategory.SOCIAL]: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
  [EventCategory.PROFESSIONAL]: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
  [EventCategory.CULTURAL]: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
  [EventCategory.SPORTS]: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg'
};

export interface Event {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  venue: string;
  price: number;
  image: string;
  createdBy?: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  bookingDate: string;
  quantity: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  translations: Record<string, string>;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}

export interface BookingsState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}