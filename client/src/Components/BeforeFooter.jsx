import React from 'react'
import { NavLink } from 'react-router-dom'
import "../Styles/BeforeFooter.css"

function BeforeFooter() {
  return (
    <div className='before_footer_container'>
        Are u want to became a sigma?
        <NavLink to="/Contacts" className='toContact'>Join</NavLink>
    </div>
  )
}

export default BeforeFooter