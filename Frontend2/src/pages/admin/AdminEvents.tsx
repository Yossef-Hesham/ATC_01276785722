import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Calendar, DollarSign, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useEvents } from '../../contexts/EventContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/UI/Button';
import Alert from '../../components/UI/Alert';

const AdminEvents: React.FC = () => {
  const { state, deleteEvent } = useEvents();
  const { translations } = useLanguage();
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleEdit = (eventId: string) => {
    navigate(`/admin/events/edit/${eventId}`);
  };
  
  const handleDelete = async (eventId: string) => {
    if (confirm(translations['admin.deleteConfirm'])) {
      setDeletingId(eventId);
      setError(null);
      
      try {
        await deleteEvent(eventId);
        setSuccess(translations['message.eventDeleteSuccess']);
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete event');
      } finally {
        setDeletingId(null);
      }
    }
  };
  
  const handleCreate = () => {
    navigate('/admin/events/create');
  };
  
  // Sort events by date (newest first)
  const sortedEvents = [...state.events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{translations['admin.events']}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create, edit and manage your events
          </p>
        </div>
        <Button 
          onClick={handleCreate} 
          leftIcon={<Plus size={16} />}
        >
          {translations['admin.createEvent']}
        </Button>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          className="mb-6" 
          onClose={() => setError(null)}
        />
      )}
      
      {success && (
        <Alert 
          type="success" 
          message={success} 
          className="mb-6" 
          onClose={() => setSuccess(null)}
        />
      )}
      
      {state.isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4">{translations['common.loading']}</p>
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-lg mb-4">No events found</p>
          <Button onClick={handleCreate}>Create your first event</Button>
        </div>
      ) : (
        <motion.div 
          className="overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Venue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedEvents.map(event => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img src={event.image} alt={event.name} className="h-10 w-10 rounded-md object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{event.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {event.description.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      {format(parseISO(event.date), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {format(parseISO(event.date), 'h:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <MapPin size={14} className="mr-1 text-gray-500" />
                      {event.venue}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <DollarSign size={14} className="mr-1 text-gray-500" />
                      {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event.id)}
                        leftIcon={<Edit size={14} />}
                      >
                        {translations['common.edit']}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        isLoading={deletingId === event.id}
                        leftIcon={<Trash2 size={14} />}
                      >
                        {translations['common.delete']}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminEvents;