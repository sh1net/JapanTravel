import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addHotelToCart, createHotelReview, fetchHotelReviews, fetchOneHotel } from '../http/hotelApi';
import BeforeFooter from '../Components/BeforeFooter';
import "../Styles/Modal.css";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { checkData } from '../http/hotelApi';
import HotelNumberPicker from '../Components/HotelNumberPicker';
import MapComponent from "../Components/GoogleMaps/MapComponent"
import PhotoSlider from '../Components/PhotoSlider/PhotoSlider';
import Rating from '@mui/material/Rating';
import CustomTextField from '../Components/mui/CustomTextField';
import Switch from '@mui/material/Switch';

function HotelAbout() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotel, setHotel] = useState();
  const [count, setCount] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [isCor, setIsCor] = useState({});
  const [selectedNumbers,setSelectedNumbers] = useState([])
  const [reviews,setReviews] = useState()
  const date = new Date()
  const [kidsCount, setKidsCount] = useState(0);
  const [showKids, setShowKids] = useState(false);
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const result = await fetchOneHotel(id);
        setHotel(result);
        const reviewsData = await fetchHotelReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Ошибка получения данных:', error);
      }
    };
  
    fetchHotelData();
  }, [id]);

  useEffect(() => {
    if(hotel && hotel.price){
      let totalKidsPrice = 0
      if(showKids){
        totalKidsPrice = hotel.price * kidsCount * 0.55;
      }      
      const totalAdultPrice = hotel.price * count;
      setPrice(totalKidsPrice + totalAdultPrice);
    }
    
  },[kidsCount,count,showKids])

  useEffect(() => {
    if (dateRange[0] && dateRange[1] && count) {
      const fetchData = async () => {
        try {
          const roomsCount = count+kidsCount
          const data = await checkData(id, dateRange[0], dateRange[1], roomsCount);
          setIsCor(data);
        } catch (e) {
          console.log('Error fetching data:', e.message);
        }
      };
      fetchData();
    }
  }, [id, dateRange, count,kidsCount]);

  const openModal = () => {
    const token = localStorage.getItem('token')
    if(!token){
      alert('Не авторизован') 
      return
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDateRange([null, null]);
    setCount(0);
    setSelectedNumbers([])
  };

  const toggleShowKids = () => {
    setShowKids(!showKids);
    if(!showKids){
      setKidsCount(0)
    }
  };


  const addCount = () => {
    if(count && count<isCor.count - kidsCount){
      setCount(count + 1);
    }else{
      setCount(1)
    }
    
  };

  const minusCount = () => {
    if (count && count > 1) {
      setCount(count - 1);
    }
  };

  const addKidsCount = () => {
    if (kidsCount < isCor.count - count) {
      setKidsCount(kidsCount + 1);
    }else{
      setKidsCount(0)
    }
  };

  const minusKidsCount = () => {
    if (kidsCount > 0) {
      setKidsCount(kidsCount - 1);
    }
  };

  const handleCountChange = (e) => {
    const value = parseInt(e.target.value)
    if(!isNaN(value) && value <= isCor.count - kidsCount){
      setCount(value)
    }else if(value>isCor.count - kidsCount){
      setCount(isCor.count - kidsCount)
    }else{
      setCount(1)
    }
  }

  const handleKidsCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value <= isCor.count - count) {
      setKidsCount(value);
    } else if (value > isCor.count - count) {
      setKidsCount(isCor.count - count);
    } else {
      setKidsCount(0);
    }
  }

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
      if (formattedDateRange && count && selectedNumbers && kidsCount) {
        if ((count+kidsCount) === selectedNumbers.length) {
          const dates = formattedDateRange.split(' - ')
          const dateIn = ConvertDates(dates[0])
          const dateOut = ConvertDates(dates[1])
          const rooms = selectedNumbers.join(',')
          const hotelCount = [count,kidsCount].join(',')
          const data = await addHotelToCart(id, dateIn, dateOut, rooms, hotelCount,price)
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
  
  const [reviewText, setReviewText] = useState('')
  const handleText = (text) => {
    setError(false)
    setHelperText(false)
    setReviewText(text)
  }

  const [reviewRate,setReviewRate] = useState(0)
  const handleRate = (e) => {
    setReviewRate(e.target.value)
  }

  const handleCancel = () => {
    setReviewRate(0)
    setReviewText('')
  }

  const [valid,setValid] = useState(false)
  const [error,setError] = useState(false)
  const [helperText,setHelperText] = useState('')

  const sendReview = async () => {
    try{
      const token = localStorage.getItem('token')
      if(!token){
        alert('Не авторизован') 
        return
      }
      if(reviewText!==undefined && reviewText.length>0 && reviewText!==''){
        console.log(valid,error,helperText, reviewText)
        await createHotelReview(reviewText,reviewRate,id)
        alert('Спасибо за ваш отзыв')
        window.location.reload()
      }else{
        setError(true)
        setHelperText(true)
        setValid(false)
      }
    }catch(e){
      alert(e.response?.data.message || 'Произошла ошибка');
    }
  }

  const formattedDateRange = dateRange.map(date => date ? date.toLocaleDateString('ru-RU') : '').join(' - ');

  return (
    <div className='tour_about_container'>
      <div className='tour_about_container_container'>
      {hotel && (
          <>
            <div className='photo_block_text_container'>
              {hotel.img && hotel.img.length > 0 && (
                <div className='tour_about_img'><PhotoSlider imgs={hotel.img}/></div>
              )}
              <div className='text_block_container'>
                <div>
                  <h1 className='tour_name_h'>{hotel.name}</h1>
                  {hotel.location && hotel.location.length>0 && (
                    <div className='tour_about_map'><MapComponent location={hotel.location} name = {hotel.name}/></div>
                  )} 
                  <Rating name="read-only" value={hotel.rating} size="large" readOnly className='rate_stars_info'/>
                  <h2 className='city_block_text'>г.{hotel.city}</h2>
                </div>
                <div className='price_container'>
                  <div className='valute_tour_about'>
                    <p className='tour_about_price'>{hotel.price}</p>
                    <p className='valute_text'>BYN</p>
                  </div>
                  <button onClick={openModal} className='tour_about_button'>Добавить в корзину</button>
                </div>
              </div>
            </div>
            <div>
              {hotel.info && hotel.info.length > 0 && (
                <p className='tour_about_info'>{hotel.info[0].description}</p>
              )}
            </div>  
            <hr></hr>
            <div className='tour_reviews_container'>
              <h2>Оцените данное место</h2>
              <div className='reviews_container'>
                <Rating name="size-large" defaultValue={null}  size="large" onChange={handleRate}/>
                <CustomTextField onSend={handleText} error={error} helperText={helperText} header='Поделитесь впечатлениями' value={reviewText}/>
                <div className='send_delete_container'>
                  <button className='review_button delete' onClick={handleCancel}>Отмена</button>
                  <button className='review_button send' onClick={sendReview}>Отправить</button>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className='tour_reviews_container'>
              <h2>Отзывы</h2>
              <div className='reviews_container'>
              {Array.isArray(reviews) && reviews.length > 0 ? (
                  reviews.map((review) => (
                  <div key={review.id} className='review_item'>
                    <div className='review_user_info'>
                      {review.user.img && (
                        <div
                          className='user_icon_review'
                          style={{ backgroundImage: `url(http://localhost:5000/${review.user.img})` }}
                        ></div>
                      )}
                      <p className='p_username_review'>{review.user.nickname}</p>
                    </div>
                    <Rating name="read-only" value={review.rate} size="large" readOnly />
                    {review.description && <p className='p_review'>{review.description}</p>}
                    <hr></hr>
                  </div>))
                ) : (
                  <h2 style={{color:'black'}}>Оствьте первый отзыв!</h2>)}
              </div>
            </div>      
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
            {(dateRange[0] > Date.now() && dateRange[1]) && (
              <>
                <div className='modal_count'>
                  <p className='modal_p'>Билеты</p>
                  <div className='modal_count_edit'>
                    <FaMinus className='modal_plus_minus' onClick={minusCount}/>
                    <input type='number' value={count} onChange={handleCountChange} className='modal_count_count'></input>
                    <FaPlus className='modal_plus_minus' onClick={addCount}/>
                  </div>
                </div>
                <div className='tour_about_children_container'>
                    <p>Дети до 14 лет</p>
                    <Switch checked={showKids} onChange={toggleShowKids} color="default" />
                  </div>
                  {showKids && (
                    <div className='modal_count'>
                      <p className='modal_p'>Дети</p>
                      <div className='modal_count_edit'>
                        <FaMinus className='modal_plus_minus' onClick={minusKidsCount} />
                        <input type='number' value={kidsCount} onChange={handleKidsCountChange} className='modal_count_count' />
                        <FaPlus className='modal_plus_minus' onClick={addKidsCount} />
                      </div>
                    </div>
                  )}
                {(count && isCor && isCor.isOk) && (
                  <>
                     <div>
                      <p>Выберите номера : </p>
                      <TbReload onClick={() => checkData(id, dateRange[0], dateRange[1], count).then(data => setIsCor(data))}/>
                      {dateRange[0] && dateRange[1] && dateRange[0]>date? (
                          count ? (
                            isCor.isOk ? (
                              <>
                                <HotelNumberPicker selectedNumbers={selectedNumbers} onSelect={handleNumberSelect} rooms={isCor.rooms} count={count}/>
                                {(selectedNumbers && selectedNumbers.length === (count + kidsCount)) && (
                                  <>
                                    <div style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                                      <p style={{margin:'0'}}>Стоимость : {price>0?price : hotel.price}</p>
                                      <button onClick={addToCart}>Добавить в корзину</button>
                                    </div>
                                  </>
                                )}
                              </>
                            ) : (
                              <p>Нет доступных номеров</p>
                            )
                          ) : (
                            <p>Введите количество</p>
                          )
                        ) : (
                          <p>Введите промежуток дат</p>
                        )
                      }
                    </div>
                  </>
                )}            
            </>)}
            </div>
          </div>
        </div>
        :<></>
      }
    </div>
  );
}

export default HotelAbout;
