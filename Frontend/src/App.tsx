import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import BookingSuccess from './pages/BookingSuccess';

interface RouteConfig {
  path: string;
  component: React.ReactNode;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

function App() {
  const routes: RouteConfig[] = [
    { path: '/', component: <HomePage /> },
    { path: '/login', component: <LoginPage /> },
    { path: '/register', component: <RegisterPage /> },
    { path: '/admin', component: <AdminDashboard />, requiresAuth: true, requiresAdmin: true },
    { path: '/booking-success', component: <BookingSuccess />, requiresAuth: true },
  ];

  // Get current path
  const path = window.location.pathname;
  
  // Find the component that matches the current path
  const route = routes.find(r => r.path === path) || routes[0];

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {route.component}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;