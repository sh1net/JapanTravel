import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import PostTour from '../Tour/PostTour'
import "../Styles/Admin.css"
import {useDispatch} from "react-redux"
import { addTour } from '../Redux/tourSlice'


function Admin() {

  const [tour,setTour]=useState({
    name:"",
    description:"",
    price:"",
    rating:"0"
  })

  const dispatch = useDispatch()

  const addTask = ()=>{
    dispatch(addTour(tour))
  }

  return (
    <div>
      <Navbar/>
      <div className="input_container">
        <input 
          placeholder="Введите название тура"
          onChange={e=>setTour({...tour,name:e.target.value})}
          className="tour_input"
        ></input>
        <input 
          placeholder="Введите описание тура"
          onChange={e=>setTour({...tour,description:e.target.value})}
          className="tour_input"
        ></input>
        <input 
          placeholder="Введите стоимость тура"
          onChange={e=>setTour({...tour,price:e.target.value})}
          className="tour_input"
        ></input>
        <button onClick={addTask} className="input_button">Создать тур</button>
      </div>
        <PostTour />
    </div>
  )
}

export default Admin