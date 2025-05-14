export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
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