import React from 'react';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import Card from '../ui/Card';
import { Event, EVENT_CATEGORIES } from '../../types';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { user } = useAuth();
  const isBooked = event.bookedBy?.includes(user?.id || '');
  
  // Format date
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleBooking = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          eventId: event.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        window.location.href = '/booking-success';
      }
    } catch (error) {
      console.error('Error booking event:', error);
    }
  };

  return (
    <Card className="h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">
          {EVENT_CATEGORIES[event.category]}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
            <span>{event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-indigo-500" />
            <span>{event.capacity} spots</span>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{event.description}</p>
      </div>
      
      <div className="px-4 pb-4 mt-auto">
        {isBooked ? (
          <div className="w-full py-2 px-4 bg-emerald-100 text-emerald-800 text-center rounded-md font-medium">
            Booked
          </div>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleBooking}
          >
            Book Now
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EventCard;