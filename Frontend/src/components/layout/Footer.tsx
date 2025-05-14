import React from 'react';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-white">EventHub</span>
            </div>
            <p className="mt-4 text-sm">
              Your premier platform for discovering, booking, and managing event experiences. Join us and make memories that last.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-indigo-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/events" className="hover:text-indigo-400 transition-colors">Browse Events</a>
              </li>
              <li>
                <a href="/about" className="hover:text-indigo-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-indigo-400 transition-colors">Contact</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-indigo-400 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="/events?category=conferences" className="hover:text-indigo-400 transition-colors">Conferences</a>
              </li>
              <li>
                <a href="/events?category=workshops" className="hover:text-indigo-400 transition-colors">Workshops</a>
              </li>
              <li>
                <a href="/events?category=concerts" className="hover:text-indigo-400 transition-colors">Concerts</a>
              </li>
              <li>
                <a href="/events?category=sports" className="hover:text-indigo-400 transition-colors">Sports</a>
              </li>
              <li>
                <a href="/events?category=exhibitions" className="hover:text-indigo-400 transition-colors">Exhibitions</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-indigo-400 mt-0.5" />
                <span>123 Event Street, City, Country</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-indigo-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-indigo-400" />
                <span>contact@eventhub.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
          <p className="mt-2">
            <a href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            {' • '}
            <a href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;