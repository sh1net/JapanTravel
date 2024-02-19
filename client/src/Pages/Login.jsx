import React from 'react'
import Navbar from './Navbar'
import "../Styles/Registration.css"
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '../index.js'

function Login() {
  const {user} = useContext(Context)
  return (
    <div className="container">
      <Navbar/>
      <div className="reg_container">
        <h1 className="reg_reg_text">Вход</h1>
        <p className="reg_text">Введите номер телефона</p>
        <input
          placeholder="Введите"
          className="reg_input"
        ></input>
        <p className="reg_text">Введите почту</p>
        <input
          placeholder="Введите"
          className="reg_input"
        ></input>
        <p className="reg_text">Введите пароль</p>
        <input
          placeholder="Введите"
          className="reg_input"
        ></input>
        <button className="accept_login" onClick={()=>user.setIsAuth(true)}><Link to="/" className="accept_link">Подтвердить</Link></button>
        <p className="reg_text">Нет аккаунта?</p>
        <Link to="/Registration" className="reg_to_log">Регистрация</Link>
      </div>
    </div>
  )
}

export default Login