import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import "../Styles/Tours.css";
import { useSelector, useDispatch } from 'react-redux';
import { fetchToursAsync } from '../Redux/tourSlice';

const Tours = () => {
  const [showFilters, setShowFilters] = useState(false);
  const tours = useSelector(state => state.tour.tours);
  const dispatch = useDispatch();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    dispatch(fetchToursAsync());
  }, [dispatch]);

  return (
    <div className="container">
      <Navbar />
      <div className='tour_main_container'>
        <div className='search_filter_container'>
          <div className="filter">
            <button className="filter_btn" onClick={toggleFilters}>Фильтры</button>
          </div>
          <input className='search' type="text" placeholder="Поиск..." />
        </div>
        <div className='filter_tours_container'>
          {showFilters && (
            <div className="filters_panel">
              <p>Фильтр 1</p>
              <p>Фильтр 2</p>
              <p>Фильтр 3</p>
              <p>Фильтр 1</p>
              <p>Фильтр 2</p>
              <p>Фильтр 3</p>
            </div>
          )}
          <div className="grid-container">
            {tours.map(tour => (
              <div key={tour.id} className="grid-item">
                <p>{tour.name}</p>
                <p>{tour.description}</p>
                <p>{tour.price}</p>
                <p>{tour.rating}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tours;
