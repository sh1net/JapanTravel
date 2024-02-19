import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/Navbar.css"
import Logo from "../Components/Logo.jsx"
import { useContext } from 'react'
import { Context } from '../index.js'

function Navbar() {
  const {user} = useContext(Context)
  return (
    <div className="navbar">
      {user.isAuth ?
      <>
        <Link to="/"><Logo/></Link>
        <Link to="/Tours">Туры</Link>
        <Link to="/Contacts">Контакты</Link>
        <Link to="/AboutUs">О нас</Link>
        <Link to="/Basket">Корзина</Link>
        <Link to="/User">Профиль</Link>
      </>
      :
      <>
        <Link to="/"><Logo/></Link>
        <Link to="/Tours">Туры</Link>
        <Link to="/Contacts">Контакты</Link>
        <Link to="/AboutUs">О нас</Link>
        <Link to="/Login">Вход</Link>
        <Link to="/Registration">Регистрация</Link>
        </>
      }
       
    </div>
  )
}

export default Navbar

{/*  
      
  <NavLink to={Main_route}><Logo/></NavLink>
        <NavLink to={Tours_route}>Туры</NavLink>
        <NavLink to={Contacts_route}>Контакты</NavLink>
        <NavLink to={AboutUs_route}>О нас</NavLink>
        <NavLink to={Login_route}>Вход</NavLink>
        <NavLink to={Registration_route}>Регистрация</NavLink>     
      
      
      
      
*/}