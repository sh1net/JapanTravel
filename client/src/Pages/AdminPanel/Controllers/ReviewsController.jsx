import React, { useEffect, useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { fetchTourReviewsAsync, selectTourReviews } from '../../../Redux/reviewSlice'
import { acceptReview, delReview } from '../../../http/adminApi';

function ReviewsController() {

    const dispatch = useDispatch()
    const tourReviews = useSelector(selectTourReviews)


    useEffect(()=>{
        dispatch(fetchTourReviewsAsync())
    },[dispatch])

    const delTourReview = async (id) => {
        await delReview(id)
        window.location.reload();
    }

    const acceptTourReview = async (id) => {
        await acceptReview(id)
        window.location.reload();
    }

  return (
        <div className='reviews_container'>
            <h1 style={{marginTop:'0',paddingTop:'0'}}>Отзывы</h1>
            {Array.isArray(tourReviews) && tourReviews.length > 0 ? (
                tourReviews.map((review, index) => (
                    <div className='admin_review_controller_container' key={index}>
                        <div key={review.id} className='review_item admin_items'>
                            <div className='review_user_info admin_info'>
                                <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                                    {review.user.img && (
                                        <div
                                            className='user_icon_review'
                                            style={{ backgroundImage: `url(http://localhost:5000/${review.user.img})` }}
                                        ></div>
                                    )}
                                    <p className='p_username_review'>{review.user.nickname}</p>
                                </div>
                                {review.createdAt && (
                                    <p className='p_review'>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</p>
                                )}
                            </div>
                            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                {review.description && <p className='p_review admin_review'>{review.description}</p>}
                            </div>
                            <hr style={{border:'1px solid black'}}></hr>
                        </div>
                        <div className='admin_review_controllers'>
                            <button className='admin_controller_toogle_button'onClick={()=>acceptTourReview(review.id)}><FaCheck /></button>
                            <button className='admin_controller_toogle_button' onClick={()=>delTourReview(review.id)}><FaXmark /></button>
                        </div>
                    </div>
                ))
            ) : (
        <h2 style={{color:'black'}}>Отзывы на одобрение отсутствуют</h2>)}
    </div>
  )
}

export default ReviewsController