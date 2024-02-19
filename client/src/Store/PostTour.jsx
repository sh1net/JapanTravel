import React from 'react'
import Tour from './Tour'

function PostTour({tours}) {
  return (
    <div>
        {tours.map((tour) =>
            <Tour tour={tour} key={tour.id}/>
        )}
    </div>
  )
}

export default PostTour