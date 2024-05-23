import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';

const Category = ({ fetchAction, selectData, route, searchObject, sortType, title, getName, getImage, getCity, getPrice, getRating }) => {
    const dispatch = useDispatch();
    const data = useSelector(selectData);

    useEffect(() => {
        dispatch(fetchAction());
    }, [dispatch, fetchAction]);

    const filteredData = data.filter(item => getName(item).toLowerCase().includes(searchObject.toLowerCase()));

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

    return (
        <div>
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
    );
};

export default Category;
