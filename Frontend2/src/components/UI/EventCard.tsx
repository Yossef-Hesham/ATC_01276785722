import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Event } from '../../types';
import { useBookings } from '../../contexts/BookingContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { translations } = useLanguage();
  const { hasUserBookedEvent } = useBookings();
  const { state: authState } = useAuth();
  
  const isBooked = hasUserBookedEvent(event.id);
  const formattedDate = formatDistanceToNow(parseISO(event.date), { addSuffix: true });
  
  return (
    <div className="group h-full flex flex-col overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800 bg-white">
      {/* Image container with overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        
        {/* Category tag */}
        <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
          <Tag size={12} className="mr-1" />
          {event.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow flex flex-col p-5">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.name}</h3>
        
        <div className="flex flex-col gap-2 mb-4 text-sm">
          <div className="flex items-start">
            <Calendar size={16} className="mt-0.5 mr-2 text-purple-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-start">
            <MapPin size={16} className="mt-0.5 mr-2 text-purple-500" />
            <span>{event.venue}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        {/* Price and buttons */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="font-bold">
            {event.price === 0 ? (
              <span className="text-green-600 dark:text-green-400">
                {translations['events.free']}
              </span>
            ) : (
              <span>${event.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Link 
              to={`/events/${event.id}`} 
              className="text-sm px-3 py-1.5 rounded border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
            >
              {translations['events.details']}
            </Link>
            
            {authState.isAuthenticated && (
              isBooked ? (
                <span className="text-sm px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 cursor-default">
                  {translations['events.booked']}
                </span>
              ) : (
                <Link 
                  to={`/events/${event.id}`} 
                  className="text-sm px-3 py-1.5 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  {translations['events.bookNow']}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;