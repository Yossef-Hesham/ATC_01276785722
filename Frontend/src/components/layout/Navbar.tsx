import React, { useState } from 'react';
import { Menu, X, Search, User, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">EventHub</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </a>
            <a href="/events" className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
              Events
            </a>
            <a href="/about" className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
              About
            </a>
            <a href="/contact" className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="pl-9 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <a href="/dashboard" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <User className="h-5 w-5 mr-1" />
                  <span>{user.name}</span>
                </a>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>Login</Button>
                <Button size="sm" onClick={() => window.location.href = '/register'}>Sign Up</Button>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 px-4 space-y-1 sm:px-3 border-t border-gray-200">
          <a href="/" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
            Home
          </a>
          <a href="/events" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
            Events
          </a>
          <a href="/about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
            About
          </a>
          <a href="/contact" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
            Contact
          </a>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Search events..."
                className="pl-9 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-7 h-4 w-4 text-gray-400" />
            </div>
            
            {user ? (
              <div className="space-y-2">
                <a href="/dashboard" className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
                  <User className="h-5 w-5 mr-1" />
                  <span>{user.name}</span>
                </a>
                <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/login'}>Login</Button>
                <Button className="w-full" onClick={() => window.location.href = '/register'}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;