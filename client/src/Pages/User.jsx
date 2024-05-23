import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setIsAuth, setUser } from '../Redux/authSlice';
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
import {  fetchHotelsHistoryAsync, selectBasketHotels } from '../Redux/basketSlice';

function User() {
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
}, [dispatch]);

useEffect(() => {
  dispatch(fetchHotelsAsync());
}, [dispatch]);

  return (
    <div className='user_page_container'>
      <HeaderImage blurBackground={true}>
        <div className='user_page_panel'>
          <GiSamuraiHelmet onClick={() => setTabPage(0)}/>
          <FaEdit onClick={openModal} />
          <FaStar onClick={() => setTabPage(1)}/>
          <FaHistory onClick={() => setTabPage(2)}/>
          <RxExit onClick={unAuth}/>
        </div>
      <div className='profile_container'>
        {tabPage === 0 
        ?
          <div className='user_info_container'>
            <h1 style={{color:'white',marginBottom:'70px'}}>Профиль</h1>
            <div className='block_block_block'>
              <div className='user_info'>
                <div className='user_nickname'>
                  <p>Имя пользователя : {user.nickname ? user.nickname : "-"}</p>
                  <hr></hr>
                </div>
                <div className='user_email'>
                  <p>Почта пользователя : {user.email}</p>
                  <hr></hr>
                </div>
                <div className='user_role'>
                  <p>Роль пользователя : {user.role}</p>
                  <hr></hr>
                </div>
                <div className='user_role'>
                  <p>Количество отзывов : </p>
                  <hr></hr>
                </div>
                <div className='user_role'>
                  <p>Средняя оценка отзывов : </p>
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
        ? <div>

          </div>
        :<></>
        }
        {tabPage === 2
        ? <div>
            <h1 style={{color:'white'}}>История покупок</h1>
            <div className='history_page_container'>
              <table className='table_history'>
                <thead className='head_history'>
                  <tr className='table_row_history'>
                    <th className='head_history_p'>Отель</th>
                    <th className='head_history_p'>Дата</th>
                    <th className='head_history_p'>Число</th>
                    <th className='head_history_p'>Стоимость</th>
                    <th className='head_history_p'>Комнаты</th>
                  </tr>
                </thead>
                <tbody className='table_history_body'>
                  
                  {basketHotels && basketHotels.length>0 && basketHotels.map(item => {
                    const hotel = hotels.find(h => h.id === item.hotelId);
                    const formattedDateIn = item.date_in ? new Date(item.date_in).toLocaleDateString('ru-RU') : '';
                    const formattedDateOut = item.date_out ? new Date(item.date_out).toLocaleDateString('ru-RU') : '';
                    const formattedDateRange = formattedDateIn && formattedDateOut ? `${formattedDateIn} - ${formattedDateOut}` : '';
                    console.log()
                    return(
                      <tr key={item.id} className='table_row_history'>
                        <td className='body_history_p'>{hotel.name}</td>
                        <td className='body_history_p'>{formattedDateRange}</td>
                        <td className='body_history_p'>{item.count}</td>
                        <td className='body_history_p'>{item.price}</td>
                        <td className='body_history_p'>{item.rooms.join(',')}</td>
                      </tr>
                    )
                  })}
                </tbody>
                
              </table>
              
            </div>
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
              <div className='modal_photo'>
                <div className='modal_img' style={newImageFile? {backgroundImage:`url(${newImageFile})`}:{ backgroundImage: `url(${'http://localhost:5000/' + user.img})`}}>
                  <input className='input_img_modal' id='hidden_image_upload' style={{display:'none'}} type='file' accept='image/*' name='img' onChange={handleImageChange}/>
                  <label htmlFor='hidden_image_upload' className='change_image'>Изменить</label>
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
