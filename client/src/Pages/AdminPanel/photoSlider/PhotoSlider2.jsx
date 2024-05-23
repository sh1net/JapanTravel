import React from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './photoSlider.css'

function PhotoSlider2({imgs}) {

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };

  return (
    <div className="admin_photo_slider_container">
        <Slider 
          {...settings} 
          className='third_slider'
        >
          {imgs.map((img,index)=>(
            <div key={index}>
              <img src={`http://localhost:5000/${img}`} alt={`Slide ${index + 1}`}/>
            </div>
          ))}
      </Slider>
    </div>
  )
}

export default PhotoSlider2