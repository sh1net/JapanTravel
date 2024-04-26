import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../Styles/Authorization.css";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts"
import { registration, login } from "../http/userApi"
import { setIsAuth, setUser } from '../Redux/authSlice';
import { useDispatch } from 'react-redux';

function Authorization() {
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE
  const navigate = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const dispatch = useDispatch()

  const click = async () => {
    try{
      let data
      if(isLogin){
        data = await login(email,password)
        dispatch(setIsAuth(true))
        dispatch(setUser(data))
        navigate('/')
      }
      else{
        data = await registration(email,password)
        navigate(LOGIN_ROUTE)
      }
    }
    catch(e){
      alert(e.response?.data.message || 'Произошла ошибка');
    }
  }

  return (
    <div className="auth_page_container">
      <div className="reg_container">
        <h1 className="reg_reg_text">
        {isLogin 
          ? 'Авторизация' 
          : 'Регистрация'
        }</h1>
        <p className="reg_text">Введите почту</p>
        <input 
          placeholder="Введите" 
          className="reg_input"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />
        <p className="reg_text">Введите пароль</p>
        <input 
          type="password" 
          placeholder="Введите" 
          className="reg_input" 
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />
        <button className="accept_login" onClick={click}>Подтвердить</button>
        {isLogin
          ? <Link to={REGISTRATION_ROUTE} className="reg_log_text">Нет аккаунта?</Link>
          : <Link to={LOGIN_ROUTE} className="reg_log_text">Уже есть аккаунт?</Link>
        }
      </div>
    </div>
  );
}

export default Authorization;
