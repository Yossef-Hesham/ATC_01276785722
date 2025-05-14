import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, state } = useAuth();
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Get redirect location from state if available
  const from = location.state?.from?.pathname || '/';
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    await login(data.username, data.password);
    // After successful login, redirect to the page user was trying to access
    if (!state.error) {
      navigate(from);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{translations['auth.login']}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back! Please log in to continue.
          </p>
        </div>
        
        {state.error && (
          <Alert 
            type="error" 
            message={state.error} 
            className="mb-6" 
          />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {translations['auth.username']}
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.username ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {translations['auth.password']}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`
                  w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  ${errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
                `}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={state.isLoading}
            leftIcon={<LogIn size={18} />}
          >
            {translations['auth.login']}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {translations['auth.noAccount']} {' '}
            <Link to="/register" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
              {translations['auth.register']}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;