import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './PhotoSlider.css'

function PhotoSlider({imgs}) {

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="photo_slider_container">
      <Slider 
        {...settings} 
        asNavFor={nav2} 
        ref={slider => (sliderRef1 = slider)}
        className='first_slider'
      >
          {imgs.map((img,index)=>(
            <div key={index}>
              <img src={`http://localhost:5000/${img}`} alt={`Slide ${index + 1}`}/>
            </div>
          ))}
      </Slider>
      <Slider
        asNavFor={nav1}
        ref={slider => (sliderRef2 = slider)}
        slidesToShow={3}
        arrows={false}
        swipeToSlide={true}
        focusOnSelect={true}
        className='second_slider'
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

export default PhotoSlider