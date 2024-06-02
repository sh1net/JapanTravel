import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import { Slider, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const Category = ({ fetchAction, selectData, route, searchObject, sortType, filters, title, getName, getImage, getCity, getPrice, getRating }) => {
    const dispatch = useDispatch();
    const data = useSelector(selectData);

    const [priceRange, setPriceRange] = useState([0, 0]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);

    useEffect(() => {
        dispatch(fetchAction());
    }, [dispatch, fetchAction]);

    useEffect(() => {
        if (data.length > 0) {
            const maxPrice = Math.max(...data.map(getPrice));
            setPriceRange([0, maxPrice]);
        }
    }, [data, getPrice]);

    const handleCityChange = (city) => {
        setSelectedCities((prev) =>
            prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
        );
    };

    const handleRatingChange = (rating) => {
        setSelectedRatings((prev) =>
            prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
        );
    };

    const filteredData = data
    .filter((item) => getName(item).toLowerCase().includes(searchObject.toLowerCase()))
    .filter((item) => selectedCities.length === 0 || selectedCities.includes(getCity(item)))
    .filter((item) => selectedRatings.length === 0 || selectedRatings.includes(getRating(item)))
    .filter((item) => getPrice(item) >= priceRange[0] && getPrice(item) <= priceRange[1]);

    let sortedData = [...filteredData];

    switch (sortType) {
        case 'nameUp':
            sortedData.sort((a, b) => getName(b).localeCompare(getName(a)));
            break;
        case 'nameDown':
            sortedData.sort((a, b) => getName(a).localeCompare(getName(b)));
            break;
        case 'priceUp':
            sortedData.sort((a, b) => getPrice(a) - getPrice(b));
            break;
        case 'priceDown':
            sortedData.sort((a, b) => getPrice(b) - getPrice(a));
            break;
        default:
            break;
    }

    const uniqueCities = [...new Set(data.map(getCity))];

    return (
        <div className='all_items_container'>
            {filters && 
            <div className='filter_container'>
                <h1 className='filters_text'>Фильтры</h1>
                <div>
                    <h2 className='filters_text'>Города</h2>
                    <div style={{marginLeft:'10px'}}>
                    <FormGroup>
                        {uniqueCities.map((city) => (
                            <FormControlLabel
                                key={city}
                                control={
                                    <Checkbox
                                        checked={selectedCities.includes(city)}
                                        onChange={() => handleCityChange(city)}
                                    />
                                }
                                label={<h3 style={{fontSize:'23px',padding:'0',margin:'0'}}>{city}</h3>}
                            />
                        ))}
                    </FormGroup>
                    </div>
                </div>
                <div>
                    <h2 className='filters_text'>Рейтинг</h2>
                    <div style={{marginLeft:'10px'}}>
                    <FormGroup>
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <FormControlLabel
                                key={rating}
                                control={
                                    <Checkbox
                                        checked={selectedRatings.includes(rating)}
                                        onChange={() => handleRatingChange(rating)}
                                    />
                                }
                                label={
                                    <div className='rating_filter_container'>
                                        <Rating name="read-only" value={rating} readOnly />
                                        <p style={{margin:'0',padding:'1px 0 0 3px'}}>{rating}.0</p>
                                    </div>
                                }
                            />
                        ))}
                    </FormGroup>
                    </div>
                </div>
                <div>
                    <h2 className='filters_text'>Стоимость</h2>
                    <div className='filter_slider_container'>
                        <h3 className='filters_text'>{priceRange[0]} - {priceRange[1]} byn</h3>
                        <Slider
                            value={priceRange}
                            onChange={(e, newValue) => setPriceRange(newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={Math.max(...data.map(getPrice))}
                        />
                    </div>
                </div>
            </div>}
            <div className='all_item_tours_container'>
                <h2 style={{ color: 'white', marginBottom: '0px', fontSize: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}>{title}</h2>
                <div className="grid-container">
                    {sortedData.map(item => (
                        <Link to={`${route}/${item.id}`} key={item.id} className="grid-item" style={{ backgroundImage: `url(${'http://localhost:5000/' + getImage(item)})` }}>
                            <div className='tour_main_info'>
                                <p className='tour_name'>{getName(item)}</p>
                                <div className='tour_details'>
                                    <div className='price_button_tour'>
                                        <p style={{ fontSize: '25px', margin: '0' }}>{getCity(item)}</p>
                                        <p className='tour_rating'><Rating name="read-only" value={getRating(item)} readOnly /></p>
                                    </div>
                                    <div className='price_button_tour'>
                                        <p className='tour_price'>{getPrice(item)}byn</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;
