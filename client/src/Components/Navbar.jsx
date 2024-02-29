import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/Navbar.css"
import Logo from "../Components/Logo.jsx"
import {useSelector} from "react-redux"
import { selectIsAuth } from '../Redux/authSlice';

function Navbar() {
  const isAuth = useSelector(selectIsAuth);
  return (
    <div className="navbar">
      {isAuth ?
      <>
        <Link to="/"><Logo/></Link>
        <Link to="/Tours">Туры</Link>
        <Link to="/Contacts">Контакты</Link>
        <Link to="/AboutUs">О нас</Link>
        <Link to="/Basket">Корзина</Link>
        <Link to="/Admin">Админ панель</Link>
        <Link to="/User">Профиль</Link>
      </>
      :
      <>
        <Link to="/"><Logo/></Link>
        <Link to="/Tours">Туры</Link>
        <Link to="/Contacts">Контакты</Link>
        <Link to="/AboutUs">О нас</Link>
        <Link to="/Authorization">Авторизация</Link>
        </>
      }
       
    </div>
  )
}

export default Navbar