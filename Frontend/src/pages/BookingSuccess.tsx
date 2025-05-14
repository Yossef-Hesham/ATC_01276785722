import React from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const BookingSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Booking Confirmed!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Your event booking has been successfully confirmed. We look forward to seeing you there!
        </p>
        <div className="mt-8 space-y-4">
          <Button
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/my-bookings'}
          >
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;