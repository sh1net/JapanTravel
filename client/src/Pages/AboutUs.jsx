import React from 'react'
import "../Styles/AboutUs.css"
import BeforeFooter from '../Components/BeforeFooter'
import Content from "../Pages/AboutSlider/Content/Content"

function AboutUs() {
  return (
    <div className='about_page_container'>
      <div className='about_persons'>
        <Content/>
      </div>
      
      <h1>ЗДЕСЬ БУДЕТ ИНФОРМАЦИЯ О НАС</h1>
      <BeforeFooter/>
    </div>
  )
}

export default AboutUs