import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Calendar, MapPin, Tag, DollarSign, ArrowLeft, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvents } from '../contexts/EventContext';
import { useBookings } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const { hasUserBookedEvent, createBooking } = useBookings();
  const { state: authState } = useAuth();
  const { translations } = useLanguage();
  
  const [event, setEvent] = useState(id ? getEventById(id) : undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const isBooked = id ? hasUserBookedEvent(id) : false;
  
  useEffect(() => {
    if (id) {
      const foundEvent = getEventById(id);
      if (!foundEvent) {
        setError('Event not found');
      } else {
        setEvent(foundEvent);
      }
    }
  }, [id]);
  
  const handleBookEvent = async () => {
    if (!id || !authState.isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await createBooking(id);
      setSuccess(translations['message.bookingSuccess']);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : translations['message.bookingError']);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!event) {
    return (
      <div className="text-center py-12">
        {error ? (
          <div>
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Link to="/events">
              <Button variant="outline" leftIcon={<ArrowLeft size={16} />}>
                {translations['eventDetail.backToEvents']}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
        )}
      </div>
    );
  }
  
  const formattedDate = format(parseISO(event.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(parseISO(event.date), 'h:mm a');
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back navigation */}
      <div className="mb-6">
        <Link 
          to="/events" 
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          {translations['eventDetail.backToEvents']}
        </Link>
      </div>
      
      {/* Alerts */}
      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}
      
      {success && (
        <div className="mb-6">
          <Alert type="success" message={success} />
        </div>
      )}
      
      {/* Event Header */}
      <div className="relative h-80 rounded-xl overflow-hidden mb-8">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center mb-2">
            <Tag size={16} className="text-white mr-2" />
            <span className="text-white text-sm font-medium bg-purple-600 px-3 py-1 rounded-full">
              {event.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{event.name}</h1>
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{translations['eventDetail.about']}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
          
          {/* Additional sections could go here */}
        </motion.div>
        
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Event Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{translations['eventDetail.details']}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar size={18} className="mt-0.5 mr-3 text-purple-500" />
                <div>
                  <h3 className="font-medium">{translations['eventDetail.date']}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin size={18} className="mt-0.5 mr-3 text-purple-500" />
                <div>
                  <h3 className="font-medium">{translations['eventDetail.venue']}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{event.venue}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Tag size={18} className="mt-0.5 mr-3 text-purple-500" />
                <div>
                  <h3 className="font-medium">{translations['eventDetail.category']}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{event.category}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <DollarSign size={18} className="mt-0.5 mr-3 text-purple-500" />
                <div>
                  <h3 className="font-medium">{translations['eventDetail.price']}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {event.price === 0 
                      ? translations['events.free'] 
                      : `$${event.price.toFixed(2)} per ticket`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">{translations['eventDetail.bookEvent']}</h2>
            
            {!authState.isAuthenticated ? (
              <div className="text-center">
                <p className="mb-4">Please log in to book this event</p>
                <Link to="/login" className="block">
                  <Button fullWidth>
                    {translations['nav.login']}
                  </Button>
                </Link>
              </div>
            ) : isBooked ? (
              <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg text-center">
                <p className="font-medium">You have already booked this event!</p>
                <Link to="/bookings" className="text-sm underline mt-2 inline-block">
                  View your bookings
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>1 ticket</span>
                  </div>
                  <div className="font-bold text-base text-gray-900 dark:text-white">
                    {event.price === 0 
                      ? translations['events.free'] 
                      : `$${event.price.toFixed(2)}`
                    }
                  </div>
                </div>
                
                <Button 
                  onClick={handleBookEvent}
                  isLoading={isLoading}
                  fullWidth
                  size="lg"
                >
                  {translations['events.bookNow']}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetailPage;