import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PhotoSlider2 from '../photoSlider/PhotoSlider2';
import '../Styles/ControllerStyle.css'
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { deleteTour } from '../../../http/adminApi';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {selectHotels,fetchHotelsAsync} from '../../../Redux/hotelSlice'
import { deleteHotel, fetchOneHotel } from '../../../http/hotelApi';
import HotelModal from '../Modals/HotelModal';

function HotelController() {

  const hotels = useSelector(selectHotels)
  const dispatch = useDispatch()
  const [hotel,setHotel] = useState()
  const [isHotelModalOpen,setIsHotelModalOpen]= useState(false)
  const [hotel_info,setHotel_info] = useState()
  const [sortedArr, setSortedArr] = useState()

  useEffect(() => {
      dispatch(fetchHotelsAsync());
  }, [dispatch]);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        let result
        if(hotel && hotel.id){
          result = await fetchOneHotel(hotel.id);
        }
        setHotel_info(result);
      } catch (error) {
        console.error('Ошибка получения данных:', error);
      }
    };
  
    fetchHotelData();
  }, [hotel?.id]);

  const dropHotel = async (id) => {
    try{
      const confirm = await new Promise((resolve) => {
        confirmAlert({
          title: 'Подтвердите действие',
          message: 'Вы уверены, что хотите удалить этот отель?',
          buttons: [
            {
              label: 'Да',
              onClick: () => resolve(true)
            },
            {
              label: 'Нет',
              onClick: () => resolve(false)
            }
          ]
        });
      });
      if(confirm){
        const data = await deleteHotel(id)
        if(data){
          alert(data)
          window.location.reload()
        }
      }
    }catch(e){
      console.log(e.message)
    }
  }

  const closeModal = () => {
    setIsHotelModalOpen(false);
    setHotel(null)
  };

  const editHotel = (hotel) => {
    setHotel(hotel);
    setIsHotelModalOpen(true)
  }

  useEffect(()=>{
    if (hotels.length > 0) {
      const sortedHotels = [...hotels].sort((a, b) => a.id - b.id);
      setSortedArr(sortedHotels);
    }
  },[hotels])

  return (
    <div>
      <div className='admin_tables_container'>
        <table className='admin_table'>
          <thead>
            <tr>
              <th>id</th>
              <th>Фото</th>
              <th>Название</th>
              <th>Рейтинг</th>
              <th>Город</th>
              <th>Цена</th>
              <th>Локация</th>
            </tr>
          </thead>
          <tbody>
            {hotels && hotels.length>0 && sortedArr && sortedArr.length>0 && sortedArr.map(hotel => {
              return(
                <tr key={hotel.id}>
                  <td>{hotel.id}</td>
                  <td className='admin_photo_container'>
                    <PhotoSlider2 imgs={hotel.img}/>
                    <div className='admin_controller_toogle_container'>
                      <button className='admin_controller_toogle_button' onClick={()=>dropHotel(hotel.id)}><FaTrash/></button>
                      <button className='admin_controller_toogle_button' onClick={()=>editHotel(hotel)}><FaEdit /></button>
                    </div>
                  </td>
                  <td>{hotel.name}</td>
                  <td>{hotel.rating}</td>
                  <td>{hotel.city}</td>
                  <td>{hotel.price}</td>
                  <td>{hotel.location.join(',')}</td>
                </tr>
              )})}
          </tbody>
        </table>
      </div>
      {isHotelModalOpen && 
        <HotelModal closeModal={closeModal} isEdit={true} hotel={hotel} info={hotel_info}/>
      }
    </div>
  )
}

export default HotelController