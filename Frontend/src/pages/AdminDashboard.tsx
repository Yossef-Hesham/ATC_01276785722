import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Event, EVENT_CATEGORIES, EventCategory } from '../types';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<EventCategory>('social');
  const [image, setImage] = useState<File | null>(null);

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setDate('');
    setVenue('');
    setPrice('');
    setCategory('social');
    setImage(null);
    setCurrentEvent(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('Date', new Date(date).toISOString());
    formData.append('Venue', venue);
    formData.append('Price', price);
    formData.append('category', category);
    if (image) {
      formData.append('Image', image);
    }

    try {
      const response = await fetch(`/api/events${isEditing ? `/${currentEvent?.id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchEvents();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events');
    }
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setName(event.Name);
    setDescription(event.Description);
    setDate(new Date(event.Date).toISOString().split('T')[0]);
    setVenue(event.Venue);
    setPrice(event.Price.toString());
    setCategory(event.category);
    setIsEditing(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchEvents();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  // Redirect if not admin
  if (user?.role !== 'admin') {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsEditing(false)}>
          <Plus className="h-5 w-5 mr-2" />
          Create New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Form */}
        <Card className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Event' : 'Create Event'}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
              />

              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="text"
                placeholder="Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full p-2 border rounded"
                required
              >
                {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          {events.map(event => (
            <Card key={event.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{event.Name}</h3>
                  <p className="text-gray-600">{event.Description}</p>
                  <div className="mt-2 space-y-1">
                    <p>Date: {new Date(event.Date).toLocaleString()}</p>
                    <p>Venue: {event.Venue}</p>
                    <p>Price: ${parseFloat(event.Price).toFixed(2)}</p>
                    <p>Category: {EVENT_CATEGORIES[event.category]}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleEdit(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;