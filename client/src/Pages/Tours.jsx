// Tours.js
import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import "../Styles/Tours.css";

const Tours = () => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

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
            <div className="grid-item">Элемент 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tours;
