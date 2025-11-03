import React from 'react';
import { Search } from 'lucide-react';
import GeoAutocomplete from './GeoAutocomplete';

const SearchForm = ({ 
  selectedDestination, 
  onDestinationChange, 
  onSearch, 
  isLoading = false 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Напрямок подорожі
        </label>
        <div onKeyPress={handleKeyPress}>
          <GeoAutocomplete
            value={selectedDestination}
            onChange={() => {}}
            onSelect={onDestinationChange}
          />
        </div>
      </div>
      
      <button
        type="button"
        onClick={onSearch}
        disabled={!selectedDestination || isLoading}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
      >
        <Search className="w-5 h-5" />
        {isLoading ? 'Пошук...' : 'Знайти'}
      </button>
    </div>
  );
};

export default SearchForm;