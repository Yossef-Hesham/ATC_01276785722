import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, User, Clock, CheckCircle, AlignJustify } from 'lucide-react';
import { useBookings } from '../../contexts/BookingContext';
import { useEvents } from '../../contexts/EventContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminBookings: React.FC = () => {
  const { state: bookingsState } = useBookings();
  const { state: eventsState } = useEvents();
  const { translations } = useLanguage();
  
  const getEventDetails = (eventId: string) => {
    return eventsState.events.find(event => event.id === eventId);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{translations['admin.bookings']}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View all bookings made by users
        </p>
      </div>
      
      {bookingsState.isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4">{translations['common.loading']}</p>
        </div>
      ) : bookingsState.bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 mb-4">
            <AlignJustify size={24} className="text-gray-500 dark:text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
          <p className="text-gray-600 dark:text-gray-300">Bookings will appear here once users start booking events</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Booking ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Booking Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Event Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tickets
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {bookingsState.bookings.map(booking => {
                const event = getEventDetails(booking.eventId);
                if (!event) return null;
                
                const isUpcoming = new Date(event.date) > new Date();
                
                return (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      #{booking.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm">{booking.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0">
                          <img src={event.image} alt={event.name} className="h-8 w-8 rounded object-cover" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">{event.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{event.venue}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Clock size={14} className="mr-1 text-gray-500" />
                        {format(parseISO(booking.bookingDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(parseISO(booking.bookingDate), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Calendar size={14} className="mr-1 text-gray-500" />
                        {format(parseISO(event.date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(parseISO(event.date), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {booking.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isUpcoming ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                          <CheckCircle size={12} className="mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;