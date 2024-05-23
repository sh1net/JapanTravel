import React from 'react'
import { Routes,Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from './routes';
import { useSelector} from "react-redux"
import { selectIsAuth, selectUserRole } from '../Redux/authSlice';
import Admin from '../Pages/AdminPanel/Admin';

function AppRouter() {
    const isAuth = useSelector(selectIsAuth);
    const userRole = useSelector(selectUserRole)
  return (
    <Routes>
        {userRole==='Admin' && <Route path='/Admin' element={<Admin/>}/>}
        {[...(isAuth ? authRoutes : []), ...publicRoutes].map((route) => (
          <Route key={route.path} path={route.path} element={route.element} exact />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter