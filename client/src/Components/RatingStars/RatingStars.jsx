import React from 'react'

function RatingStars({rating}) {

  const filledStars = '★'.repeat(Math.round(rating))
  const emptyStars = '☆'.repeat(5-Math.round(rating))
  const stars = filledStars + emptyStars;

  return (
    <span style={{color: '#fdd835'}}>{stars}</span>
  )
}

export default RatingStars