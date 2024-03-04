import React from 'react';
import Tour from './Tour';
import { useSelector } from 'react-redux';

function TourList() {
  const tours = useSelector(state => state.tours.tours);

  return (
    <div>
      {tours.map((tour) => (
        <Tour
          key={tour.id}
          {...tour}
        />
      ))}
    </div>
  );
}

export default TourList;
