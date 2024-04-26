import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addHotelToCart, fetchOneHotel } from '../http/hotelApi';
import RatingStars from '../Components/RatingStars/RatingStars';
import BeforeFooter from '../Components/BeforeFooter';
import "../Styles/Modal.css";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { checkData } from '../http/basketApi';
import HotelNumberPicker from '../Components/HotelNumberPicker';

function HotelAbout() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotel, setHotel] = useState({});
  const [count, setCount] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [isCor, setIsCor] = useState({});
  const [selectedNumbers,setSelectedNumbers] = useState([])
  const date = new Date()

  useEffect(() => {
    fetchOneHotel(id)
      .then(result => {
        setHotel(result);
      })
      .catch(error => {
        console.error('Error fetching hotel:', error);
      });
  }, [id]);

  useEffect(() => {
    if (dateRange[0] && dateRange[1] && count) {
      const fetchData = async () => {
        try {
          const data = await checkData(id, dateRange[0], dateRange[1], count);
          setIsCor(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [id, dateRange, count]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDateRange([null, null]);
    setCount(0);
    setSelectedNumbers([])
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

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const handleNumberSelect = (numbers) => {
    setSelectedNumbers(numbers)
  }

  const ConvertDates = (date) => {
    const dateParts = date.split(".");
    const dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const formattedDate = dateObject.toISOString().slice(0, 10);
    return formattedDate
  }

  const addToCart = async () => {
    try {
      if (formattedDateRange && count && selectedNumbers) {
        if (count === selectedNumbers.length) {
          const dates = formattedDateRange.split(' - ')
          const dateIn = ConvertDates(dates[0])
          const dateOut = ConvertDates(dates[1])
          const rooms = selectedNumbers.join(',')
          const data = await addHotelToCart(id, dateIn, dateOut, rooms, count)
          if(data){
            alert('Успешно')
            closeModal()
          }
        } else {
          alert('Ошибка в выборе номеров')
        }
      } else {
        alert('Введите данные')
      }
    } catch (e) {
      alert(e.response?.data.message || 'Произошла ошибка');
    }
  }
  
  

  const formattedDateRange = dateRange.map(date => date ? date.toLocaleDateString('ru-RU') : '').join(' - ');

  return (
    <div className='tour_about_container'>
      <div className='tour_about_container_container'>
      {hotel && (
          <>
            <img src={`http://localhost:5000/${hotel.img}`} alt="Отель" />
            <h1>{hotel.name}</h1>
            <p className='tour_about_rating'>Рейтинг тура: <RatingStars rating={hotel.rating}/></p>
            {hotel.info && hotel.info.length > 0 && (
              <p className='tour_about_info'>{hotel.info[0].description}</p>
            )}
            <h2>{hotel.datesAvailability}</h2>
            <p className='tour_about_price'>Стоимость тура: {hotel.price}</p>
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
                onChange={handleDateChange}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                selectsRange
                inline
                dateFormat="dd.MM.yyyy"
              />
              <p>Ваш срок : {formattedDateRange}</p>
            </div>
            <div className='modal_count'>
              <p className='modal_p'>Билеты</p>
              <div className='modal_count_edit'>
                <FaMinus className='modal_plus_minus' onClick={minusCount}/>
                <input type='number' value={count} onChange={(e) => setCount(parseInt(e.target.value))} className='modal_count_count'></input>
                <FaPlus className='modal_plus_minus' onClick={addCount}/>
              </div>
            </div>
            <div>
              <p>Выберите номера : </p>
              <TbReload onClick={() => checkData(id, dateRange[0], dateRange[1], count).then(data => setIsCor(data))}/>
              {
                dateRange[0] && dateRange[1] && dateRange[0]>date? (
                  count ? (
                    isCor.isOk ? (
                      <HotelNumberPicker selectedNumbers={selectedNumbers} onSelect={handleNumberSelect} rooms={isCor.rooms} count={count}/>
                    ) : (
                      <p>Не доступных номеров</p>
                    )
                  ) : (
                    <p>Введите количество</p>
                  )
                ) : (
                  <p>Введите промежуток дат</p>
                )
              }
            </div>
            <div style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
              <p style={{margin:'0'}}>Стоимость : {count>0&&selectedNumbers.length===count ? hotel.price*count : 'Введите данные'}</p>
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

export default HotelAbout;
