import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, isBefore } from 'date-fns';
import { Ticket, Calendar, MapPin, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookings } from '../contexts/BookingContext';
import { useEvents } from '../contexts/EventContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/UI/Alert';
import Button from '../components/UI/Button';

const BookingsPage: React.FC = () => {
  const { state: bookingsState, fetchBookings, cancelBooking } = useBookings();
  const { state: eventsState } = useEvents();
  const { translations } = useLanguage();
  const { state: authState } = useAuth();
  
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchBookings();
    }
  }, [authState.isAuthenticated]);
  
  const getEventDetails = (eventId: string) => {
    return eventsState.events.find(event => event.id === eventId);
  };
  
  // Separate bookings into upcoming and past events
  const now = new Date();
  const upcomingBookings = bookingsState.bookings.filter(booking => {
    const event = getEventDetails(booking.eventId);
    return event && !isBefore(parseISO(event.date), now);
  });
  
  const pastBookings = bookingsState.bookings.filter(booking => {
    const event = getEventDetails(booking.eventId);
    return event && isBefore(parseISO(event.date), now);
  });
  
  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(bookingId);
    }
  };
  
  if (!authState.isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your bookings</h1>
        <Link to="/login">
          <Button>
            {translations['nav.login']}
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2">{translations['bookings.title']}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manage your event bookings and view your upcoming events
        </p>
      </div>
      
      {bookingsState.error && (
        <Alert 
          type="error" 
          message={bookingsState.error} 
          className="mb-6" 
        />
      )}
      
      {bookingsState.isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4">{translations['common.loading']}</p>
        </div>
      ) : bookingsState.bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
            <Ticket size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{translations['bookings.noBookings']}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Browse our events and book your tickets</p>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">{translations['bookings.upcoming']}</h2>
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { 
                    transition: { 
                      staggerChildren: 0.1 
                    } 
                  },
                  hidden: {}
                }}
              >
                {upcomingBookings.map(booking => {
                  const event = getEventDetails(booking.eventId);
                  if (!event) return null;
                  
                  return (
                    <motion.div 
                      key={booking.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                      }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Event Image */}
                        <div className="md:w-1/4 h-32 md:h-auto">
                          <img 
                            src={event.image} 
                            alt={event.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Event Details */}
                        <div className="p-4 flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center">
                                  <Calendar size={14} className="mr-1" />
                                  <span>{format(parseISO(event.date), 'PPP')}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  <span>{format(parseISO(event.date), 'p')}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin size={14} className="mr-1" />
                                  <span>{event.venue}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                              {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="mr-1">Booked on:</span>
                              {format(parseISO(booking.bookingDate), 'PPP')}
                            </div>
                            <div className="flex gap-2">
                              <Link to={`/events/${event.id}`}>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  rightIcon={<ArrowUpRight size={14} />}
                                >
                                  View Event
                                </Button>
                              </Link>
                              <Button 
                                size="sm"
                                variant="danger"
                                leftIcon={<XCircle size={14} />}
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                {translations['bookings.cancelBooking']}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}
          
          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">{translations['bookings.past']}</h2>
              <div className="space-y-4">
                {pastBookings.map(booking => {
                  const event = getEventDetails(booking.eventId);
                  if (!event) return null;
                  
                  return (
                    <div 
                      key={booking.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden opacity-75"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Event Image */}
                        <div className="md:w-1/4 h-32 md:h-auto grayscale">
                          <img 
                            src={event.image} 
                            alt={event.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Event Details */}
                        <div className="p-4 flex-grow">
                          <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              <span>{format(parseISO(event.date), 'PPP')}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="mr-1">Booked on:</span>
                              {format(parseISO(booking.bookingDate), 'PPP')}
                            </div>
                            <Link to={`/events/${event.id}`}>
                              <Button size="sm" variant="outline">
                                View Event
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;