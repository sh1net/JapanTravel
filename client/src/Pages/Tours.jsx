import React, { useState } from 'react';
import "../Styles/Tours.css";
import BeforeFooter from '../Components/BeforeFooter'
// import { FaFilter } from "react-icons/fa";
// import { FaSortAlphaDown } from "react-icons/fa";
// import { FaSortAlphaUp } from "react-icons/fa";
// import { FaSortNumericDown } from "react-icons/fa";
// import { FaSortNumericDownAlt } from "react-icons/fa";
import { FaFilter, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericDownAlt } from "react-icons/fa";
import Category from './Category';
import { fetchToursAsync, selectTours } from '../Redux/tourSlice';
import { fetchHotelsAsync, selectHotels } from '../Redux/hotelSlice';
import { fetchCombToursAsync, selectCombTours } from '../Redux/combSlice';
import { TOURABOUT_ROUTE, HOTELABOUT_ROUTE, COMBTOURABOUT_ROUTE } from '../utils/consts';


const Tours = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchObject,setSearchObject] = useState('');
  const [activeCategory, setActiveCategory] = useState('places');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const [sortType,setSortType] = useState('')

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearchChange = (e) => {
    setSearchObject(e.target.value)
  }

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };
  
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
          <div className="filter-icons" onMouseEnter={toggleSortOptions} onMouseLeave={toggleSortOptions}>
            <FaFilter style={{ color: 'white', cursor: 'pointer' }} />
            {showSortOptions && (
              <div className="sort-options">
                <div className='sorted_text'>
                  <FaSortAlphaDown className='sorted_text_text_b' onClick={()=>setSortType('nameDown')}/>
                  <p className='sorted_text_text'>От А до Я</p>
                </div>
                <div className='sorted_text'>
                  <FaSortAlphaUp className='sorted_text_text_b' onClick={()=>setSortType('nameUp')}/>
                  <p className='sorted_text_text'>От Я до А</p>
                </div>
                <div className='sorted_text'>
                  <FaSortNumericDown className='sorted_text_text_b' onClick={()=>setSortType('priceUp')}/>
                  <p className='sorted_text_text'>Цена по возрастанию</p>
                </div>
                <div className='sorted_text'>
                  <FaSortNumericDownAlt className='sorted_text_text_b' onClick={()=>setSortType('priceDown')}/>
                  <p className='sorted_text_text'>Цена по убыванию</p>
                </div>            
              </div>
            )}
          </div>
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
        {activeCategory === 'places' && (
          <Category
            fetchAction={fetchToursAsync}
            selectData={selectTours}
            route={TOURABOUT_ROUTE}
            searchObject={searchObject}
            sortType={sortType}
            title="Достопримечательности"
            getName={item => item.name}
            getImage={item => item.img[0]}
            getCity={item => `г.${item.city}`}
            getPrice={item => item.price}
            getRating={item => item.rating}
          />
        )}
        {activeCategory === 'hotels' && (
          <Category
            fetchAction={fetchHotelsAsync}
            selectData={selectHotels}
            route={HOTELABOUT_ROUTE}
            searchObject={searchObject}
            sortType={sortType}
            title="Отели"
            getName={item => item.name}
            getImage={item => item.img[0]}
            getCity={item => item.city}
            getPrice={item => item.price}
            getRating={item => item.rating}
          />
        )}
        {activeCategory === 'tours' && (
          <Category
            fetchAction={fetchCombToursAsync}
            selectData={selectCombTours}
            route={COMBTOURABOUT_ROUTE}
            searchObject={searchObject}
            sortType={sortType}
            title="Туры"
            getName={item => item.hotel.name}
            getImage={item => item.hotel.img[0]}
            getCity={item => item.hotel.city}
            getPrice={item => item.hotel.price}
            getRating={item => item.rating}
          />
        )}
      </div>
      <BeforeFooter/>
    </div>
  );
}

export default Tours;
