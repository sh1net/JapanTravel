import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHotelsAsync, selectHotels } from '../../Redux/hotelSlice';
import RatingStars from '../../Components/RatingStars/RatingStars'
import { Link } from 'react-router-dom';
import { HOTELABOUT_ROUTE } from '../../utils/consts';

function HotelCategory({ searchObject, setSearchObject, sortType }) {
    const dispatch = useDispatch();

    const hotels = useSelector(selectHotels);

    useEffect(() => {
        dispatch(fetchHotelsAsync());
    }, [dispatch]);

    let filteredHotels = hotels.filter(
        hotel => hotel.name.toLowerCase().includes(searchObject.toLowerCase())
    );

    let sortedHotels = [...filteredHotels];

    switch (sortType) {
        case 'nameUp':
            sortedHotels.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'nameDown':
            sortedHotels.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'priceUp':
            sortedHotels.sort((a, b) => a.price - b.price);
            break;
        case 'priceDown':
            sortedHotels.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
    }

    return (
        <div>
            <h2 style={{color:'white',marginBottom:'0px',fontSize:'40px', width:'100%',display:'flex', justifyContent:'center'}}>Отели</h2>
            <div className="grid-container">
                {sortedHotels.map(hotel => (
                    <Link to={`${HOTELABOUT_ROUTE}/${hotel.id}`} key={hotel.id} className="grid-item" style={{ backgroundImage: `url(${'http://localhost:5000/' + hotel.img})` }}>
                        <div className='tour_main_info'>
                            <p className='tour_name'>{hotel.name}</p>
                            <div className='price_button_tour'>
                                <p style={{fontSize:'25px'}}>{hotel.city}</p>
                                <p className='tour_rating'><RatingStars rating={hotel.rating}/></p>
                            </div>
                            <div className='price_button_tour'>
                                <p className='tour_price'>{hotel.price}byn</p>
                                <button>Подробнее</button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default HotelCategory;
