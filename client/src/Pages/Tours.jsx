import React from 'react'
import Navbar from './Navbar'
import PostTour from '../Store/PostTour'
import "../Styles/Tours.css"
import { useState } from 'react'

function Tours() {

  const [tours,setTours]=useState([
    {id:"0",name:"Монастырь_1",description:"Класный монастырь, что сказать",price:"145"},
    {id:"1",name:"Монастырь_2",description:"Класный монастырь, что сказать",price:"145"},
    {id:"2",name:"Монастырь_3",description:"Класный монастырь, что сказать",price:"145"}
  ])

  const [tour,setTour]=useState({
    name:"",
    description:"",
    price:""
  })

  const addNewTour=(e)=>{
    e.preventDefault()
    setTours([...tours,{...tour,id:Date.now()}])
    setTour({name:'',description:'',price:''})
  }

  return (
    <div>
      <Navbar/>
      <div className="input_container">
        <input 
          value={tour.name}
          placeholder="Введите название тура"
          onChange={e=>setTour({...tour,name:e.target.value})}
          className="tour_input"
        ></input>
        <input 
          value={tour.description}
          placeholder="Введите описание тура"
          onChange={e=>setTour({...tour,description:e.target.value})}
          className="tour_input"
        ></input>
        <input 
          value={tour.price}
          placeholder="Введите стоимость тура"
          onChange={e=>setTour({...tour,price:e.target.value})}
          className="tour_input"
        ></input>
        <button onClick={addNewTour} className="input_button">Создать тур</button>
      </div>
        <PostTour tours={tours}/>
    </div>
  )
}

export default Tours