import React from 'react';
import TourCard from './TourCard';

const TourList = ({ tours, hotels, onTourSelect }) => {
  if (tours.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">За вашим запитом турів не знайдено</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '25px' }}>
      <div className="grid gap-6" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        {tours.map((tour) => {
          const hotel = hotels[tour.hotelID];
          return hotel ? (
            <TourCard
              key={tour.id}
              tour={tour}
              hotel={hotel}
              onClick={() => onTourSelect({ 
                priceId: tour.id, 
                hotelId: tour.hotelID 
              })}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default TourList;