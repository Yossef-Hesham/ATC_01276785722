import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  duration?: number; // in milliseconds, if provided the alert will auto-dismiss
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, duration, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  const alertStyles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-800 dark:text-red-200',
      icon: <XCircle className="h-5 w-5 text-red-500" />
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-500',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="h-5 w-5 text-blue-500" />
    }
  };
  
  const { bg, border, text, icon } = alertStyles[type];
  
  return (
    <div className={`${bg} ${border} border-l-4 p-4 rounded-md shadow-sm`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className={`${text} ml-3 mr-6 flex-1`}>
          <p>{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Alert;