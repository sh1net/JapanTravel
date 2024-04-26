import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchToursAsync, selectTours } from '../../Redux/tourSlice';
import { Link } from 'react-router-dom';
import { TOURABOUT_ROUTE } from '../../utils/consts';
import RatingStars from '../../Components/RatingStars/RatingStars'

function TourCategory({ searchObject, setSearchObject }) {
    const tours = useSelector(selectTours)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchToursAsync());
    }, [dispatch]);

    const filteredTours = tours.filter(
        tour => tour.name.toLowerCase().includes(searchObject.toLowerCase())
    )
    
    return (
        <div>
            <h2 style={{color:'white',marginBottom:'0px',fontSize:'40px', width:'100%',display:'flex', justifyContent:'center'}}>Достопримечательности</h2>
            <div className="grid-container">
                {filteredTours.map(tour => (
                    <Link to={`${TOURABOUT_ROUTE}/${tour.id}`} key={tour.id} className="grid-item" style={{ backgroundImage: `url(${'http://localhost:5000/' + tour.img})` }}>
                        <div className='tour_main_info'>
                            <p className='tour_name'>{tour.name}</p>
                            <div className='price_button_tour'>
                                <p style={{fontSize:'25px'}}>{tour.city}</p>
                                <p className='tour_rating'><RatingStars rating={tour.rating}/></p>
                            </div>
                            <div className='price_button_tour'>
                                <p className='tour_price'>{tour.price}byn</p>
                                <button>Подробнее</button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default TourCategory;
