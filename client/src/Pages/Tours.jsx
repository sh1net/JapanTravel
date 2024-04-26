import React, { useState } from 'react';
import "../Styles/Tours.css";
import BeforeFooter from '../Components/BeforeFooter'
import TourCategory from './Category/TourCategory';
import HotelCategory from './Category/HotelCategory';

const Tours = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchObject,setSearchObject] = useState('');
  const [activeCategory, setActiveCategory] = useState('places');

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearchChange = (e) => {
    setSearchObject(e.target.value)
  }
  
  return (
    <div className="tour_page_container">
      <div className='tour_main_container'>
        <div className='search_filter_container'>
          <div className="filter">
            <button className="filter_btn" onClick={toggleFilters}>Фильтры</button>
          </div>
          <input 
            className='search' 
            type="text" 
            placeholder="Поиск..."
            value={searchObject}
            onChange={handleSearchChange} 
          />
        </div>
        <div className="category_buttons">
          <button onClick={() => setActiveCategory('places')} className='category_button'>Достопримечательности</button>
          <button onClick={() => setActiveCategory('hotels')} className='category_button'>Отели</button>
          <button onClick={() => setActiveCategory('tours')} className='category_button'>Туры</button>
        </div>
        <div className='filter_tours_container'>
          {showFilters && (
            <div className="filters_panel">
              <p>Город</p>
              <p>Отель</p>
              <p>Стоимость</p>
              <p>Рейтинг</p>
              <p>Отсавшиеся билеты на дату</p>
              <p>Промежуточная дата</p>
            </div>
          )}
        </div>
        {activeCategory === 'places' ?
          <TourCategory searchObject={searchObject} setSearchObject={setSearchObject}/>
          :
          <></>
        }

        {activeCategory === 'hotels' ?
          <HotelCategory searchObject={searchObject} setSearchObject={setSearchObject}/>
          :
          <></>
        }
      </div>
      <BeforeFooter/>
    </div>
  );
}

export default Tours;
