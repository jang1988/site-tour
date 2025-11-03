import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Завантаження...", retryCount = 0, maxRetries = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
      <p className="text-gray-600">{message}</p>
      {retryCount > 0 && maxRetries > 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Спроба {retryCount} з {maxRetries}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;