import React from 'react'
import { Routes,Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from './routes';
import {useSelector} from "react-redux"
import { selectIsAuth } from '../Redux/authSlice';

function AppRouter() {
    const isAuth = useSelector(selectIsAuth);
  return (
    <Routes>
        {(isAuth ? authRoutes : publicRoutes).map((route) => (
            <Route key={route.path} path={route.path} element={route.element} exact />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter