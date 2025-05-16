import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  secretKey: z.string().optional(),
  role: z.enum(['user', 'admin'])
}).superRefine((data, ctx) => {
  if (data.role === 'admin' && !data.secretKey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['secretKey'],
      message: 'Secret key is required for admin registration'
    });
  }
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser, state } = useAuth();
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const defaultRole = location.pathname.includes('admin/register') ? 'admin' : 'user';
  const [registrationType, setRegistrationType] = useState<'user' | 'admin'>(defaultRole);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const success = await registerUser(
      data.username,
      data.email,
      data.password,
      data.role === 'admin' ? data.secretKey : undefined,
      data.role
    );
    
    if (success) {
      navigate(data.role === 'admin' ? '/admin' : '/');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRoleChange = (role: 'user' | 'admin') => {
    setRegistrationType(role);
    setValue('role', role);
    setValue('secretKey', '');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            {registrationType === 'admin' 
              ? translations['auth.registerAdmin'] || 'Admin Registration'
              : translations['auth.register'] || 'Register'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {registrationType === 'admin'
              ? 'Create a new admin account'
              : 'Create a new user account'}
          </p>
        </div>
        
        {state.error && (
          <Alert 
            type="error" 
            message={state.error} 
            className="mb-6" 
          />
        )}

        {!location.pathname.includes('admin/register') && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {translations['auth.registerAs'] || 'Register as'}
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`
                  flex-1 py-2 px-4 rounded-md flex items-center justify-center
                  ${registrationType === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                `}
              >
                <User size={18} className="mr-2" />
                {translations['auth.registerAsUser'] || 'User'}
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`
                  flex-1 py-2 px-4 rounded-md flex items-center justify-center
                  ${registrationType === 'admin' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                `}
              >
                <ShieldCheck size={18} className="mr-2" />
                {translations['auth.registerAsAdmin'] || 'Admin'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input
            type="hidden"
            {...register('role')}
            value={registrationType}
          />
          
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {translations['auth.username'] || 'Username'}
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
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
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {translations['auth.email'] || 'Email'}
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {translations['auth.password'] || 'Password'}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`
                  w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
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
          
          {registrationType === 'admin' && (
            <div>
              <label 
                htmlFor="secretKey" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {translations['auth.secretKey'] || 'Admin Secret Key'}
              </label>
              <input
                id="secretKey"
                type="password"
                {...register('secretKey')}
                className={`
                  w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  ${errors.secretKey ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}
                `}
              />
              {errors.secretKey && (
                <p className="mt-1 text-sm text-red-500">{errors.secretKey.message}</p>
              )}
            </div>
          )}
          
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={state.isLoading}
            leftIcon={registrationType === 'admin' ? <ShieldCheck size={18} /> : <UserPlus size={18} />}
          >
            {registrationType === 'admin'
              ? translations['auth.registerAdmin'] || 'Register Admin'
              : translations['auth.register'] || 'Register'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {translations['auth.haveAccount'] || 'Already have an account?'} {' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              {translations['auth.login'] || 'Login'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;