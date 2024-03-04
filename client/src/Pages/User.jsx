// User.js
import React from 'react';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuth, setUser } from '../Redux/authSlice';
import { logout } from '../http/userApi';

function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const unAuth = () => {
    dispatch(setIsAuth(false));
    dispatch(setUser({}));
    logout();
    navigate('/');
  };

  return (
    <div>
      <Navbar />
      <button onClick={unAuth}>Выйти</button>
    </div>
  );
}

export default User;
