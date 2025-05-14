import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, translations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
    closeMenu();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md text-white w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold" onClick={closeMenu}>
              EventHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-white/80 transition ${isActive('/') ? 'font-semibold' : ''}`}
            >
              {translations['nav.home']}
            </Link>
            <Link 
              to="/events" 
              className={`hover:text-white/80 transition ${isActive('/events') ? 'font-semibold' : ''}`}
            >
              {translations['nav.events']}
            </Link>
            
            {state.isAuthenticated ? (
              <>
                <Link 
                  to="/bookings" 
                  className={`hover:text-white/80 transition ${isActive('/bookings') ? 'font-semibold' : ''}`}
                >
                  {translations['nav.myBookings']}
                </Link>
                
                {state.user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`hover:text-white/80 transition ${isActive('/admin') ? 'font-semibold' : ''}`}
                  >
                    {translations['nav.admin']}
                  </Link>
                )}
                
                <div className="border-l border-white/30 h-6"></div>
                
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full hover:bg-white/10 transition"
                  aria-label={isDarkMode ? translations['common.lightMode'] : translations['common.darkMode']}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                <button 
                  onClick={toggleLanguage} 
                  className="p-2 rounded-full hover:bg-white/10 transition"
                  aria-label={language === 'en' ? translations['common.arabic'] : translations['common.english']}
                >
                  <Globe size={20} />
                </button>
                
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <LogOut size={16} />
                  <span>{translations['nav.logout']}</span>
                </button>
              </>
            ) : (
              <>
                <div className="border-l border-white/30 h-6"></div>
                
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full hover:bg-white/10 transition"
                  aria-label={isDarkMode ? translations['common.lightMode'] : translations['common.darkMode']}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                <button 
                  onClick={toggleLanguage} 
                  className="p-2 rounded-full hover:bg-white/10 transition"
                  aria-label={language === 'en' ? translations['common.arabic'] : translations['common.english']}
                >
                  <Globe size={20} />
                </button>
                
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full hover:bg-white/10 transition"
                >
                  {translations['nav.login']}
                </Link>
                
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-white text-purple-600 hover:bg-white/90 transition"
                >
                  {translations['nav.register']}
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="py-2" onClick={closeMenu}>
                {translations['nav.home']}
              </Link>
              <Link to="/events" className="py-2" onClick={closeMenu}>
                {translations['nav.events']}
              </Link>
              
              {state.isAuthenticated ? (
                <>
                  <Link to="/bookings" className="py-2" onClick={closeMenu}>
                    {translations['nav.myBookings']}
                  </Link>
                  
                  {state.user?.role === 'admin' && (
                    <Link to="/admin" className="py-2" onClick={closeMenu}>
                      {translations['nav.admin']}
                    </Link>
                  )}
                  
                  <hr className="border-white/20" />
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={toggleTheme} 
                      className="p-2 rounded-full hover:bg-white/10 transition"
                      aria-label={isDarkMode ? translations['common.lightMode'] : translations['common.darkMode']}
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    
                    <button 
                      onClick={toggleLanguage} 
                      className="p-2 rounded-full hover:bg-white/10 transition"
                      aria-label={language === 'en' ? translations['common.arabic'] : translations['common.english']}
                    >
                      <Globe size={20} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-1 py-2"
                  >
                    <LogOut size={16} />
                    <span>{translations['nav.logout']}</span>
                  </button>
                </>
              ) : (
                <>
                  <hr className="border-white/20" />
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={toggleTheme} 
                      className="p-2 rounded-full hover:bg-white/10 transition"
                      aria-label={isDarkMode ? translations['common.lightMode'] : translations['common.darkMode']}
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    
                    <button 
                      onClick={toggleLanguage} 
                      className="p-2 rounded-full hover:bg-white/10 transition"
                      aria-label={language === 'en' ? translations['common.arabic'] : translations['common.english']}
                    >
                      <Globe size={20} />
                    </button>
                  </div>
                  
                  <Link to="/login" className="py-2" onClick={closeMenu}>
                    {translations['nav.login']}
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="py-2 px-4 bg-white text-purple-600 rounded-full text-center"
                    onClick={closeMenu}
                  >
                    {translations['nav.register']}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;