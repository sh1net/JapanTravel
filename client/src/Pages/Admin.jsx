import React, { useState } from 'react'
import "../Styles/Admin.css"

function Admin() {

  const [tour, setTour] = useState({
    name: "",
    description: "",
    price: "",
    rating: "0",
    img: ""
  })

  return (
    <div className='admin_page_container'>
      <div className="input_container">
        <input
          placeholder="Введите название тура"
          onChange={e => setTour({ ...tour, name: e.target.value })}
          className="tour_input"
        ></input>
        <input
          placeholder="Введите рейтинг тура"
          onChange={e => setTour({ ...tour, description: e.target.value })}
          className="tour_input"
        ></input>
        <input
          placeholder="Введите стоимость тура"
          onChange={e => setTour({ ...tour, price: e.target.value })}
          className="tour_input"
        ></input>
        <input
          type='file'
          accept="image/*"
          placeholder="Введите URL изображения тура"
          className="tour_input"
        ></input>
        <button className="input_button">Создать тур</button>
      </div>
    </div>
  )
}

export default Admin;
