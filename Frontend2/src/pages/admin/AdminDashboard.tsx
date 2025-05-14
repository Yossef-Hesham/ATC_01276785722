import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { useBookings } from '../../contexts/BookingContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminDashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: eventsState } = useEvents();
  const { state: bookingsState } = useBookings();
  const { translations } = useLanguage();
  
  // Redirect non-admin users
  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2">{translations['message.unauthorizedAction']}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">You must be an admin to access this area</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <aside className="md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 h-auto md:h-[calc(100vh-10rem)] sticky top-24">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-xl font-bold">{translations['admin.dashboard']}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your events platform
            </p>
          </div>
          
          <nav className="space-y-2 flex-grow">
            <Link
              to="/admin"
              className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-md"
            >
              <LayoutDashboard size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
              Dashboard
            </Link>
            
            <Link
              to="/admin/events"
              className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-md"
            >
              <Calendar size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
              {translations['admin.events']}
            </Link>
            
            <Link
              to="/admin/bookings"
              className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded-md"
            >
              <Users size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
              {translations['admin.bookings']}
            </Link>
          </nav>
          
          <div className="pt-4 mt-auto">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider mb-2">
                System Status
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Events</div>
                  <div className="text-purple-600 dark:text-purple-400 font-bold">
                    {eventsState.events.length}
                  </div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Bookings</div>
                  <div className="text-purple-600 dark:text-purple-400 font-bold">
                    {bookingsState.bookings.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;