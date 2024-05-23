import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import "../Styles/TourAbout.css";
import BeforeFooter from '../Components/BeforeFooter';
import MapComponent from "../Components/GoogleMaps/MapComponent"
import PhotoSlider from '../Components/PhotoSlider/PhotoSlider';
import Rating from '@mui/material/Rating';
import { fetchOneComb } from '../http/combApi';
import { TOURABOUT_ROUTE } from '../utils/consts';

function ComboTourAbout() {
  const { id } = useParams();
  const [combTour, setCombTour] = useState();
  const [isServicesVisible, setIsServicesVisible] = useState(false);

  useEffect(()=>{
      const fetchData = async () => {
          try {
            const result = await fetchOneComb(id);
            if(result){
                setCombTour(result)
              }
          } catch (e) {
            console.log(e.message);
          }
        };
        fetchData();
  },[id])

  const toggleServicesVisibility = () => {
    setIsServicesVisible(!isServicesVisible);
  };

  return (
    <div className='tour_about_container'>
      <div className='tour_about_container_container'>
        {combTour && combTour.hotel&& combTour.tours && (
          <>
            <div className='photo_block_text_container'>
              {combTour.hotel.img && combTour.hotel.img.length > 0 && (
                <div className='tour_about_img'><PhotoSlider imgs={combTour.hotel.img}/></div>
              )}
              <div className='text_block_container'>
                <div>
                  <h1 className='tour_name_h'>{combTour.hotel.name}</h1>
                  {combTour.hotel.location && combTour.hotel.location.length>0 && (
                    <div className='tour_about_map'><MapComponent location={combTour.hotel.location} name = {combTour.hotel.name}/></div>
                  )} 
                  <Rating name="read-only" value={combTour.rating} size="large" readOnly className='rate_stars_info'/>
                  <h2 className='city_block_text'>г.{combTour.hotel.city}</h2>
                </div>
                <div className='price_container'>
                  <div className='valute_tour_about'>
                    <p className='tour_about_price'>{combTour.hotel.price}</p>
                    <p className='valute_text'>BYN</p>
                  </div>
                  <button className='tour_about_button'>Добавить в корзину</button>
                </div>
              </div>
            </div>
            <div>
              {combTour.hotel.info && combTour.hotel.info.length > 0 && (
                <p className='tour_about_info'>{combTour.hotel.info[0].description}</p>
              )}
            </div>
            <hr></hr>
            <div className='toggle_services_container'>
              <button className='toggle_services_button' onClick={toggleServicesVisibility}>
                {isServicesVisible ? 'Скрыть экскурсии' : 'Показать экскурсии'}
              </button>
              {isServicesVisible && (
                <div className='tour_about_services_container'>
                  {combTour.tours.map((tour, index) => (
                    <Link to={`${TOURABOUT_ROUTE}/${tour.id}`} key={tour.id} className="grid-item" style={{ backgroundImage: `url(${'http://localhost:5000/' + tour.img[0]})` }}>
                      <div className='tour_main_info'>
                        <p className='tour_name'>{tour.name}</p>
                        <div className='tour_details'>
                          <div className='price_button_tour'>
                            <p style={{ fontSize: '25px', margin: '0' }}>г.{tour.city}</p>
                            <p className='tour_rating'><Rating name="read-only" value={tour.rating} readOnly /></p>
                          </div>
                          <div className='price_button_tour'>
                            <p className='tour_price'>{tour.price}byn</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <hr></hr>
            <div className='tour_reviews_container'>
              <h2>Отзывы</h2>
            </div>
          </>
        )}
      </div>
      <BeforeFooter/>
    </div>
  );
}

export default ComboTourAbout;
