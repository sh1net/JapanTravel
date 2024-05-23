import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../Styles/Authorization.css";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts"
import { registration, login } from "../http/userApi"
import { setIsAuth, setUser, setUserRole } from '../Redux/authSlice';
import { useDispatch } from 'react-redux';

function Authorization() {
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE
  const navigate = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const dispatch = useDispatch()

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = (email) => {
    return emailPattern.test(email)
  }

  const click = async () => {
    try{
      let data
      if(isLogin){
        data = await login(email,password)
        dispatch(setIsAuth(true))
        dispatch(setUser(data.token))
        dispatch(setUserRole(data.role))
        if(data.role==='User'){
          navigate('/')
        }else if(data.role==='Admin'){
          navigate('/Admin')
        }
      }
      else{
        if(validateEmail(email)){
          data = await registration(email,password)
          navigate(LOGIN_ROUTE)
        }else{
          alert('Неверный формат почты')
        }        
      }
    }
    catch(e){
      alert(e.response?.data.message || e.message);
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
          type='email'
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
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
