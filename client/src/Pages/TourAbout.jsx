import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../Styles/TourAbout.css";
import BeforeFooter from '../Components/BeforeFooter';
import { addTourToCart, checkValidableData, createReview, fetchOneTour, getTourReviews } from '../http/tourApi';
import DatePicker from "react-datepicker";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import MapComponent from "../Components/GoogleMaps/MapComponent"
import PhotoSlider from '../Components/PhotoSlider/PhotoSlider';
import Rating from '@mui/material/Rating';
import CustomTextField from '../Components/mui/CustomTextField';
import Switch from '@mui/material/Switch';

function TourAbout() {
  const { id } = useParams();
  const [tour, setTour] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [count, setCount] = useState(1);
  const [reviews,setReviews] = useState([])
  const [freeCount,setFreeCount] = useState()
  const [kidsCount, setKidsCount] = useState(0);
  const [showKids, setShowKids] = useState(false);
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const result = await fetchOneTour(id);
        setTour(result);
        const reviewsData = await getTourReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Ошибка получения данных:', error);
      }
    };
  
    fetchTourData();
  }, [id]);

  console.log(reviews)

  useEffect(() => {
    if(tour && tour.price){
      let totalKidsPrice = 0
      if(showKids){
        totalKidsPrice = tour.price * kidsCount * 0.55;
      }      
      const totalAdultPrice = tour.price * count;
      setPrice(totalKidsPrice + totalAdultPrice);
    }
    
  },[kidsCount,count,showKids])

  

  const openModal = () => {
    const token = localStorage.getItem('token')
    if(!token){
      alert('Не авторизован') 
      return
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    const date_1 = ConvertDates(date.toLocaleDateString('ru-RU'))
    const data = await checkValidableData(date_1,id)
    setFreeCount(data)
  };

  const intervalRef = useRef(null);
  const delay = 2000;
  const interval = 100;

  const addCount = useCallback(() => {
    setCount((prevCount) => {
      if (freeCount && prevCount < freeCount.count - kidsCount) {
        return prevCount + 1;
      }
      return prevCount;
    });
  }, [freeCount?.count, kidsCount]);

  const minusCount = useCallback(() => {
    setCount((prevCount) => {
      if (prevCount > 1) {
        return prevCount - 1;
      }
      return prevCount;
    });
  }, []);

  const handleMouseDown = (action) => {
    if (action === 'add') {
      addCount();
      intervalRef.current = setInterval(addCount, interval);
    } else if (action === 'minus') {
      minusCount();
      intervalRef.current = setInterval(minusCount, interval);
    }
  };

  const handleMouseUp = () => {
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
  };

  const addKidsCount = useCallback(() => {
    setKidsCount((prevCount) => {
      if (freeCount && prevCount < freeCount.count - count) {
        return prevCount + 1;
      }
      return prevCount;
    });
  }, [freeCount?.count, count]);

  const minusKidsCount = useCallback(() => {
    setKidsCount((prevCount) => {
      if (prevCount >= 1) {
        return prevCount - 1;
      }
      return prevCount;
    });
  }, []);

  const handleKidsMouseDown = (action) => {
    if (action === 'add') {
      addKidsCount();
      intervalRef.current = setInterval(addKidsCount, interval);
    } else if (action === 'minus') {
      minusKidsCount();
      intervalRef.current = setInterval(minusKidsCount, interval);
    }
  };
  
  const handleKidsMouseUp = () => {
    clearInterval(intervalRef.current);
  };
  
  const handleKidsMouseLeave = () => {
    clearInterval(intervalRef.current);
  };

  const toggleShowKids = () => {
    if(!showKids){
      setKidsCount(0)
    }
    setShowKids(!showKids);
  };

  const handleCountChange = (e) => {
    const value = parseInt(e.target.value)
    if(value<=freeCount.count-kidsCount){
      setCount(value)
    }
  }

  const handleKidsCountChange = (e) => {
    const value = parseInt(e.target.value);
    if(value<=freeCount.count-kidsCount){
      setKidsCount(value)
    }
  }

  const ConvertDates = (date) => {
    const dateParts = date.split(".");
    const dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const formattedDate = dateObject.toISOString().slice(0, 10);
    return formattedDate
  }

  const addToCart = async () => {
    try {
      if (selectedDate) {
          const date_1 = ConvertDates(selectedDate.toLocaleDateString('ru-RU'))
          const tourCount = [count,kidsCount].join(',')
          const createdTour = await addTourToCart(tourCount,date_1,id,price)
          if(createdTour){
            alert('Успешно')
            setSelectedDate(null)
            setCount(1)
            setKidsCount(0)
            setShowKids(false)
            closeModal()
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
        await createReview(reviewText,reviewRate,id)
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
  return (
    <div className='tour_about_container'>
      <div className='tour_about_container_container'>
        {tour && (
          <>
            <div className='photo_block_text_container'>
              {tour.img && tour.img.length > 0 && (
                <div className='tour_about_img'><PhotoSlider imgs={tour.img}/></div>
              )}
              <div className='text_block_container'>
                <div>
                  <h1 className='tour_name_h'>{tour.name}</h1>
                  {tour.location && tour.location.length>0 && (
                    <div className='tour_about_map'><MapComponent location={tour.location} name = {tour.name}/></div>
                  )} 
                  <Rating name="read-only" value={tour.rating} size="large" readOnly className='rate_stars_info'/>
                  <h2 className='city_block_text'>г.{tour.city}</h2>
                </div>
                <div className='price_container'>
                  <div className='valute_tour_about'>
                    <p className='tour_about_price'>{tour.price}</p>
                    <p className='valute_text'>BYN</p>
                  </div>
                  <button onClick={openModal} className='tour_about_button'>Добавить в корзину</button>
                </div>
              </div>
            </div>
            <div>
              {tour.info && tour.info.length > 0 && (
                <p className='tour_about_info'>{tour.info[0].description}</p>
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
                    <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                      <Rating name="read-only" value={review.rate} size="large" readOnly />
                      {review.createdAt && (
                        <p className='p_review'>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</p>
                      )}
                    </div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                      {review.description && <p className='p_review'>{review.description}</p>}
                    </div>
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
                selected={selectedDate}
                inline
                onChange={handleDateChange}
              />
              <p>Ваш срок : {selectedDate>Date.now() ? selectedDate.toLocaleDateString('ru-RU') : 'Неверная дата'}</p>
            </div>
            {(selectedDate > Date.now() && freeCount && freeCount.isOk) && (
                <>
                  {freeCount ? (
                    freeCount.isOk ? (
                      <p>Свободно: {freeCount.count}</p>
                    ) : (
                      <p>Нет доступных мест</p>
                    )
                  ) : (
                    <p>Информация о доступных местах отсутствует</p>
                  )}
                  <div className='modal_count'>
                    <p className='modal_p'>Билеты</p>
                    <div className='modal_count_edit'>
                      <FaMinus className='modal_plus_minus' 
                        onMouseDown={() => handleMouseDown('minus')}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={() => handleMouseDown('minus')}
                        onTouchEnd={handleMouseUp}
                        onTouchCancel={handleMouseLeave}
                      />
                      <input type='number' value={count} onChange={handleCountChange} className='modal_count_count' />
                      <FaPlus className='modal_plus_minus' 
                        onMouseDown={() => handleMouseDown('add')}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={() => handleMouseDown('add')}
                        onTouchEnd={handleMouseUp}
                        onTouchCancel={handleMouseLeave}
                      />
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
                        <FaMinus className='modal_plus_minus' 
                          onMouseDown={() => handleKidsMouseDown('minus')}
                          onMouseUp={handleKidsMouseUp}
                          onMouseLeave={handleKidsMouseLeave}
                          onTouchStart={() => handleKidsMouseDown('minus')}
                          onTouchEnd={handleKidsMouseUp}
                          onTouchCancel={handleKidsMouseLeave}
                        />
                        <input type='number' value={kidsCount} onChange={handleKidsCountChange} className='modal_count_count' />
                        <FaPlus className='modal_plus_minus' 
                          onMouseDown={() => handleKidsMouseDown('add')}
                          onMouseUp={handleKidsMouseUp}
                          onMouseLeave={handleKidsMouseLeave}
                          onTouchStart={() => handleKidsMouseDown('add')}
                          onTouchEnd={handleKidsMouseUp}
                          onTouchCancel={handleKidsMouseLeave}
                        />
                      </div>
                    </div>
                  )}
                  <div style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                    <p style={{margin:'0'}}>Стоимость : {price>0?parseInt(price) : parseInt(tour.price)}</p>
                    <button onClick={addToCart}>Добавить в корзину</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        :<></>
      }
    </div>
  );
}

export default TourAbout;
