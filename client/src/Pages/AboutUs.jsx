import React, { useEffect, useRef } from 'react'
import "../Styles/AboutUs.css"
import Content from "./AboutSlider/Content/Content"
import samurai from '../Image/samurai.png'

function AboutUs() {

  const detailsRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (detailsRef.current) {
      observer.observe(detailsRef.current);
    }

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (detailsRef.current) {
        observer.unobserve(detailsRef.current);
      }
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div className='about_page_container'>
      <div className='about_persons'>
        <Content/>
      </div>
      <div className='about_details_container'>
        <div ref={detailsRef} className='about_details_info' >
          <h2>Разработал:</h2>          
          <h4>Мусташев Артем Дмитриевич</h4>
          <h4>Студент МГК цифровых технологий</h4>
          <h4>группы 52ТП</h4>
          <h4>Разработано исключительно в обучающих целях</h4>
        </div>
        <img src={samurai} ref={imgRef} className='about_details_img'></img>
      </div>
    </div>
  )
}

export default AboutUs