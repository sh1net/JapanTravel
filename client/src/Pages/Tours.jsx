import React, { useEffect, useState } from 'react';
import "../Styles/Tours.css";
import BeforeFooter from '../Components/BeforeFooter'
import { FaFilter, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericDownAlt } from "react-icons/fa";
import Category from './Category';
import { fetchToursAsync, selectTours } from '../Redux/tourSlice';
import { fetchHotelsAsync, selectHotels } from '../Redux/hotelSlice';
import { fetchCombToursAsync, selectCombTours } from '../Redux/combSlice';
import { TOURABOUT_ROUTE, HOTELABOUT_ROUTE, COMBTOURABOUT_ROUTE } from '../utils/consts';
import { useDispatch, useSelector } from 'react-redux';


const Tours = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchObject,setSearchObject] = useState('');
  const [activeCategory, setActiveCategory] = useState('places');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCombToursAsync());
    dispatch(fetchHotelsAsync());
    dispatch(fetchToursAsync());
  }, [dispatch]);


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
        <div className='items_filters_main_container'>
        {activeCategory === 'places' && (
          <Category
            fetchAction={fetchToursAsync}
            selectData={selectTours}
            route={TOURABOUT_ROUTE}
            searchObject={searchObject}
            sortType={sortType}
            filters={showFilters}
            title="Достопримечательности"
            getName={item => item.name}
            getImage={item => item.img[0]}
            getCity={item => item.city}
            getPrice={item => item.price}
            getRating={item => item.rating?item.rating : 0}
          />
        )}
        {activeCategory === 'hotels' && (
          <Category
            fetchAction={fetchHotelsAsync}
            selectData={selectHotels}
            route={HOTELABOUT_ROUTE}
            searchObject={searchObject}
            sortType={sortType}
            filters={showFilters}
            title="Отели"
            getName={item => item.name}
            getImage={item => item.img[0]}
            getCity={item => item.city}
            getPrice={item => item.price}
            getRating={item => item.rating?item.rating : 0}
          />
        )}
        {activeCategory === 'tours' && (
          <Category
            fetchAction={fetchCombToursAsync}
            selectData={selectCombTours}
            route={COMBTOURABOUT_ROUTE}
            searchObject={searchObject}
            sortType={sortType}
            filters={showFilters}
            title="Туры"
            getName={item => item.hotel.name}
            getImage={item => item.hotel.img[0]}
            getCity={item => item.hotel.city}
            getPrice={item => item.hotel.price}
            getRating={item => item.rating?item.rating : 0}
          />
        )}
      </div>
      </div>
      <BeforeFooter/>
    </div>
  );
}

export default Tours;
