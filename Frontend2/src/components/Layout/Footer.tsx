import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Mail, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { translations } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white">EventHub</Link>
            <p className="mt-4 text-sm text-gray-400">
              Discover and book the best events in your area. From concerts to workshops, we've got you covered.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  {translations['nav.home']}
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition">
                  {translations['nav.events']}
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-white transition">
                  {translations['nav.myBookings']}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Event Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Event Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=Music" className="text-gray-400 hover:text-white transition">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technology" className="text-gray-400 hover:text-white transition">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/events?category=Business" className="text-gray-400 hover:text-white transition">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/events?category=Food" className="text-gray-400 hover:text-white transition">
                  Food
                </Link>
              </li>
              <li>
                <Link to="/events?category=Art" className="text-gray-400 hover:text-white transition">
                  Art
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Calendar size={16} className="text-purple-400" />
                <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-purple-400" />
                <span>123 Event Street, City</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-purple-400" />
                <a href="mailto:support@eventhub.com" className="hover:text-white transition">
                  support@eventhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} EventHub. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-sm text-gray-500 flex items-center">
              Made with <Heart size={14} className="text-red-500 mx-1" /> for event lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;