import React, { useEffect, useState } from "react";
import "./Styles/App.css"
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./Components/AppRouter";
import { useDispatch } from "react-redux";
import { setIsAuth, setUser } from "./Redux/authSlice";
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';
import { check } from "./http/userApi";


function App() {
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch()

  function YourComponent() {
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: red; // Цвет верхней части спиннера

      
    `;
  
    return (
      <div>
        <RingLoader color={'#9100ff'} loading={true} css={override} size={70} />
      </div>
    );
  }

  useEffect( () => {
    setTimeout(()=>{
      check().then(data =>{
        dispatch(setIsAuth(true))
        dispatch(setUser(true))
      }).finally(()=>setLoading(false))
    },1000)
    
  },[])
  if(loading){
    return YourComponent()
  }
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;