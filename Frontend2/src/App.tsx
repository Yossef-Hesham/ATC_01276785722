import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { EventProvider } from './contexts/EventContext';
import { BookingProvider } from './contexts/BookingContext';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventForm from './pages/admin/AdminEventForm';
import AdminBookings from './pages/admin/AdminBookings';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location }} />;
  }
  
  return <>{children}</>;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location }} />;
  }
  
  if (state.user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <EventProvider>
              <BookingProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="events/:id" element={<EventDetailPage />} />
                    <Route 
                      path="bookings" 
                      element={
                        <ProtectedRoute>
                          <BookingsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    
                    {/* Admin Routes */}
                    <Route 
                      path="admin" 
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    >
                      <Route index element={<AdminHome />} />
                      <Route path="events" element={<AdminEvents />} />
                      <Route path="events/create" element={<AdminEventForm />} />
                      <Route path="events/edit/:id" element={<AdminEventForm />} />
                      <Route path="bookings" element={<AdminBookings />} />
                    </Route>
                  </Route>
                </Routes>
              </BookingProvider>
            </EventProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;