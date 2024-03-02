import React from 'react'
import "../Styles/Logo.css"
import TravelLogo from "../Image/Logo.png"

function Logo() {
  return (
    <div className="logo">
       <img src={TravelLogo} alt="Описание изображения" className='logo_image'/>
    </div>
    
  )
}

export default Logo