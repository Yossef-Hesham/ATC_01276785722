import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BookingsState, Booking } from '../types';
import { useAuth } from './AuthContext';

// Mock bookings data - would be replaced by API calls
const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    userId: '2',
    eventId: '1',
    bookingDate: '2025-03-10T14:22:00',
    quantity: 1
  },
  {
    id: '2',
    userId: '2',
    eventId: '3',
    bookingDate: '2025-03-12T09:45:00',
    quantity: 2
  }
];

type BookingAction =
  | { type: 'FETCH_BOOKINGS_START' }
  | { type: 'FETCH_BOOKINGS_SUCCESS'; payload: Booking[] }
  | { type: 'FETCH_BOOKINGS_FAILURE'; payload: string }
  | { type: 'CREATE_BOOKING_START' }
  | { type: 'CREATE_BOOKING_SUCCESS'; payload: Booking }
  | { type: 'CREATE_BOOKING_FAILURE'; payload: string }
  | { type: 'CANCEL_BOOKING_START' }
  | { type: 'CANCEL_BOOKING_SUCCESS'; payload: string }
  | { type: 'CANCEL_BOOKING_FAILURE'; payload: string };

interface BookingContextType {
  state: BookingsState;
  fetchBookings: () => Promise<void>;
  createBooking: (eventId: string, quantity?: number) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  hasUserBookedEvent: (eventId: string) => boolean;
  getUserBookings: () => Booking[];
}

const initialState: BookingsState = {
  bookings: [],
  isLoading: false,
  error: null
};

const bookingReducer = (state: BookingsState, action: BookingAction): BookingsState => {
  switch (action.type) {
    case 'FETCH_BOOKINGS_START':
    case 'CREATE_BOOKING_START':
    case 'CANCEL_BOOKING_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_BOOKINGS_SUCCESS':
      return { ...state, isLoading: false, bookings: action.payload, error: null };
    case 'CREATE_BOOKING_SUCCESS':
      return { ...state, isLoading: false, bookings: [...state.bookings, action.payload], error: null };
    case 'CANCEL_BOOKING_SUCCESS':
      return {
        ...state,
        isLoading: false,
        bookings: state.bookings.filter(booking => booking.id !== action.payload),
        error: null
      };
    case 'FETCH_BOOKINGS_FAILURE':
    case 'CREATE_BOOKING_FAILURE':
    case 'CANCEL_BOOKING_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const { state: authState } = useAuth();

  // Load bookings on mount and auth state change
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchBookings();
    }
  }, [authState.isAuthenticated]);

  // Mock API functions
  const fetchBookings = async () => {
    dispatch({ type: 'FETCH_BOOKINGS_START' });
    
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('User must be logged in');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, this would be an API call
      // Filter bookings for current user
      const userBookings = authState.user.role === 'admin' 
        ? MOCK_BOOKINGS // Admins can see all bookings
        : MOCK_BOOKINGS.filter(booking => booking.userId === authState.user.id);
      
      dispatch({ type: 'FETCH_BOOKINGS_SUCCESS', payload: userBookings });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_BOOKINGS_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch bookings' 
      });
    }
  };

  const createBooking = async (eventId: string, quantity = 1) => {
    dispatch({ type: 'CREATE_BOOKING_START' });
    
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('User must be logged in');
      }
      
      // Check if user already booked this event
      const alreadyBooked = state.bookings.some(
        booking => booking.eventId === eventId && booking.userId === authState.user?.id
      );
      
      if (alreadyBooked) {
        throw new Error('You have already booked this event');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create booking (in real app, this would be an API call)
      const newBooking: Booking = {
        id: uuidv4(),
        userId: authState.user.id,
        eventId,
        bookingDate: new Date().toISOString(),
        quantity
      };
      
      dispatch({ type: 'CREATE_BOOKING_SUCCESS', payload: newBooking });
      return Promise.resolve();
    } catch (error) {
      dispatch({ 
        type: 'CREATE_BOOKING_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to create booking' 
      });
      return Promise.reject(error);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    dispatch({ type: 'CANCEL_BOOKING_START' });
    
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('User must be logged in');
      }
      
      // Find the booking
      const booking = state.bookings.find(b => b.id === bookingId);
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Check if user owns this booking or is admin
      if (booking.userId !== authState.user.id && authState.user.role !== 'admin') {
        throw new Error('You cannot cancel someone else\'s booking');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Cancel booking (in real app, this would be an API call)
      dispatch({ type: 'CANCEL_BOOKING_SUCCESS', payload: bookingId });
    } catch (error) {
      dispatch({ 
        type: 'CANCEL_BOOKING_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to cancel booking' 
      });
    }
  };

  const hasUserBookedEvent = (eventId: string): boolean => {
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }
    
    return state.bookings.some(
      booking => booking.eventId === eventId && booking.userId === authState.user?.id
    );
  };

  const getUserBookings = (): Booking[] => {
    if (!authState.isAuthenticated || !authState.user) {
      return [];
    }
    
    return state.bookings.filter(booking => booking.userId === authState.user?.id);
  };

  return (
    <BookingContext.Provider value={{ 
      state, 
      fetchBookings,
      createBooking,
      cancelBooking,
      hasUserBookedEvent,
      getUserBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};