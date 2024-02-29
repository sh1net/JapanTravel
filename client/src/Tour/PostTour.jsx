import React from 'react'
import Tour from './Tour'
import {useSelector} from "react-redux"

function PostTour() {
  const tours = useSelector(state => state.tour.tours)
  return (
    <div>
        {tours.map((tour) => (
          <Tour 
            key={tour.id} 
            {...tour}
          />
        ))}
    </div>
  )
}

export default PostTour