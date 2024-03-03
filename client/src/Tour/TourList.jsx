import React from 'react'
import { UseSelector } from 'react-redux'

function TourList() {
    const tours = useSelector(state => state.tour.tours)
  return (
    <div>
        
    </div>
  )
}

export default TourList