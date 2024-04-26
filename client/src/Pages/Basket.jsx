import React, { useEffect, useState } from 'react';
import '../Styles/Basket.css';
import { delAllHotels, delOneHotel, fetchBasketHotel } from '../http/basketApi';
import { Link } from 'react-router-dom';
import { HOTELABOUT_ROUTE } from '../utils/consts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelsAsync, selectHotels } from '../Redux/hotelSlice';
import { BuyOneHotel } from '../http/hotelApi';

function Basket() {
  const [basketHotel, setBasketHotel] = useState([]);

  const [basketPlace, setBasketPlace] = useState([])

  const [basketTour,setBasketTour] = useState([])

  const dispatch = useDispatch()
  const hotels = useSelector(selectHotels)

  useEffect(() => {
    dispatch(fetchHotelsAsync());
}, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBasketHotel();
        setBasketHotel(data);
      } catch (error) {
        console.error("Error fetching basket hotels: ", error);
      }
    };

    fetchData();
  }, []);

  const Payment = async (id) => {
    await BuyOneHotel(id)
    window.location.reload();
  }

  const dellAll = async () => {
    await delAllHotels()
    window.location.reload();
  }

  const dellOne = async (id) => {
    await delOneHotel(id)
    window.location.reload();
  }

  return (
    <div className='basket_page_container'>
      {basketHotel && basketHotel.length>0
      ?
        <><div className='basket_name_container'>
          <h1>Отели</h1>
          <button className='basket_name_button' onClick={()=>dellAll()}>Удалить все</button>
        </div>
        <div className='hotels_basket_container'>
        {basketHotel.map((item) => {
          const hotel = hotels.find(h => h.id === item.hotelId);
          return (
            <div key={item.id} className='hotels_container'>
              <div className='link_dates_container'>
                <Link to={`${HOTELABOUT_ROUTE}/${item.hotelId}`} style={{ backgroundImage: `url(${'http://localhost:5000/' + hotel.img})` }} className='basket_hotel_redirect'>
                  <div>
                    <p>{hotel.name}</p>
                    <div>
                      <p style={{fontSize:'25px'}}>{hotel.city}</p>
                    </div>
                  </div>
                </Link>
                <div>
                  <p>Дата начала : {new Date(item.date_in).toLocaleDateString('ru-RU')}</p>
                  <p>Дата окончания : {new Date(item.date_out).toLocaleDateString('ru-RU')}</p>
                  <p>Номера : {item.rooms.join(',')}</p>
                </div>
              </div>              
              <div className='buttons_handlers_container'>
                <button style={{marginLeft:'0'}} onClick={()=> dellOne(item.id)}>Удалить</button>
                <div className='payment_block'>
                  <p className='pay_p'>{hotel.price}</p>
                  <button key={item.id} onClick={() => Payment(item.id)}>Оплатить</button>
                </div>
              </div> 
              <hr></hr>
            </div>
          );
        })}
        </div></>
      :<h1>Корзина пуста</h1>
      }
      {basketPlace.length>0
      ?
        <>
          <h1>Достопримечательности</h1>
        </>
      :
        <>
        </>
      }
      {basketTour.length>0
      ?
        <>
          <h1>Туры</h1>
        </>
      :
        <>
        </>
      }
    </div>
  );
}

export default Basket;
