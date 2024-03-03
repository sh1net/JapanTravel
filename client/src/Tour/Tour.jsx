import React from 'react'
import "../Styles/Tour.css"

function Tour({name,description,price,rating}) {
  return (
    <div className="tour__box">
        <p style={{fontSize:"30px",color:"purple"}}>{name}</p>
        <div className="tour__description">
            <p style={{fontSize:"25px",fontStyle:"italic"}}>{description}</p>
        </div>
        <div className="tour__info">
            <div className="tour__price">
                <p style={{fontSize:"35px",color:"purple",}}>{price}</p>
            </div>
            <div className="tour__rating">
                <p style={{fontSize:"35px",color:"purple",}}>{rating}</p>
            </div>
        </div>
        <button className="tour_delete">Delete</button>
    </div>
  )
}

export default Tour