import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Search, Filter, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useEvents } from '../contexts/EventContext';
import { useLanguage } from '../contexts/LanguageContext';
import EventCard from '../components/UI/EventCard';
import Button from '../components/UI/Button';

const EventsPage: React.FC = () => {
  const { state, fetchEvents } = useEvents();
  const { translations } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    if (state.events.length === 0) {
      fetchEvents();
    }
  }, []);
  
  useEffect(() => {
    // Update URL when category changes
    if (selectedCategory) {
      searchParams.set('category', selectedCategory);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  }, [selectedCategory]);
  
  // Get all event categories
  const categories = Array.from(new Set(state.events.map(event => event.category)));
  
  // Filter and search events
  const filteredEvents = state.events.filter(event => {
    // Category filter
    if (selectedCategory && event.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchTerm && !event.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2">{translations['events.all']}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Discover and book events from our large catalog
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={translations['events.search']}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={toggleFilters}
              variant="outline"
              leftIcon={<Filter size={16} />}
            >
              {translations['events.filter']}
            </Button>
          </div>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-3">{translations['events.category']}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`text-sm px-3 py-1 rounded-full 
                    ${selectedCategory === null 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                  All
                </button>
                
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-sm px-3 py-1 rounded-full flex items-center 
                      ${selectedCategory === category 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    <Tag size={12} className="mr-1" />
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Events Grid */}
      <div>
        {state.isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4">{translations['common.loading']}</p>
          </div>
        ) : state.error ? (
          <div className="text-red-500 text-center py-12">
            <p>{state.error}</p>
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
            <p className="text-lg mb-2">No events found</p>
            <p className="text-gray-500 dark:text-gray-400">Try changing your search criteria</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { 
                transition: { 
                  staggerChildren: 0.1 
                } 
              },
              hidden: {}
            }}
          >
            {sortedEvents.map(event => (
              <motion.div 
                key={event.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;