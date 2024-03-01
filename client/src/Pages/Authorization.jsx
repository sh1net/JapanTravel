import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, setIsAuth } from '../Redux/authSlice';
import "../Styles/Registration.css"

function Authorization() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth)

  const setAuth = () => {
    dispatch(setIsAuth(true));
  };

  useEffect(() =>{
    if(isAuth){
      navigate('/Tours')
    }
  },[isAuth])
  

  return (
    <div className="container">
      <Navbar />
      <div className="reg_container">
        <h1 className="reg_reg_text">Авторизация</h1>
        <p className="reg_text">Введите номер телефона</p>
        <input id="phoneNumber" name="phoneNumber" placeholder="Введите" className="reg_input" />
        <p className="reg_text">Введите почту</p>
        <input id="email" name="email" placeholder="Введите" className="reg_input" />
        <p className="reg_text">Введите пароль</p>
        <input id="password" name="password" type="password" placeholder="Введите" className="reg_input" />
        <button className="accept_login" onClick={setAuth}>
          Подтвердить
        </button>
        <p className="reg_text">Уже есть аккаунт?</p>
      </div>
    </div>
  );
}

export default Authorization;
