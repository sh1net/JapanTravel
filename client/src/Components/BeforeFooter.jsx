import React from 'react'
import { NavLink } from 'react-router-dom'
import "../Styles/BeforeFooter.css"

function BeforeFooter() {
  return (
    <div className='before_footer_container'>
        Есть какие-то вопросы?
        <NavLink to="/Contacts" className='toContact'>Напишите нам</NavLink>
    </div>
  )
}

export default BeforeFooter