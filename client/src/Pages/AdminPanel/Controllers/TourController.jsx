import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchToursAsync, selectTours } from '../../../Redux/tourSlice';
import PhotoSlider2 from '../photoSlider/PhotoSlider2';
import '../Styles/ControllerStyle.css'
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { deleteTour } from '../../../http/adminApi';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TourModal from '../Modals/TourModal';
import { fetchOneTour } from '../../../http/tourApi';

function TourController() {

  const tours = useSelector(selectTours)
  const dispatch = useDispatch()
  const [isTourModalOpen,setIsTourModalOpen]= useState(false)
  const [tour,setTour] = useState()

  const [tour_info,setTour_info] = useState()
  const [sortedArr, setSortedArr] = useState()

  useEffect(() => {
      dispatch(fetchToursAsync());
  }, [dispatch]);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        let result
        if(tour && tour.id){
          result = await fetchOneTour(tour.id);
        }
        setTour_info(result);
      } catch (error) {
        console.error('Ошибка получения данных:', error);
      }
    };
  
    fetchTourData();
  }, [tour?.id]);

  const closeModal = () => {
    setIsTourModalOpen(false);
    setTour(null)
  };

  const editTour = (tour) => {
    setTour(tour);
    setIsTourModalOpen(true)
  }

  const dropTour = async (id) => {
    try{
      const confirm = await new Promise((resolve) => {
        confirmAlert({
          title: 'Подтвердите действие',
          message: 'Вы уверены, что хотите удалить этот тур?',
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
        const data = await deleteTour(id)
        if(data){
          alert(data)
          window.location.reload()
        }
      }
    }catch(e){
      console.log(e.message)
    }
  }

  useEffect(()=>{
    if (tours.length > 0) {
      const sortedTours = [...tours].sort((a, b) => a.id - b.id);
      setSortedArr(sortedTours);
    }
  },[tours])

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
            {tours && tours.length>0 && sortedArr && sortedArr.length>0 && sortedArr.map(tour => {
              return(
                <tr key={tour.id}>
                  <td>{tour.id}</td>
                  <td className='admin_photo_container'>
                    <PhotoSlider2 imgs={tour.img}/>
                    <div className='admin_controller_toogle_container'>
                      <button className='admin_controller_toogle_button' onClick={()=>dropTour(tour.id)}><FaTrash/></button>
                      <button className='admin_controller_toogle_button' onClick={()=>editTour(tour)}><FaEdit /></button>
                    </div>
                  </td>
                  <td>{tour.name}</td>
                  <td>{tour.rating}</td>
                  <td>{tour.city}</td>
                  <td>{tour.price}</td>
                  <td>{tour.location.join(',')}</td>
                </tr>
              )})}
          </tbody>
        </table>
      </div>
      {isTourModalOpen && 
        <TourModal closeModal={closeModal} isEdit={true} tour={tour} info={tour_info}/>
      }
    </div>
  )
}

export default TourController