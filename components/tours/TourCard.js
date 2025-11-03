import React from 'react';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

const TourCard = ({ tour, hotel, onClick }) => {
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('uk-UA').format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={hotel.img} 
        alt={hotel.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{hotel.name}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>{hotel.countryName}, {hotel.cityName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(tour.startDate)} - {formatDate(tour.endDate)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-800">
              {formatPrice(tour.amount)}
            </span>
            <span className="text-gray-500 text-sm">USD</span>
          </div>
        </div>
        
        <button
          onClick={onClick}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Відкрити ціну
        </button>
      </div>
    </div>
  );
};

export default TourCard;