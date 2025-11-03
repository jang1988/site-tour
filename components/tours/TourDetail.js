import { useState, useEffect } from 'react';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { getPrice, getHotel } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const TourDetail = ({ priceId, hotelId, onBack }) => {
  const [tour, setTour] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [priceRes, hotelRes] = await Promise.all([
          getPrice(priceId),
          getHotel(parseInt(hotelId))
        ]);
        const priceData = await priceRes.json();
        const hotelData = await hotelRes.json();
        setTour(priceData);
        setHotel(hotelData);
      } catch (err) {
        console.error('Failed to load tour details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [priceId, hotelId]);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('uk-UA').format(amount);
  };

  const serviceIcons = {
    wifi: '📶 Wi-Fi',
    aquapark: '🌊 Аквапарк',
    tennis_court: '🎾 Тенісний корт',
    laundry: '🧺 Пральня',
    parking: '🚗 Парковка'
  };

  if (loading) {
    return <LoadingSpinner message="Завантаження деталей туру..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
      <button 
        onClick={onBack} 
        className="m-4 text-blue-500 hover:text-blue-600 flex items-center gap-2"
      >
        ← Назад до результатів
      </button>
      
      <img 
        src={hotel.img} 
        alt={hotel.name} 
        className="w-full h-64 object-cover" 
      />
      
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{hotel.name}</h1>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-5 h-5" />
          <span className="text-lg">{hotel.countryName}, {hotel.cityName}</span>
        </div>
        
        <p className="text-gray-700 mb-6">{hotel.description}</p>
        
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3 text-gray-800">Сервіси та зручності</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(hotel.services).map(([key, value]) => (
              value !== 'none' && (
                <div key={key} className="flex items-center gap-2 text-gray-700">
                  <span>{serviceIcons[key]}</span>
                </div>
              )
            ))}
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <Calendar className="w-5 h-5" />
            <span className="text-lg">Дата початку: {formatDate(tour.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Calendar className="w-5 h-5" />
            <span className="text-lg">Дата закінчення: {formatDate(tour.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <span className="text-3xl font-bold text-gray-800">
              {formatPrice(tour.amount)}
            </span>
            <span className="text-gray-500 text-xl">USD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;