import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import mainSlider1 from "../../Image/photo3.jpg";
import mainSlider2 from "../../Image/main_slider_4.jpg";
import mainSlider3 from "../../Image/main_slider_3.jpg";
import mainSlider4 from "../../Image/photo2.jpg";
import './SimpleSlider.css';

const SimpleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="slide-item">
          <img src={mainSlider1} alt="Slide 1" />
          <div className="slide-content">
            <h2 className="slide-title">Всем привет!</h2>
            <span className="slide-span">Lorem ipsum dolor sit amet consectetur adipisicing elit...</span>
            <button className="slide-button">Нажми на меня!</button>
          </div>
        </div>
        <div className="slide-item">
          <img src={mainSlider2} alt="Slide 2" />
          <div className="slide-content">
            <h2 className="slide-title">Всем привет!</h2>
            <span className="slide-span">Lorem ipsum dolor sit amet consectetur adipisicing elit...</span>
            <button className="slide-button">Нажми на меня!</button>
          </div>
        </div>
        <div className="slide-item">
          <img src={mainSlider3} alt="Slide 3" />
          <div className="slide-content">
            <h2 className="slide-title">Всем привет!</h2>
            <span className="slide-span">Lorem ipsum dolor sit amet consectetur adipisicing elit...</span>
            <button className="slide-button">Нажми на меня!</button>
          </div>
        </div>
        <div className="slide-item">
          <img src={mainSlider4} alt="Slide 4" />
          <div className="slide-content">
            <h2 className="slide-title">Всем привет!</h2>
            <span className="slide-span">Lorem ipsum dolor sit amet consectetur adipisicing elit...</span>
            <button className="slide-button">Нажми на меня!</button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default SimpleSlider;
