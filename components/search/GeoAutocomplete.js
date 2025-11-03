import React, { useState, useEffect, useRef } from 'react';
import { Globe, Building2, Hotel, ChevronDown } from 'lucide-react';
import { getCountries, searchGeo } from '../../services/api';

const GeoAutocomplete = ({ value, onChange, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(value?.name || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value?.name || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadOptions = async (query) => {
    try {
      let response;
      if (!query) {
        response = await getCountries();
      } else {
        response = await searchGeo(query);
      }
      const data = await response.json();
      setOptions(Object.values(data));
    } catch (err) {
      console.error('Failed to load options:', err);
    }
  };

  const handleFocus = async () => {
    setIsOpen(true);
    if (value?.type === 'country') {
      await loadOptions('');
    } else if (value) {
      await loadOptions(inputValue);
    } else {
      await loadOptions('');
    }
  };

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setIsOpen(true);
    await loadOptions(val);
  };

  const handleSelect = (option) => {
    setInputValue(option.name);
    onSelect(option);
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'country': return <Globe className="w-4 h-4 text-blue-500" />;
      case 'city': return <Building2 className="w-4 h-4 text-green-500" />;
      case 'hotel': return <Hotel className="w-4 h-4 text-purple-500" />;
      default: return <Globe className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Оберіть напрямок"
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && options.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={`${option.type}-${option.id}`}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
            >
              {getIcon(option.type)}
              <span className="text-gray-800">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeoAutocomplete;