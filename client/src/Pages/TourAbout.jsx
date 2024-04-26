import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../Styles/TourAbout.css";
import BeforeFooter from '../Components/BeforeFooter';
import { fetchOneTour } from '../http/tourApi';
import RatingStars from '../Components/RatingStars/RatingStars';

function TourAbout() {
  const { id } = useParams();
  const [tour, setTour] = useState({});
  console.log("1 : ", tour);
  console.log("2 : ", id);

  useEffect(() => {
    fetchOneTour(id)
      .then(result => {
        setTour(result);
      })
      .catch(error => {
        console.error('Error fetching tour:', error);
      });
  }, [id]);

  return (
    <div className='tour_about_container'>
      <div className='tour_about_container_container'>
        {tour && (
          <>
            <img src={`http://localhost:5000/${tour.img}`} alt="Тур" />
            <h1>{tour.name}</h1>
            <p className='tour_about_rating'>Рейтинг тура: <RatingStars rating={tour.rating}/></p>
            {tour.info && tour.info.length > 0 && (
              <p className='tour_about_info'>{tour.info[0].description}</p>
            )}
            <p className='tour_about_price'>Стоимость тура: {tour.price}</p>
            <button>Добавить в корзину</button>
          </>
        )}
      </div>
      <BeforeFooter/>
    </div>
  );
}

export default TourAbout;
