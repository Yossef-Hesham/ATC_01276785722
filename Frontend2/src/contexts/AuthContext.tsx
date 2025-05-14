import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';

// Mock data - this would be replaced by actual API calls
const MOCK_USERS = [
  { id: '1', username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: '2', username: 'user', email: 'user@example.com', password: 'user123', role: 'user' }
];

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, secretKey?: string) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { ...state, isLoading: false, isAuthenticated: true, user: action.payload, error: null };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    // Simulate API call
    try {
      // In a real app, this would be an API call
      const user = MOCK_USERS.find(u => u.username === username && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: userWithoutPassword as User 
      });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  };

  const register = async (username: string, email: string, password: string, secretKey?: string) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // Validate inputs
      if (!username || !email || !password) {
        throw new Error('All fields are required');
      }
      
      // Check if email already exists
      const emailExists = MOCK_USERS.some(u => u.email === email);
      if (emailExists) {
        throw new Error('Email already registered');
      }
      
      // Check if username already exists
      const usernameExists = MOCK_USERS.some(u => u.username === username);
      if (usernameExists) {
        throw new Error('Username already taken');
      }
      
      // Determine role based on secret key
      const role = secretKey === 'admin123' ? 'admin' : 'user';
      
      // In a real app, this would be an API call to create the user
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        username,
        email,
        role
      };
      
      // Store in localStorage (simulating successful registration)
      localStorage.setItem('user', JSON.stringify(newUser));
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};