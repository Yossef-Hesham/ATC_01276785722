import React from 'react';
import { Calendar } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import Button from '../components/ui/Button';
import { Event, EVENT_CATEGORIES } from '../types';

// Mock events data for demonstration
const featuredEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join the biggest tech conference of the year with industry leaders and innovators.',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: new Date('2025-09-15'),
    location: 'San Francisco, CA',
    price: 299.99,
    capacity: 1000,
    category: 'professional',
    organizer: 'Tech Events Inc.',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description: 'Three days of amazing music, food, and fun in the heart of the city.',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: new Date('2025-07-10'),
    location: 'Austin, TX',
    price: 149.99,
    capacity: 5000,
    category: 'cultural',
    organizer: 'Festival Productions',
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Wedding Expo 2025',
    description: 'Discover the latest wedding trends and meet top vendors.',
    image: 'https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: new Date('2025-06-22'),
    location: 'Chicago, IL',
    price: 85,
    capacity: 500,
    category: 'social',
    organizer: 'Wedding Planners Association',
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'City Marathon',
    description: 'Annual city marathon with various categories for all skill levels.',
    image: 'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: new Date('2025-05-18'),
    location: 'Boston, MA',
    price: 49.99,
    capacity: 200,
    category: 'sports',
    organizer: 'City Sports Association',
    createdAt: new Date(),
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-indigo-700 text-white overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20" 
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Discover and Book Amazing Events
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Find the perfect events for you, connect with like-minded people, and create lasting memories.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-indigo-800 to-transparent"></div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
              <a
                key={key}
                href={`/events?category=${key}`}
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-center items-center w-12 h-12 mx-auto mb-4 bg-indigo-100 text-indigo-600 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-gray-900">{value}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Button variant="outline" onClick={() => window.location.href = '/events'}>
              View All Events
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Host Your Own Event?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-emerald-100">
            Create, manage, and promote your events with our powerful platform. Reach thousands of potential attendees.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-emerald-700 hover:bg-emerald-50"
            onClick={() => window.location.href = '/create-event'}
          >
            Create an Event
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;