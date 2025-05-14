import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { useEvents } from '../../contexts/EventContext';
import { useBookings } from '../../contexts/BookingContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/UI/Button';

const AdminHome: React.FC = () => {
  const { state: eventsState } = useEvents();
  const { state: bookingsState } = useBookings();
  const { translations } = useLanguage();
  
  // Calculate statistics
  const totalEvents = eventsState.events.length;
  const totalBookings = bookingsState.bookings.length;
  const upcomingEvents = eventsState.events.filter(
    event => new Date(event.date) > new Date()
  ).length;
  
  // Calculate revenue (assuming all bookings are paid)
  const totalRevenue = bookingsState.bookings.reduce((sum, booking) => {
    const event = eventsState.events.find(e => e.id === booking.eventId);
    return sum + (event ? event.price * booking.quantity : 0);
  }, 0);
  
  // Get recent events
  const recentEvents = [...eventsState.events]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{translations['admin.dashboard']}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to your admin dashboard
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Events</p>
              <p className="text-2xl font-bold">{totalEvents}</p>
            </div>
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Upcoming Events</p>
              <p className="text-2xl font-bold">{upcomingEvents}</p>
            </div>
          </div>
        </div>
        
        {/* Total Bookings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
              <Ticket className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
          </div>
        </div>
        
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-4">
              <DollarSign className="h-8 w-8 text-amber-600 dark:text-amber-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/events/create">
            <Button leftIcon={<Calendar size={16} />}>
              Create Event
            </Button>
          </Link>
          <Link to="/admin/events">
            <Button variant="outline" leftIcon={<TrendingUp size={16} />}>
              View All Events
            </Button>
          </Link>
          <Link to="/admin/bookings">
            <Button variant="outline" leftIcon={<Users size={16} />}>
              View Bookings
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Recent Events */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-bold">Recent Events</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {recentEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No events created yet. Create your first event!
            </div>
          ) : (
            recentEvents.map(event => (
              <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={event.image} 
                      alt={event.name} 
                      className="h-12 w-12 rounded object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-medium">{event.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString()} | {event.venue}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Link to={`/admin/events/edit/${event.id}`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;