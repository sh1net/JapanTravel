import React from 'react'
import "../Styles/Main.css"
import Navbar from '../Components/Navbar'
import SimpleSlider from '../Components/Sliders/SimpleSlider';

function Main() {
  return (
    <div className="main_box">
      <Navbar/>
      <div className="slider_container">
        <SimpleSlider/>
      </div>
      
    </div>
  )
}

export default Main