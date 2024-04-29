import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../Styles/TourAbout.css";
import BeforeFooter from '../Components/BeforeFooter';
import { addTourToCart, fetchOneTour } from '../http/tourApi';
import RatingStars from '../Components/RatingStars/RatingStars';
import DatePicker from "react-datepicker";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

function TourAbout() {
  const { id } = useParams();
  const [tour, setTour] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchOneTour(id)
      .then(result => {
        setTour(result);
      })
      .catch(error => {
        console.error('Error fetching tour:', error);
      });
  }, [id]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const addCount = () => {
    if(count){
      setCount(count + 1);
    }else{
      setCount(1)
    }
    
  };

  const minusCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const ConvertDates = (date) => {
    console.log(date)
    const dateParts = date.split(".");
    const dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const formattedDate = dateObject.toISOString().slice(0, 10);
    return formattedDate
  }

  const addToCart = async () => {
    try {
      if (selectedDate && count) {
          const date_1 = ConvertDates(selectedDate.toLocaleDateString('ru-RU'))
          const data = await addTourToCart(count,date_1,id)
          if(data){
            alert('Успешно')
            closeModal()
          }
        } else {
          alert('Введите данные')
        }
    } catch (e) {
      alert(e.response?.data.message || 'Произошла ошибка');
    }
  }

  return (
    <div className='tour_about_container'>
      <div className='tour_about_container_container'>
        {tour && (
          <>
            <img src={`http://localhost:5000/${tour.img}`} alt="Тур" />
            <h1>{tour.name}</h1>
            <p className='tour_about_rating'>Рейтинг тура: <RatingStars rating={tour.rating}/></p>
            {tour.info && tour.info.length > 0 && (
              <p className='tour_about_info'>{tour.info[0].description}</p>
            )}
            <p className='tour_about_price'>Стоимость тура: {tour.price}</p>
            <button onClick={openModal}>Добавить в корзину</button>
          </>
        )}
      </div>
      <BeforeFooter/>

      {isModalOpen ?
        <div className='modal'>
          <div className='modal_content'>
            <div className='modal_title' style={{marginBottom:'20px'}}>
              <p>Добавление в корзину</p>
              <p className='close_button' onClick={closeModal}>&times;</p>
            </div>
            <div className='modal_form'>
            <div className='modal_date'>
              <DatePicker
                selected={selectedDate}
                inline
                onChange={handleDateChange}
              />
              <p>Ваш срок : {selectedDate>Date.now() ? selectedDate.toLocaleDateString('ru-RU') : 'Неверная дата'}</p>
            </div>
            <div className='modal_count'>
              <p className='modal_p'>Билеты</p>
              <div className='modal_count_edit'>
                <FaMinus className='modal_plus_minus' onClick={minusCount}/>
                <input type='number' value={count} onChange={(e) => setCount(parseInt(e.target.value))} className='modal_count_count'></input>
                <FaPlus className='modal_plus_minus' onClick={addCount}/>
              </div>
            </div>
            <div style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
            <p style={{margin:'0'}}>Стоимость : {count>0 ? tour.price*count : 'Введите данные'}</p>
              <button onClick={addToCart}>Добавить в корзину</button>
            </div>
            </div>
          </div>
        </div>
        :<></>
      }
    </div>
  );
}

export default TourAbout;
