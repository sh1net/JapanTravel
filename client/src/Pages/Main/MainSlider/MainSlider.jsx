import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

function MainSlider() {
    const settings = {
        dots:true,
        infinite:true,
        speed:500,
        slidersToShow:3,
        slidersToScroll:1
    };

  return (
    <Slider>
        <div>
            
        </div>
    </Slider>
  )
}

export default MainSlider