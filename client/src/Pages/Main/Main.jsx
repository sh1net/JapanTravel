import React from 'react'
import "../../Styles/Main.css"
import Services from './Services/Services';
import HeaderImage from "../../Components/HeaderImage/HeaderImage"
function Main() {
  return (
    <div className="main_box">
      <div className="image_container">
        <HeaderImage>
        </HeaderImage>
      </div>
      <div className="service_container">
        <Services/>
      </div>
    </div>
  )
}

export default Main