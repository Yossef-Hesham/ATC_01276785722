import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X, ArrowLeft } from 'lucide-react';
import { useEvents } from '../../contexts/EventContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/UI/Button';
import Alert from '../../components/UI/Alert';

const eventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(3, 'Venue must be at least 3 characters'),
  price: z.string().transform(val => Number(val)),
  image: z.string().url('Must be a valid URL')
});

type EventFormValues = z.infer<typeof eventSchema>;

const AdminEventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, createEvent, updateEvent } = useEvents();
  const { translations } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const isEditMode = !!id;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      price: '0'
    }
  });
  
  // Load event data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const event = getEventById(id);
      if (event) {
        // Format date for datetime-local input
        const dateObj = new Date(event.date);
        const formattedDate = dateObj.toISOString().slice(0, 16);
        
        reset({
          ...event,
          date: formattedDate,
          price: event.price.toString()
        });
      } else {
        setError('Event not found');
      }
    }
  }, [isEditMode, id]);
  
  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isEditMode && id) {
        await updateEvent(id, {
          ...data,
          price: Number(data.price)
        });
        setSuccess(translations['message.eventUpdateSuccess']);
      } else {
        await createEvent({
          ...data,
          price: Number(data.price)
        });
        setSuccess(translations['message.eventCreateSuccess']);
      }
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/events');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/events');
  };
  
  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin/events')}
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to events
        </button>
        <h1 className="text-2xl font-bold mt-2">
          {isEditMode ? translations['admin.editEvent'] : translations['admin.createEvent']}
        </h1>
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
        />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations['admin.eventName']} *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations['admin.eventCategory']} *
            </label>
            <input
              id="category"
              type="text"
              {...register('category')}
              className={`
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.category ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
              `}
              placeholder="e.g. Music, Technology, Business"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations['admin.eventDate']} *
            </label>
            <input
              id="date"
              type="datetime-local"
              {...register('date')}
              className={`
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.date ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations['admin.eventVenue']} *
            </label>
            <input
              id="venue"
              type="text"
              {...register('venue')}
              className={`
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.venue ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.venue && (
              <p className="mt-1 text-sm text-red-500">{errors.venue.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations['admin.eventPrice']} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">$</span>
              </div>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price')}
                className={`
                  w-full pl-7 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  ${errors.price ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
                `}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations['admin.eventImage']} *
            </label>
            <input
              id="image"
              type="text"
              {...register('image')}
              className={`
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.image ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
              `}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {translations['admin.eventDescription']} *
          </label>
          <textarea
            id="description"
            rows={5}
            {...register('description')}
            className={`
              w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white
              ${errors.description ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            leftIcon={<X size={16} />}
          >
            {translations['admin.cancel']}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            leftIcon={<Save size={16} />}
          >
            {translations['admin.save']}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventForm;