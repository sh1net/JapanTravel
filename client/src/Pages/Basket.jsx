import React, { useEffect, useState } from 'react';
import '../Styles/Basket.css';
import { delAllHotels, delAllTours, delOneHotel, delOneTour, fetchBasketHotel, fetchBasketTour } from '../http/basketApi';
import { Link } from 'react-router-dom';
import { HOTELABOUT_ROUTE, TOURABOUT_ROUTE } from '../utils/consts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelsAsync, selectHotels } from '../Redux/hotelSlice';
import { fetchToursAsync, selectTours } from '../Redux/tourSlice';
import BasketModal from './PaymentModals/BasketModal';

function Basket() {
  const [basketHotel, setBasketHotel] = useState([]);

  const [basketPlace, setBasketPlace] = useState([])

  const [basketTour,setBasketTour] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ type: '', item: null, basket:null });

  const dispatch = useDispatch()
  const hotels = useSelector(selectHotels)
  const tours = useSelector(selectTours)
  useEffect(() => {
    dispatch(fetchHotelsAsync());
    dispatch(fetchToursAsync())
}, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBasketHotel();
        setBasketHotel(data);
        const data_2 = await fetchBasketTour()
        setBasketPlace(data_2)
      } catch (error) {
        console.error("Error fetching basket hotels: ", error);
      }
    };

    fetchData();
  }, []);

  const dellAllHotels = async () => {
    await delAllHotels()
    window.location.reload();
  }

  const dellOneHotel = async (id) => {
    await delOneHotel(id)
    window.location.reload();
  }

  const dellOneTour = async(id) =>{
    await delOneTour(id)
    window.location.reload();
  } 

  const dellAllTours =async() => {
    await delAllTours()
    window.location.reload();
  }

  const openModal = (type, item, basket) => {
    setModalContent({ type, item, basket });
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalContent({ type: '', item: null, basket:null });
  }

  return (
    <div className='basket_page_container'>
      {basketHotel && basketHotel.length>0
      ?
        <><div className='basket_name_container'>
          <h1>Отели</h1>
          <button className='basket_name_button' onClick={()=>dellAllHotels()}>Удалить все</button>
        </div>
        <div className='hotels_basket_container'>
        {basketHotel.map((item) => {
          const hotel = hotels.find(h => h.id === item.hotelId);
          return (
            <div key={item.id} className='hotels_container'>
              <div className='link_dates_container'>
                <Link to={`${HOTELABOUT_ROUTE}/${item.hotelId}`} style={{ backgroundImage: `url(${'http://localhost:5000/' + hotel.img[0]})` }} className='basket_hotel_redirect'>
                </Link>
                <div>
                  <p style={{fontSize:'20px'}}>Отель : {hotel.name}</p>
                  <p style={{fontSize:'20px'}}>г.{hotel.city}</p>
                  <p style={{fontSize:'20px'}}>Дата начала : {new Date(item.date_in).toLocaleDateString('ru-RU')}</p>
                  <p style={{fontSize:'20px'}}>Дата окончания : {new Date(item.date_out).toLocaleDateString('ru-RU')}</p>
                  <p style={{fontSize:'20px'}}>Номера : {item.rooms.join(',')}</p>
                </div>
              </div>              
              <div className='buttons_handlers_container'>
                <button style={{marginLeft:'0'}} onClick={()=> dellOneHotel(item.id)}>Удалить</button>
                <div className='payment_block'>
                  <p className='pay_p'>{hotel.price}</p>
                  <button key={item.id}>Оплатить</button>
                </div>
              </div> 
              <hr></hr>
            </div>
          );
        })}
        </div></>
      :<></>
      }
      {basketPlace.length>0
      ?
      <><div className='basket_name_container'>
      <h1>Достопримечательности</h1>
      <button className='basket_name_button' onClick={()=>dellAllTours()}>Удалить все</button>
    </div>
    <div className='hotels_basket_container'>
    {basketPlace.map((item) => {
      const tour = tours.find(h => h.id === item.tourId);
      return (
        <div key={item.id} className='hotels_container'>
          <div className='link_dates_container'>
            <Link to={`${TOURABOUT_ROUTE}/${item.tourId}`} style={{ backgroundImage: `url(${'http://localhost:5000/' + tour.img[0]})` }} className='basket_hotel_redirect'>
            </Link>
            <div>
              <p style={{fontSize:'20px'}}>Название : {tour.name}</p>
              <p style={{fontSize:'20px'}}>г.{tour.city}</p>
              <p style={{fontSize:'20px'}}>Дата посещения : {new Date(item.date).toLocaleDateString('ru-RU')}</p>
              <p style={{fontSize:'20px'}}>Количество билетов:{item.count.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
                {item.count[1]>0 ? ` Взрослые: ${item.count[0]}, Детские: ${item.count[1]}`:` Взрослые: ${item.count[0]}`}
              </p>
            </div>
          </div>              
          <div className='buttons_handlers_container'>
            <button style={{marginLeft:'0'}} onClick={()=> dellOneTour(item.id)}>Удалить</button>
            <div className='payment_block'>
              <p className='pay_p'>{item.price}</p>
              <button key={item.id} onClick={() => openModal('tour',tour,item)}>Оплатить</button>
            </div>
          </div> 
          <hr></hr>
        </div>
      );
    })}
    </div></>
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
      <BasketModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={modalContent.type}
        item={modalContent.item}
        basket={modalContent.basket}
      />
    </div>
  );
}

export default Basket;
