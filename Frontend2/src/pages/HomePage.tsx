import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvents } from '../contexts/EventContext';
import { useLanguage } from '../contexts/LanguageContext';
import EventCard from '../components/UI/EventCard';
import Button from '../components/UI/Button';

const HomePage: React.FC = () => {
  const { state, fetchEvents } = useEvents();
  const { translations } = useLanguage();
  
  useEffect(() => {
    if (state.events.length === 0) {
      fetchEvents();
    }
  }, []);
  
  // Get the 3 most recent events for the featured section
  const featuredEvents = [...state.events]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  // Get all event categories
  const categories = Array.from(new Set(state.events.map(event => event.category)));
  
  // Hero section animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mt-8 mb-16 py-24 px-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-b-3xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              Discover Amazing Events Near You
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-purple-100 mb-8 max-w-lg"
              variants={itemVariants}
            >
              Find and book tickets for concerts, workshops, conferences, and more happening in your area.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
              variants={itemVariants}
            >
              <Link to="/events">
                <Button 
                  size="lg" 
                  rightIcon={<ArrowRight />}
                  className="shadow-lg shadow-purple-900/20"
                >
                  Browse Events
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Register Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-2/5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative shadow-2xl rounded-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Event" 
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent flex items-end">
                <div className="p-6">
                  <div className="flex items-center mb-3 text-sm text-purple-100">
                    <Calendar size={16} className="mr-2" />
                    <span>This Weekend</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Music Festival 2025</h3>
                  <p className="text-sm text-purple-100">Riverside Amphitheater</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Search Bar Section */}
      <section className="container mx-auto -mt-8 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transform -translate-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={translations['events.search']}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
              />
            </div>
            <div className="flex-shrink-0">
              <Link to="/events">
                <Button fullWidth>{translations['events.filter']}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{translations['events.title']}</h2>
          <Link to="/events" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center">
            {translations['events.all']}
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {state.isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4">{translations['common.loading']}</p>
          </div>
        ) : state.error ? (
          <div className="text-red-500 text-center py-12">
            <p>{state.error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map(event => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
      
      {/* Categories Section */}
      <section className="container mx-auto py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Browse By Category</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover events based on your interests and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/events?category=${category}`}
              className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center shadow hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 dark:text-purple-300 text-xl font-bold">
                  {category.charAt(0)}
                </span>
              </div>
              <h3 className="font-medium">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Host Your Own Event?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our platform as an event organizer and reach thousands of potential attendees.
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-purple-700 hover:bg-purple-50 focus:ring-white"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;