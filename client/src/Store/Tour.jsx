import React from 'react'
import "../Styles/Tour.css"

function Tour(props) {
  return (
    <div className="tour__box">
        <p style={{fontSize:"30px",color:"purple"}}>{props.tour.name}</p>
        <div className="tour__description">
            <p style={{fontSize:"25px",fontStyle:"italic"}}>{props.tour.description}</p>
        </div>
        <div className="tour__info">
            <div className="tour__price">
                <p style={{fontSize:"35px",color:"purple",}}>{props.tour.price}</p>
            </div>
            <button className="tour_about">
              Подробнее
            </button>
        </div>
        <button className="tour_delete">Delete</button>
    </div>
  )
}

export default Tour