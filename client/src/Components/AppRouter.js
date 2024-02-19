import React, { useContext } from 'react'
import { Routes,Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from './routes';
import { Context } from '../index';

function AppRouter() {
    const isAuth = true
    const {user} = useContext(Context)
    console.log(user)
  return (
     <Routes>
        {isAuth && authRoutes.map((route)=>
            <Route key = {route.path} path={route.path} element={route.element} exact/>
        )}
        {publicRoutes.map((route)=>
            <Route key = {route.path} path={route.path} element={route.element} exact/>
        )}
        <Route path = "*" element={<Navigate to="/" replace/>}/>
     </Routes>
  )
}

export default AppRouter