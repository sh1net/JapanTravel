import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import "../Styles/TourAbout.css";
import BeforeFooter from '../Components/BeforeFooter';
import MapComponent from "../Components/GoogleMaps/MapComponent"
import PhotoSlider from '../Components/PhotoSlider/PhotoSlider';
import Rating from '@mui/material/Rating';
import { addCombToBasket, checkCombData, comboReviews, createCombReviews, fetchOneComb } from '../http/combApi';
import { TOURABOUT_ROUTE } from '../utils/consts';
import CustomTextField from '../Components/mui/CustomTextField';
import DatePicker from "react-datepicker";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import HotelNumberPicker from '../Components/HotelNumberPicker';
import { checkValidableData } from '../http/tourApi';

function ComboTourAbout() {
  const { id } = useParams();
  const [combTour, setCombTour] = useState();
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  const [reviews,setReviews] = useState([])
  const [freeCount,setFreeCount] = useState()

  useEffect(()=>{
      const fetchData = async () => {
          try {
            const result = await fetchOneComb(id);
            if(result){
              setCombTour(result)
            }
            const reviewsData = await comboReviews(id);
            setReviews(reviewsData);
          } catch (e) {
            console.log(e.message);
          }
        };
        fetchData();
  },[id])
  
  const toggleServicesVisibility = () => {
    setIsServicesVisible(!isServicesVisible);
  };

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

  const [valid,setValid] = useState(false)
  const [error,setError] = useState(false)
  const [helperText,setHelperText] = useState('')

  const handleCancel = () => {
    setReviewRate(0)
    setReviewText('')
  }

  const sendReview = async () => {
    try{
      const token = localStorage.getItem('token')
      if(!token){
        alert('Не авторизован') 
        return
      }
      if(reviewText!==undefined && reviewText.length>0 && reviewText!==''){
        console.log(valid,error,helperText, reviewText)
        await createCombReviews(reviewText,reviewRate,id)
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openModal = () => {
    const token = localStorage.getItem('token')
    if(!token){
      alert('Не авторизован') 
      return
    }
    setIsModalOpen(true)
  }

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

  const [isCor, setIsCor] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const [count, setCount] = useState(1);
  const [kidsCount, setKidsCount] = useState(0);
  const [showKids, setShowKids] = useState(false);
  const [price, setPrice] = useState(0)
  const [tourDates, setTourDates] = useState()
  const date = new Date()
  const [selectedNumbers,setSelectedNumbers] = useState([])
  const [tourDateRanges, setTourDateRanges] = useState(combTour ? Array(combTour.tours.length).fill(null) : []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1] && count && combTour) {
      const fetchData = async () => {
        try {
          setTourDateRanges(Array(combTour.tours.length).fill(null));
          const roomsCount = count+kidsCount
          const tourIds = combTour.tours.map(tour => tour.id).join(',')
          const data = await checkCombData(dateRange[0], dateRange[1], tourDates, tourIds, combTour.hotel.id, roomsCount, id);
          setIsCor(data);
        } catch (e) {
          console.log('Error fetching data:', e.message);
        }
      };
      fetchData();
    }
  }, [id, dateRange, count, kidsCount, combTour]);

  
  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const ConvertDates = (date) => {
    const dateParts = date.split(".");
    const dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const formattedDate = dateObject.toISOString().slice(0, 10);
    return formattedDate
  }

  const formattedDateRange = dateRange.map(date => date ? date.toLocaleDateString('ru-RU') : '').join(' - ');

  useEffect(() => {
    if(combTour && combTour.hotel && combTour.hotel.price && selectedNumbers){
      const totalBeds = selectedNumbers.reduce((acc, [roomNumber, beds]) => acc + beds, 0);
      let totalKidsPrice = 0
      let toursPrice = combTour.tours.reduce((acc, tour) => acc + tour.price, 0);

      //Начальная стоимость
      const initialPrice = (combTour.hotel.price + toursPrice)* 0.6
      
      // Расчет количества дней
      const days = (dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24);

      // Расчет общей стоимости для взрослых
      const totalAdultPrice = initialPrice * 0.1 + initialPrice * (0.05 * (days - 1)) * totalBeds;
      
      // Расчет общей стоимости для детей
      if (showKids) {
        totalKidsPrice = initialPrice * 0.4 * kidsCount;
      }

      setPrice(totalKidsPrice + totalAdultPrice);
    }
    
  },[kidsCount, showKids, selectedNumbers, dateRange])

  const toggleShowKids = () => {
    setShowKids(!showKids);
    if(!showKids){
      setKidsCount(0)
    }
  };


  const intervalRef = useRef(null);
  const delay = 2000;
  const interval = 100;

  const addCount = useCallback(() => {
    setCount((prevCount) => {
      if (isCor && prevCount < isCor.count - kidsCount) {
        return prevCount + 1;
      }
      return prevCount;
    });
  }, [isCor?.count, kidsCount]);

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
      if (isCor && prevCount < isCor.count - count) {
        return prevCount + 1;
      }
      return prevCount;
    });
  }, [isCor?.count, count]);

  const minusKidsCount = useCallback(() => {
    setKidsCount((prevCount) => {
      if (prevCount > 1) {
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

  const handleCountChange = (e) => {
    const value = parseInt(e.target.value)
    if(value<=isCor.count-kidsCount){
      setCount(value)
    }
  }

  const handleKidsCountChange = (e) => {
    const value = parseInt(e.target.value);
    if(value<=isCor.count-kidsCount){
      setKidsCount(value)
    }
  }

  const handleNumberSelect = (numbers) => {
    setSelectedNumbers(numbers)
  }

  const handleTourDateChange = async (index, date) => {
    const updatedTourDateRanges = [...tourDateRanges];
    updatedTourDateRanges[index] = date;
    setTourDateRanges(updatedTourDateRanges);
    const promises = updatedTourDateRanges.map((tourDate, idx) => {
      if (!tourDate) return Promise.resolve(null);
      const formattedDate = ConvertDates(tourDate.toLocaleDateString('ru-RU'));
      return checkValidableData(formattedDate, combTour.tours[idx]);
    });
    // Выполняем все запросы параллельно
    const dataResults = await Promise.all(promises);

    // Обработка результатов
    dataResults.forEach((data, idx) => {
      const id = combTour.tours[idx];
      setFreeCount((prevFreeCount) => ({
        ...prevFreeCount,
        [id]: data,
      }));
    });
  };  

  const addToCart = async () => {
    try {
      if (formattedDateRange && count && selectedNumbers && kidsCount) {
        if (selectedNumbers.reduce((sum,current) => {
          return sum+current[1]
        },0) === (count + kidsCount)) {
          const dates = formattedDateRange.split(' - ')
          const dateIn = ConvertDates(dates[0])
          const dateOut = ConvertDates(dates[1])
          const allCount = [count,kidsCount].join(',')
          const data = await addCombToBasket(id, allCount, tourDateRanges, dateIn, dateOut, price, selectedNumbers)
          if(data){
            alert('Успешно')
            closeModal()
          }
        }
      }
    } catch (e) {
      alert(e.response?.data.message || 'Произошла ошибка');
    }
  }

  return (
    <div className='tour_about_container'>
      <div className='tour_about_container_container'>
        {combTour && combTour.hotel&& combTour.tours && (
          <>
            <div className='photo_block_text_container'>
              {combTour.hotel.img && combTour.hotel.img.length > 0 && (
                <div className='tour_about_img'><PhotoSlider imgs={combTour.hotel.img}/></div>
              )}
              <div className='text_block_container'>
                <div>
                  <h1 className='tour_name_h'>{combTour.hotel.name}</h1>
                  {combTour.hotel.location && combTour.hotel.location.length>0 && (
                    <div className='tour_about_map'><MapComponent location={combTour.hotel.location} name = {combTour.hotel.name}/></div>
                  )} 
                  <Rating name="read-only" value={combTour.rating} size="large" readOnly className='rate_stars_info'/>
                  <h2 className='city_block_text'>г.{combTour.hotel.city}</h2>
                </div>
                <div className='price_container'>
                  <div className='valute_tour_about'>
                    <p className='tour_about_price'>{combTour.hotel.price}</p>
                    <p className='valute_text'>BYN</p>
                  </div>
                  <button className='tour_about_button' onClick={openModal}>Добавить в корзину</button>
                </div>
              </div>
            </div>
            <div>
              {combTour.hotel.info && combTour.hotel.info.length > 0 && (
                <p className='tour_about_info'>{combTour.hotel.info[0].description}</p>
              )}
            </div>
            <hr></hr>
            <div className='toggle_services_container'>
              <button className='toggle_services_button' onClick={toggleServicesVisibility}>
                {isServicesVisible ? 'Скрыть экскурсии' : 'Показать экскурсии'}
              </button>
              {isServicesVisible && (
                <div className='tour_about_services_container'>
                  {combTour.tours.map((tour, index) => (
                    <Link to={`${TOURABOUT_ROUTE}/${tour.id}`} key={tour.id} className="grid-item" style={{ backgroundImage: `url(${'http://localhost:5000/' + tour.img[0]})` }}>
                      <div className='tour_main_info'>
                        <p className='tour_name'>{tour.name}</p>
                        <div className='tour_details'>
                          <div className='price_button_tour'>
                            <p style={{ fontSize: '25px', margin: '0' }}>г.{tour.city}</p>
                            <p className='tour_rating'><Rating name="read-only" value={combTour.rating} readOnly /></p>
                          </div>
                          <div className='price_button_tour'>
                            <p className='tour_price'>{tour.price}byn</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
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
                    {review.description && <p className='p_review'>{review.description}</p>}
                    <hr></hr>
                  </div>))
                ) : (
                  <h2 style={{color:'black'}}>Оставьте первый отзыв!</h2>)}
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
                <div className='modal_dates_ranges_container'>
                  <p>Начало: {dateRange[0] ? dateRange[0].toLocaleDateString('ru-RU') : ''}</p>
                  <p>Конец: {dateRange[1] ? dateRange[1].toLocaleDateString('ru-RU') : ''}</p>
                </div>
              </div>
              {(dateRange[0] > Date.now() && dateRange[1]) && (
                <>
                  <div className='modal_count'>
                    <p className='modal_p'>Билеты</p>
                    <div className='modal_count_edit'>
                      <FaMinus 
                        className='modal_plus_minus' 
                        onMouseDown={() => handleMouseDown('minus')}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={() => handleMouseDown('minus')}
                        onTouchEnd={handleMouseUp}
                        onTouchCancel={handleMouseLeave}
                      />
                      <input type='number' value={count} onChange={handleCountChange} className='modal_count_count'></input>
                      <FaPlus
                        className='modal_plus_minus'
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
                  {(count && isCor && isCor.isOk) && (
                    <>
                      <div>
                      <p>Выберите номера : </p>
                        {dateRange[0] && dateRange[1] && dateRange[0]>date? (
                          <>
                            <HotelNumberPicker selectedNumbers={selectedNumbers} onSelect={handleNumberSelect} rooms={isCor.rooms} count={count}/>
                          </>
                        ) : (
                          <p>Введите промежуток дат</p>
                        )
                      }
                      </div>
                    </>
                  )}
                  {dateRange[0] && dateRange[1] && dateRange[0] > date && (
                    <div className='tour_dates_block'>
                      <h3>Выберите даты для каждого тура:</h3>
                      {combTour.tours.map((tour, index) => (
                        <div key={tour.id} className='tour_date_picker'>
                          <h4>{tour.name}</h4>
                          <DatePicker
                            selected={tourDateRanges[index]}
                            onChange={(date) => handleTourDateChange(index, date)}
                            inline
                            minDate={dateRange[0]}
                            maxDate={dateRange[1]}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {(selectedNumbers && tourDateRanges && tourDateRanges.length>0 && selectedNumbers.reduce((sum,current) => {
                    return sum+current[1]
                  },0) >= (count + kidsCount)) && (
                    <>
                      <div style={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
                        <p style={{margin:'0'}}>Стоимость : {price} byn</p>
                        <button onClick={addToCart}>Добавить в корзину</button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        :
        <></>
      }
    </div>
  );
}

export default ComboTourAbout;
