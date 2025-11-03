import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ title = "Помилка", message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
      <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
      <div className="flex-1">
        <h3 className="font-bold text-red-800 mb-1">{title}</h3>
        <p className="text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Спробувати знову
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;