import React from 'react'
import { useParams } from 'react-router-dom'

function TourAbout() {
  const {id} = useParams();
  return (
    <div>Tour</div>
  )
}

export default TourAbout