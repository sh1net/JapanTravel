import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserReviews, selectUser, selectUserReviews, setIsAuth, setUser } from '../Redux/authSlice';
import { checkPassword, getUserData, logout, updateUser } from '../http/userApi';
import HeaderImage from "../Components/HeaderImage/HeaderImage"
import EditIcon from "../Image/EditIcon.png"
import { GiSamuraiHelmet } from "react-icons/gi";
import { FaEdit } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import "../Styles/User.css"
import { fetchHotelsAsync, selectHotels } from '../Redux/hotelSlice';
import {fetchToursAsync, selectTours} from '../Redux/tourSlice'
import { fetchCombToursAsync, selectCombTours} from '../Redux/combSlice'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {  fetchComboHistoryAsync, fetchHotelsHistoryAsync, fetchToursHistoryAsync, selectBasketCombo, selectBasketHotels, selectBasketTours } from '../Redux/basketSlice';
import {ReactToPrint} from 'react-to-print'
import Rating from '@mui/material/Rating';
import { FaTrash } from "react-icons/fa";

const User = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false)
  const [isPassEditing, setIsPassEditing] = useState(false)
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('')
  const [emailError, setEmailError] = useState('')

  const [isPassUpdated, setIsPassUpdated] = useState(false)
  
  const [updatedUser,setUpdatedUser] = useState({
    nickname:user.nickname,
    email:user.email,
    oldPassword:'',
    newPassword:'',
    verifyPassword:'',
  })
  const [imageFile, setImageFile] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null)
  const [tabPage,setTabPage] = useState(0)
  const hotels = useSelector(selectHotels)
  const basketHotels = useSelector(selectBasketHotels);
  const tours = useSelector(selectTours)
  const basketTours = useSelector(selectBasketTours)
  const combos = useSelector(selectCombTours)
  const basketCombo = useSelector(selectBasketCombo)
  const userReviews = useSelector(selectUserReviews)
  const [expandedItemId, setExpandedItemId] = useState(null);

  const toggleExpand = (id) => {
        setExpandedItemId(prevId => (prevId === id ? null : id));
  };

  const checkPass = async () => {
    try{
      if(updatedUser.oldPassword){
        const isPassVal = await checkPassword(updatedUser.oldPassword)
        if(isPassVal){
          setOldPasswordError('')
          if(updatedUser.newPassword){
            setNewPasswordError('')
            if(updatedUser.newPassword === updatedUser.verifyPassword){
              setVerifyPasswordError('')
              setUpdatedUser({ ...updatedUser, newPassword: updatedUser.newPassword });
              setIsPassUpdated(isPassVal)
              setIsPassEditing(!isPassEditing)
            }else{
              setVerifyPasswordError('Пароли не совпадают')
            }
          }else{
            setNewPasswordError('Введите новый пароль')
          }
        }else{
          setOldPasswordError('Некоректный старый пароль')
        }
      }else{
        setOldPasswordError('Введите старый пароль')
      }
    }catch(e){

    }
  } 

  const unAuth = () => {
    dispatch(setIsAuth(false));
    dispatch(setUser({}));
    logout();
    navigate('/');
  };

  const handleUserUpdate = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    if(e.target.name === 'nickname') setNicknameError('')
    if(e.target.name === 'email') setEmailError('')
    if(e.target.name === 'oldPassword') setOldPasswordError('')
    if(e.target.name === 'newPassword') setNewPasswordError('')
    if(e.target.name === 'verifyPassword') setVerifyPasswordError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result;
      setNewImageFile(imageDataUrl);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const updateUserFunc = async () => {
    try {
      const formData = new FormData();
      formData.append('img', imageFile);
      if(!isNicknameEditing){
        formData.append('nickname', updatedUser.nickname);
      }
      else{
        setNicknameError('Закройте или подтвердите форму')
        return;
      }
      if(!isEmailEditing){
        formData.append('email', updatedUser.email);
      }
      else{
        setEmailError('Закройте или подтвердите форму')
        return;
      }
      if(!isPassEditing && isPassUpdated){
        formData.append('newPassword',updatedUser.newPassword)
      }
      if(nicknameError === '' && emailError === '' && oldPasswordError === '' && newPasswordError==='' && verifyPasswordError === ''){
        await updateUser(formData);
        setIsModalOpen(false);
        setNewImageFile(null);
        setImageFile(null);
        setIsPassUpdated(false);
        window.location.reload();
      }
      
    } catch (e) {
      console.error(e.response?.data.message || 'Произошла ошибка');
    }
  }
  
  const handleNicknameEditToggle = (e) => {
    if (isNicknameEditing) {
      setUpdatedUser({ ...updatedUser, nickname: user.nickname });
    }
    setIsNicknameEditing(!isNicknameEditing);
  };
  
  const handleEmailEditToggle = (e) => {
    if (isEmailEditing) {
      setUpdatedUser({ ...updatedUser, email: user.email });
    }
    setIsEmailEditing(!isEmailEditing);
  };
  
  const handlePassEditToggle = (e) => {
    if (isPassEditing) {
      setUpdatedUser({ ...updatedUser, password: user.password });
    }
    setIsPassEditing(!isPassEditing);
  };
  
  const handleCancelEdit = (key) => {
    setUpdatedUser({ ...updatedUser, [key]: user[key] });
    if (key === 'nickname') {
      setNicknameError('')
      setIsNicknameEditing(false);
    } else if (key === 'email') {
      setEmailError('')
      setIsEmailEditing(false);
    } else if (key === 'password') {
      setOldPasswordError('')
      setNewPasswordError('')
      setVerifyPasswordError('')
      setIsPassEditing(false);
      setIsPassUpdated(false)
    }
  };
  

  const handleAccept = (key) => {
    setUpdatedUser({ ...updatedUser, [key]: updatedUser[key] });
    if(key === 'nickname' && isNicknameEditing && updatedUser.nickname){
      setNicknameError('')
      setIsNicknameEditing(!isNicknameEditing)
    }
    if(key === 'email' && isEmailEditing && updatedUser.email){
      setEmailError('')
      setIsEmailEditing(!isEmailEditing)
    }
    else {
      if(key==='nickname' && !updatedUser.nickname) setNicknameError('Введите имя')
      if(key==='email' && !updatedUser.email) setEmailError('Введите почту')
      return;
    }
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNicknameError('')
    setIsNicknameEditing(false);
    setIsModalOpen(false);
    setEmailError('')
    setIsEmailEditing(false);
    setOldPasswordError('')
    setNewPasswordError('')
    setVerifyPasswordError('')
    setIsPassEditing(false);
    setIsPassUpdated(false)
    setNewImageFile(null);
    setImageFile(null);
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

  useEffect(() => {
    if (user) {
      setUpdatedUser({
        nickname: user.nickname || "",
        email: user.email || "",
        password: user.password || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const userData = await getUserData()
        dispatch(setUser(userData));
      }
      catch(error){
        console.error("Упс ошибочка")
      }
    }
    fetchData();
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchHotelsHistoryAsync());
    dispatch(fetchToursHistoryAsync())
    dispatch(fetchComboHistoryAsync())
}, [dispatch]);

useEffect(() => {
  dispatch(fetchHotelsAsync());
  dispatch(fetchToursAsync());
  dispatch(fetchCombToursAsync())
  dispatch(getAllUserReviews())
}, [dispatch]);

  return (
    <div className='user_page_container'>
      <HeaderImage blurBackground={true}>
        <div className='user_page_panel'>
          <GiSamuraiHelmet 
            className={tabPage === 0 ? 'icon active' : 'icon'}
            onClick={() => setTabPage(0)}
          />
          <FaEdit 
            className='icon' 
            onClick={openModal} 
          />
          <FaStar
            className={tabPage === 1 ? 'icon active' : 'icon'}
            onClick={() => setTabPage(1)}
          />
          <FaHistory 
            className={tabPage === 2 ? 'icon active' : 'icon'}
            onClick={() => setTabPage(2)}
          />
          <RxExit 
            className='icon'
            onClick={unAuth}
          />
        </div>
      <div className='profile_container'>
        {tabPage === 0 
        ?
          <div className='user_info_container'>
            <h1 style={{color:'white',marginTop:'0'}}>Профиль</h1>
            <div className='block_block_block'>
              <div className='user_info'>
                <div className='user_nickname'>
                  <p>Имя пользователя : <br></br>{user.nickname ? user.nickname : "-"}</p>
                  <hr></hr>
                </div>
                <div className='user_email'>
                  <p>Почта пользователя : <br></br>{user.email}</p>
                  <hr></hr>
                </div>
              </div>
              <div className='user_avatar'>
                <div className='avatar' style={{ backgroundImage: `url(${'http://localhost:5000/' + user.img})`}}></div>
              </div>
            </div>
          </div>
          :<></>
        }
        {tabPage === 1
        ? <div style={{overflowY: 'auto',paddingRight:'20px'}}>
            <h1 style={{color:'white',padding:'0',margin:'0'}}>Отзывы</h1>
            {userReviews && userReviews.length>0 ? (
              <div className='reviews_container'>
                {userReviews.map((review,index) => {
                  return(
                    <div className='flex_jesko'>
                      <div key={review.id} className='review_item user_review'>
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
                      </div>
                      <button className='admin_controller_toogle_button'><FaTrash/></button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <h1>Нет отзывов</h1>
            )}
          </div>
        :<></>
        }
        {tabPage === 2
        ? <div style={{overflowY: 'auto',paddingRight:'20px'}}>
            {basketHotels && basketHotels.length>0 && (
              <>
                <h1 style={{color:'white',margin:'0',padding:'0'}}>История покупок Отелей</h1>
                <div className='history_page_container'>                  
                  {basketHotels && basketHotels.length>0 && basketHotels.map(item => {
                    const hotel = hotels.find(h => h.id === item.hotelId);
                    const formattedDateIn = item.date_in ? new Date(item.date_in).toLocaleDateString('ru-RU') : '';
                    const formattedDateOut = item.date_out ? new Date(item.date_out).toLocaleDateString('ru-RU') : '';
                    const formattedDateRange = formattedDateIn && formattedDateOut ? `${formattedDateIn} - ${formattedDateOut}` : '';
                    const isExpanded = expandedItemId === item.id;
                    return (
                      <div key={item.id} className='history_page_item'>
                          <div onClick={() => toggleExpand(item.id)}  className='history_page_summary'>
                            <div>
                                <p>{hotel ? hotel.name : 'не определено'}</p>
                                <p>{formattedDateRange}</p>
                            </div>
                            <div className='chevron_icon'>
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                          {isExpanded && (
                            <>
                            <div className='extra_info' ref={componentRef}>
                              <p>{hotel ? hotel.name : 'не определено'}</p>
                              <p>{formattedDateRange}</p>
                              <p>ФИО: {item.fullName.join(' ')}</p>
                              <p>Всего билетов: {item.count.reduce((accumulator, currentValue) => accumulator + currentValue, 0)} (Детские: {item.count[1]})</p>
                              <p>Оплачено: {item.price} (белорусских рублей)</p>
                              <p>Комнаты: {Array.isArray(item.rooms) ? item.rooms.map((item, index, array) => `${item[0]}(Мест:${item[1]})${index+1===array.length? '': ', '}`) : item.rooms.join('-')}</p>
                              <p>Дополнительная информация</p>
                              <p>Номер телефона: {item.phoneNumber}</p>
                              <p>Номер паспорта: {item.pasportNumber}</p>
                              <p>Такси: {item.taxi && item.taxi.length>0 ? `Имя: ${item.taxi[0]}, Табличка: ${item.taxi[1]}` : 'нет'}</p>
                              <p>Помощник: {item.helper && item.helper.length>0 ? `Имя: ${item.helper[0]}, Табличка: ${item.helper[1]}` : 'нет'}</p>
                              <p>Гид: {item.guide && item.guide.length>0 ? `Имя: ${item.guide[0]}, Табличка: ${item.guide[1]}` : 'нет'}</p>
                            </div>
                            <div>
                            <ReactToPrint
                              trigger={()=>{
                                return <button className='pdf_button'>Распечатать</button>
                              }}
                              content={() => componentRef.current}
                              documentTitle='Билет JapanTravel'
                              pageStyle="print"
                            />
                          </div></>
                          )}
                      </div>
                    );
                  })}              
                </div>
              </>
            )}
            {basketTours && basketTours.length>0 && (
              <>
                <h1 style={{color:'white'}}>История покупок Достопримечательностей</h1>
                <div className='history_page_container'>
                  {basketTours && basketTours.length>0 && basketTours.map(item => {
                    const tour = tours.find(t => t.id === item.tourId);
                    const formattedDate = item.date ? new Date(item.date).toLocaleDateString('ru-RU') : '';
                    const isExpanded = expandedItemId === item.id;
                    return (
                      <div key={item.id} className='history_page_item'>
                          <div onClick={() => toggleExpand(item.id)}  className='history_page_summary'>
                            <div>
                                <p>{tour ? tour.name : 'не определено'}</p>
                                <p>{formattedDate}</p>
                            </div>
                            <div className='chevron_icon'>
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                          {isExpanded && (
                            <>
                            <div className='extra_info' ref={componentRef}>
                              <p>{tour ? tour.name : 'не определено'}</p>
                              <p>{formattedDate}</p>
                              <p>ФИО: {item.fullName.join(' ')}</p>
                              <p>Всего билетов: {item.count.reduce((accumulator, currentValue) => accumulator + currentValue, 0)} (Детские: {item.count[1]})</p>
                              <p>Оплачено: {item.price} (белорусских рублей)</p>
                              <p>Дополнительная информация</p>
                              <p>Номер телефона: {item.phoneNumber}</p>
                              <p>Номер паспорта: {item.pasportNumber}</p>
                              <p>Такси: {item.taxi && item.taxi.length>0 ? `Имя: ${item.taxi[0]}, Табличка: ${item.taxi[1]}` : 'нет'}</p>
                              <p>Помощник: {item.helper && item.helper.length>0 ? `Имя: ${item.helper[0]}, Табличка: ${item.helper[1]}` : 'нет'}</p>
                              <p>Гид: {item.guide && item.guide.length>0 ? `Имя: ${item.guide[0]}, Табличка: ${item.guide[1]}` : 'нет'}</p>
                            </div>
                            <div>
                            <ReactToPrint
                              trigger={()=>{
                                return <button className='pdf_button'>Распечатать</button>
                              }}
                              content={() => componentRef.current}
                              documentTitle='Билет JapanTravel'
                              pageStyle="print"
                            />
                          </div></>
                          )}
                      </div>
                    );
                  })}              
                </div>
              </>
            )}
            {basketCombo && basketCombo.length>0 && (
              <>
                <h1 style={{color:'white'}}>История покупок Туров</h1>
                <div className='history_page_container'>
                  {basketCombo && basketCombo.length>0 && basketCombo.map((item) => {
                    const combo = combos.find(h => h.id === item.combinedTourId);
                    const formattedDateIn = item.date_in ? new Date(item.date_in).toLocaleDateString('ru-RU') : '';
                    const formattedDateOut = item.date_out ? new Date(item.date_out).toLocaleDateString('ru-RU') : '';
                    const formattedDateRange = formattedDateIn && formattedDateOut ? `${formattedDateIn} - ${formattedDateOut}` : '';
                    const isExpanded = expandedItemId === item.id;
                    return (
                      <div key={item.id} className='history_page_item'>
                          <div onClick={() => toggleExpand(item.id)}  className='history_page_summary'>
                            <div>
                                <p>{combo?.hotel?.name ? combo.hotel.name : 'не определено'}</p>
                                <p>{formattedDateRange}</p>
                            </div>
                            <div className='chevron_icon'>
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                          {isExpanded && (
                            <>
                            <div className='extra_info' ref={componentRef}>
                              <p style={{fontSize:'20px'}}>{combo?.hotel?.name ? combo.hotel.name : 'не определено'}</p>
                              <p style={{fontSize:'20px'}}>{formattedDateRange}</p>
                              {combo.tours.map((tour, index) => {
                                const tourDate = new Date(item.date[index]).toLocaleDateString('ru-RU');
                                return (
                                  <p key={index} style={{fontSize:'20px'}}>{tour.name}: {tourDate}</p>
                                );
                              })}
                              <p>ФИО: {item.fullName.join(' ')}</p>
                              <p>Всего билетов: {item.count.reduce((accumulator, currentValue) => accumulator + currentValue, 0)} (Детские: {item.count[1]})</p>
                              <p>Оплачено: {item.price} (белорусских рублей)</p>
                              <p>Комнаты: {Array.isArray(item.rooms) ? item.rooms.map((item, index, array) => `${item[0]}(Мест:${item[1]})${index+1===array.length? '': ', '}`) : item.rooms.join('-')}</p>
                              <p>Дополнительная информация</p>
                              <p>Номер телефона: {item.phoneNumber}</p>
                              <p>Номер паспорта: {item.pasportNumber}</p>
                              <p>Такси: {item.taxi && item.taxi.length>0 ? `Имя: ${item.taxi[0]}, Табличка: ${item.taxi[1]}` : 'нет'}</p>
                              <p>Помощник: {item.helper && item.helper.length>0 ? `Имя: ${item.helper[0]}, Табличка: ${item.helper[1]}` : 'нет'}</p>
                              <p>Гид: {item.guide && item.guide.length>0 ? `Имя: ${item.guide[0]}, Табличка: ${item.guide[1]}` : 'нет'}</p>
                            </div>
                            <div>
                              <ReactToPrint
                                trigger={()=>{
                                  return <button className='pdf_button'>Распечатать</button>
                                }}
                                content={() => componentRef.current}
                                documentTitle='Билет JapanTravel'
                                pageStyle="print"
                              />
                            </div>
                            </>
                          )}
                      </div>
                    );
                  })}              
                </div>
              </>
            )}
          </div>
        :<></>
        }
      </div>
      </HeaderImage>

      {isModalOpen && (
        <div className="modal">
          <div className="modal_content" >
            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                <h3 style={{marginTop:'20px'}}>Изменение профиля</h3>
                <span className="close" onClick={closeModal}>&times;</span>
            </div>
            <div className='modal_edit'>
              <div className='modal_photo'>
                <div className='modal_img' style={newImageFile? {backgroundImage:`url(${newImageFile})`}:{ backgroundImage: `url(${'http://localhost:5000/' + user.img})`}}>
                  <input className='input_img_modal' id='hidden_image_upload' style={{display:'none'}} type='file' accept='image/*' name='img' onChange={handleImageChange}/>
                  <label htmlFor='hidden_image_upload' className='change_image'>Изменить</label>
                </div>
              </div>
              <div className='modal_text'>
                <div className='modal_text_name'>
                  {isNicknameEditing ? (
                    <>
                      <p className='modal_p_user'>Имя : 
                        <input value={updatedUser.nickname} style={nicknameError? {borderColor:'red'} : {borderColor:'white'}} className='modal_input' name="nickname" onChange={handleUserUpdate}/>
                        <span role="img" className='accept' aria-label="check-mark" onClick={() => handleAccept('nickname')}>&#10004;</span>
                        <span className="close" onClick={() => handleCancelEdit('nickname')}>&times;</span>
                      </p>
                      {nicknameError && <p style={{color:'red',fontSize:'15px',marginTop:'0px'}}>{nicknameError}</p>}
                    </>
                  ) : (
                    <>
                      <p className='modal_p_user'>Имя : {updatedUser.nickname}
                        <img alt='/2' src={EditIcon} className='img_edit_icon' onClick={handleNicknameEditToggle} />
                      </p>
                    </>
                  )}
                </div>
                <div className='modal_text_email'>
                  {isEmailEditing ? (
                    <>
                      <p className='modal_p_user'>Почта : 
                        <input className='modal_input' style={emailError? {borderColor:'red'} : {borderColor:'white'}} name="email" value={updatedUser.email} onChange={handleUserUpdate}/>
                        <span role="img" className='accept' aria-label="check-mark" onClick={() => handleAccept('email')}>&#10004;</span>
                        <span className="close" onClick={() => handleCancelEdit('email')}>&times;</span>
                      </p>
                      {emailError && <p style={{color:'red',fontSize:'15px',marginTop:'0px'}}>{emailError}</p>}
                    </>
                  ) : (
                    <>
                      <p className='modal_p_user'>Почта : {updatedUser.email}
                        <img alt='/3' src={EditIcon} className='img_edit_icon' onClick={handleEmailEditToggle} />
                      </p>
                    </>
                  )}
                </div>
                <div className='modal_container_password'>
                  {isPassEditing ? 
                    <>
                      <p>Введите старый пароль</p>
                      <input className='modal_input' style={oldPasswordError? {borderColor:'red'} : {borderColor:'white'}}  name='oldPassword' type="password" onChange={handleUserUpdate}></input>
                      {oldPasswordError && <p style={{color:'red',fontSize:'15px',marginTop:'0px'}}>{oldPasswordError}</p>}
                      <p>Введите новый пароль</p>
                      <input className='modal_input' style={newPasswordError? {borderColor:'red'} : {borderColor:'white'}} name='newPassword' type="password" onChange={handleUserUpdate}></input>
                      {newPasswordError && <p style={{color:'red',fontSize:'15px',marginTop:'0px'}}>{newPasswordError}</p>}
                      <p>Подтвердите новый пароль</p>
                      <input className='modal_input' style={verifyPasswordError? {borderColor:'red'} : {borderColor:'white'}} name='verifyPassword' type="password" onChange={handleUserUpdate}></input>
                      {verifyPasswordError && <p style={{color:'red',fontSize:'15px',marginTop:'0px'}}>{verifyPasswordError}</p>}
                      <div className='modal_pass_buttons'>
                        <button onClick={() => handleCancelEdit('password')}>Отмена</button>
                        <button onClick={() => checkPass()}>Подтвердить</button>
                      </div>
                      
                    </>
                    :
                    <>
                      <button onClick={handlePassEditToggle} style={{marginLeft:'0px'}}>Измененить пароль</button>
                      {isPassUpdated ?
                      <>
                        <p style={{color:'green',fontSize:'15px'}}>Пароль успешно изменен</p>  
                      </>
                      :<></>}
                    </>
                  }
                </div>
              </div>
            </div>
            <button className='modal_button' onClick={updateUserFunc}>Сохранить</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
