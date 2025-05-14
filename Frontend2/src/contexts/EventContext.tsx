import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EventsState, Event } from '../types';
import { useAuth } from './AuthContext';

// Mock event data - would be replaced by API calls
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders and hands-on workshops.',
    category: 'Technology',
    date: '2025-05-15T09:00:00',
    venue: 'Grand Convention Center',
    price: 199.99,
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists from around the world across multiple genres.',
    category: 'Music',
    date: '2025-07-10T12:00:00',
    venue: 'Riverside Park',
    price: 149.50,
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Business Leadership Summit',
    description: 'Network with C-level executives and learn strategies to enhance your leadership skills.',
    category: 'Business',
    date: '2025-04-25T08:30:00',
    venue: 'Grand Hyatt Hotel',
    price: 299.99,
    image: 'https://images.pexels.com/photos/2566581/pexels-photo-2566581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    name: 'Cooking Masterclass',
    description: 'Learn gourmet cooking techniques from Michelin-starred chefs in this hands-on masterclass.',
    category: 'Food',
    date: '2025-06-05T18:00:00',
    venue: 'Culinary Institute',
    price: 89.99,
    image: 'https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '5',
    name: 'Art Exhibition Opening',
    description: 'Be among the first to see this stunning collection of contemporary art from around the world.',
    category: 'Art',
    date: '2025-05-20T19:00:00',
    venue: 'Metropolitan Gallery',
    price: 25.00,
    image: 'https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '6',
    name: 'Marathon for Charity',
    description: 'Run for a cause in this annual charity marathon supporting children\'s education.',
    category: 'Sports',
    date: '2025-09-12T07:00:00',
    venue: 'City Park',
    price: 50.00,
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

type EventAction =
  | { type: 'FETCH_EVENTS_START' }
  | { type: 'FETCH_EVENTS_SUCCESS'; payload: Event[] }
  | { type: 'FETCH_EVENTS_FAILURE'; payload: string }
  | { type: 'CREATE_EVENT_START' }
  | { type: 'CREATE_EVENT_SUCCESS'; payload: Event }
  | { type: 'CREATE_EVENT_FAILURE'; payload: string }
  | { type: 'UPDATE_EVENT_START' }
  | { type: 'UPDATE_EVENT_SUCCESS'; payload: Event }
  | { type: 'UPDATE_EVENT_FAILURE'; payload: string }
  | { type: 'DELETE_EVENT_START' }
  | { type: 'DELETE_EVENT_SUCCESS'; payload: string }
  | { type: 'DELETE_EVENT_FAILURE'; payload: string };

interface EventContextType {
  state: EventsState;
  fetchEvents: () => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  createEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

const initialState: EventsState = {
  events: [],
  isLoading: false,
  error: null
};

const eventReducer = (state: EventsState, action: EventAction): EventsState => {
  switch (action.type) {
    case 'FETCH_EVENTS_START':
    case 'CREATE_EVENT_START':
    case 'UPDATE_EVENT_START':
    case 'DELETE_EVENT_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_EVENTS_SUCCESS':
      return { ...state, isLoading: false, events: action.payload, error: null };
    case 'CREATE_EVENT_SUCCESS':
      return { ...state, isLoading: false, events: [...state.events, action.payload], error: null };
    case 'UPDATE_EVENT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        events: state.events.map(event => event.id === action.payload.id ? action.payload : event),
        error: null
      };
    case 'DELETE_EVENT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        events: state.events.filter(event => event.id !== action.payload),
        error: null
      };
    case 'FETCH_EVENTS_FAILURE':
    case 'CREATE_EVENT_FAILURE':
    case 'UPDATE_EVENT_FAILURE':
    case 'DELETE_EVENT_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const { state: authState } = useAuth();

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Mock API functions
  const fetchEvents = async () => {
    dispatch({ type: 'FETCH_EVENTS_START' });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, this would be an API call
      const events = MOCK_EVENTS;
      
      dispatch({ type: 'FETCH_EVENTS_SUCCESS', payload: events });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_EVENTS_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch events' 
      });
    }
  };

  const getEventById = (id: string) => {
    return state.events.find(event => event.id === id);
  };

  const createEvent = async (event: Omit<Event, 'id'>) => {
    dispatch({ type: 'CREATE_EVENT_START' });
    
    try {
      // Verify user is admin
      if (authState.user?.role !== 'admin') {
        throw new Error('Only admins can create events');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new event (in real app, this would be an API call)
      const newEvent: Event = {
        id: uuidv4(),
        ...event,
        createdBy: authState.user.id
      };
      
      dispatch({ type: 'CREATE_EVENT_SUCCESS', payload: newEvent });
    } catch (error) {
      dispatch({ 
        type: 'CREATE_EVENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to create event' 
      });
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    dispatch({ type: 'UPDATE_EVENT_START' });
    
    try {
      // Verify user is admin
      if (authState.user?.role !== 'admin') {
        throw new Error('Only admins can update events');
      }
      
      // Find the event
      const existingEvent = state.events.find(event => event.id === id);
      
      if (!existingEvent) {
        throw new Error('Event not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update event (in real app, this would be an API call)
      const updatedEvent: Event = {
        ...existingEvent,
        ...eventData
      };
      
      dispatch({ type: 'UPDATE_EVENT_SUCCESS', payload: updatedEvent });
    } catch (error) {
      dispatch({ 
        type: 'UPDATE_EVENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to update event' 
      });
    }
  };

  const deleteEvent = async (id: string) => {
    dispatch({ type: 'DELETE_EVENT_START' });
    
    try {
      // Verify user is admin
      if (authState.user?.role !== 'admin') {
        throw new Error('Only admins can delete events');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Delete event (in real app, this would be an API call)
      dispatch({ type: 'DELETE_EVENT_SUCCESS', payload: id });
    } catch (error) {
      dispatch({ 
        type: 'DELETE_EVENT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to delete event' 
      });
    }
  };

  return (
    <EventContext.Provider value={{ 
      state, 
      fetchEvents, 
      getEventById,
      createEvent,
      updateEvent,
      deleteEvent
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};