import React from 'react'
import Logo from './Logo'
import { NavLink } from 'react-router-dom'
import "../Styles/Footer.css"

function Footer() {
  return (
    <div className='footer_page_container'>
        <div className='footer_logo_container'>
            <Logo/>
        </div>
        <div className='footer_contacts_container'>
            <span>+375 (44) 578-14-41</span>
            <span>Belarus, Minsk 220055</span>
            <span>mustashev168@gmail.com</span>
            <span>artemworkmust@gmail.com</span>
        </div>
        <div className='footer_links_container'>
            <NavLink to="/">Главная</NavLink>
            <NavLink to="/Tours">Туры</NavLink>
            <NavLink to="/Contacts">Контакты</NavLink>
            <NavLink to="/AboutUs">О нас</NavLink>
        </div>
    </div>
  )
}

export default Footer