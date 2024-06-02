import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import "./Styles/App.css";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRouter from "./Components/AppRouter";
import { useDispatch } from "react-redux";
import { setIsAuth, setUser, setUserRole } from "./Redux/authSlice";
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';
import { check } from "./http/userApi";

function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();   

    function YourComponent() {
        const override = css`
            display: block;
            margin: 0 auto;
            border-color: red; // Цвет верхней части спиннера
        `;

        return (
            <div style={{display:"flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100dvh"}}>
                <RingLoader color={'#9100ff'} loading={true} css={override} size={70} />
            </div>
        );
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setTimeout(() => {
            if (token) {
                check().then(data => {
                    dispatch(setIsAuth(true));
                    dispatch(setUser(data));
                    dispatch(setUserRole(role));
                }).finally(() => setLoading(false));
            } else {
                dispatch(setIsAuth(false));
                setLoading(false);
            }
        }, 1000)
    }, [dispatch]);

    if (loading) {
        return YourComponent()
    }

    return (
        <BrowserRouter>
            <MainContent/>
        </BrowserRouter>
    );
}

function MainContent() {
    const location = useLocation()
    const hideFooterRoutes = ['/admin']
    const mainRoute = ['/']
    const hideFooter = hideFooterRoutes.includes(location.pathname.toLowerCase());
    const unStyleNavbar = mainRoute.includes(location.pathname.toLowerCase())

    return(
        <div className="all_content">
            <Navbar/>
            <div className={unStyleNavbar ? '' : "main_content"}>
                <AppRouter/>
            </div>
            {!hideFooter && <Footer />}
        </div>
    )
}

export default App;
