import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../Styles/Navbar.css";
import Logo from "../Components/Logo.jsx";
import { useDispatch, useSelector } from 'react-redux';
import {  setIsAuth, setUser, setUserRole } from '../Redux/authSlice';
import { selectIsAuth, selectUserRole } from '../Redux/authSlice';
import { LOGIN_ROUTE } from '../utils/consts.js';
import { RxExit } from "react-icons/rx";
import { logout } from '../http/userApi.js';

function Navbar() {
  const isAuth = useSelector(selectIsAuth);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      dispatch(setUserRole(role));
    }
  }, [dispatch]);


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

  const unAuth = () => {
    dispatch(setIsAuth(false));
    dispatch(setUser({}));
    logout()
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className={`navbar ${isSticky ? 'sticky' : ''} ${isHomePage ? 'home' : ''}`}>
      {isAuth && userRole === 'User' && (
        <>
          <div className="logo_position">
            <Link to="/"><Logo /></Link>
          </div>
          <div className="page_position">
            <NavLink to="/Tours">Туры</NavLink>
            <NavLink to="/Contacts">Контакты</NavLink>
            <NavLink to="/AboutUs">О нас</NavLink>
            <NavLink to="/Basket">Корзина</NavLink>
            <NavLink to="/User">Профиль</NavLink>
          </div>
        </>
      )}
      {isAuth && userRole === 'Admin' && (
        <>
          <div className="page_position" style={{alignItems:'center'}}>
            <NavLink to="/Admin">Администратор</NavLink>
            <RxExit onClick={unAuth} style={{color:'white',fontSize:'30px',cursor:'pointer'}}/>
          </div>
        </>
      )}
      {!isAuth && (
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
