import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../Styles/Navbar.css";
import Logo from "../Components/Logo.jsx";
import { useSelector } from "react-redux";
import { selectIsAuth } from '../Redux/authSlice';
import { LOGIN_ROUTE } from '../utils/consts.js';

function Navbar() {
  const isAuth = useSelector(selectIsAuth);
  const location = useLocation();

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const threshold = 100;
      setIsSticky(offset > threshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Проверка текущего пути для определения стиля navbar
  const isHomePage = location.pathname === '/';

  return (
    <div className={`navbar ${isSticky ? 'sticky' : ''} ${isHomePage ? 'home' : ''}`}>
      {isAuth ? (
        <>
          <div className="logo_position">
            <Link to="/"><Logo /></Link>
          </div>
          <div className="page_position">
            <NavLink to="/Tours">Туры</NavLink>
            <NavLink to="/Contacts">Контакты</NavLink>
            <NavLink to="/AboutUs">О нас</NavLink>
            <NavLink to="/Basket">Корзина</NavLink>
            <NavLink to="/Admin">Админ панель</NavLink>
            <NavLink to="/User">Профиль</NavLink>
          </div>
        </>
      ) : (
        <>
          <div className="logo_position">
            <Link to="/"><Logo /></Link>
          </div>
          <div className="page_position">
            <NavLink to="/Tours">Туры</NavLink>
            <NavLink to="/Contacts">Контакты</NavLink>
            <NavLink to="/AboutUs">О нас</NavLink>
            <NavLink to={LOGIN_ROUTE}>Авторизация</NavLink>
          </div>
        </>
      )}
    </div>
  );

  function NavLink({ to, children }) {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={isActive ? 'active' : ''}>
        {children}
      </Link>
    );
  }
}

export default Navbar;
