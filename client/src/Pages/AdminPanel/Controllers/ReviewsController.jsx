import React, { useEffect, useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { fetchReviewsAsync, selectReviews,  } from '../../../Redux/reviewSlice'
import { acceptComboReview, acceptHotelReview, acceptReview, delComboReview, delHotelReview, delReview } from '../../../http/adminApi';
import { confirmAlert } from 'react-confirm-alert';

function ReviewsController() {

    const dispatch = useDispatch()
    const reviews = useSelector(selectReviews)
    console.log(reviews)

    useEffect(()=>{
        dispatch(fetchReviewsAsync())
    },[dispatch])

    const delTourReview = async (id) => {
        const confirm = await new Promise((resolve) => {
            confirmAlert({
                title: 'Подтвердите действие',
                 message: 'Вы уверены, что хотите удалить этот отзыв?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => resolve(true)
                    },
                    {
                        label: 'Нет',
                        onClick: () => resolve(false)
                    }
                ]
            });
        });
        if(confirm){
            await delReview(id)
            window.location.reload();
        }
        
    }

    const acceptTourReview = async (id) => {
        const confirm = await new Promise((resolve) => {
            confirmAlert({
                title: 'Подтвердите действие',
                 message: 'Одобрить отзыв?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => resolve(true)
                    },
                    {
                        label: 'Нет',
                        onClick: () => resolve(false)
                    }
                ]
            });
        });
        if(confirm){
            await acceptReview(id)
            window.location.reload();
        }
    }

    const delHotel = async (id) => {
        const confirm = await new Promise((resolve) => {
            confirmAlert({
                title: 'Подтвердите действие',
                 message: 'Вы уверены, что хотите удалить этот отзыв?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => resolve(true)
                    },
                    {
                        label: 'Нет',
                        onClick: () => resolve(false)
                    }
                ]
            });
        });
        if(confirm){
            await delHotelReview(id)
            window.location.reload();
        }
    } 

    const acceptHotel_Review = async (id) => {
        const confirm = await new Promise((resolve) => {
            confirmAlert({
                title: 'Подтвердите действие',
                 message: 'Одобрить отзыв?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => resolve(true)
                    },
                    {
                        label: 'Нет',
                        onClick: () => resolve(false)
                    }
                ]
            });
        });
        if(confirm){
            await acceptHotelReview(id)
            window.location.reload();
        }
    }

    const delCombo = async (id) => {
        const confirm = await new Promise((resolve) => {
            confirmAlert({
                title: 'Подтвердите действие',
                 message: 'Вы уверены, что хотите удалить этот отзыв?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => resolve(true)
                    },
                    {
                        label: 'Нет',
                        onClick: () => resolve(false)
                    }
                ]
            });
        });
        if(confirm){
            await delComboReview(id)
            window.location.reload();
        }
    } 

    const acceptCombo_Review = async (id) => {
        const confirm = await new Promise((resolve) => {
            confirmAlert({
                title: 'Подтвердите действие',
                 message: 'Одобрить отзыв?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => resolve(true)
                    },
                    {
                        label: 'Нет',
                        onClick: () => resolve(false)
                    }
                ]
            });
        });
        if(confirm){
            await acceptComboReview(id)
            window.location.reload();
        }
    }

    return (
        <div className='reviews_container'>
            <h1 style={{marginTop:'0',paddingTop:'0'}}>Отзывы</h1>
            {reviews && reviews.hotelReviews ? (
                <>{reviews.tourReviews && reviews.tourReviews.length > 0 && (
                    reviews.tourReviews.map((tourReview, index) => (
                        <div className='admin_review_controller_container' key={index}>
                            <div key={tourReview.id} className='review_item admin_items'>
                                <div className='review_user_info admin_info'>
                                    <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                                        {tourReview.user.img && (
                                            <div
                                                className='user_icon_review'
                                                style={{ backgroundImage: `url(http://localhost:5000/${tourReview.user.img})` }}
                                            ></div>
                                        )}
                                        <p className='p_username_review'>{tourReview.user.nickname}</p>
                                    </div>
                                    {tourReview.createdAt && (
                                        <p className='p_review'>{new Date(tourReview.createdAt).toLocaleDateString('ru-RU')}</p>
                                    )}
                                </div>
                                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                    {tourReview.description && <p className='p_review admin_review'>{tourReview.description}</p>}
                                </div>
                                <hr style={{border:'1px solid black'}}></hr>
                            </div>
                            <div className='admin_review_controllers'>
                                <button className='admin_controller_toogle_button' onClick={()=>acceptTourReview(tourReview.id)}><FaCheck /></button>
                                <button className='admin_controller_toogle_button' onClick={()=>delTourReview(tourReview.id)}><FaXmark /></button>
                            </div>
                        </div>
                    ))
                    )
                }   
                {reviews.hotelReviews && reviews.hotelReviews.length > 0 && (
                    reviews.hotelReviews.map((hotelReview, index) => (
                        <div className='admin_review_controller_container' key={index}>
                            <div key={hotelReview.id} className='review_item admin_items'>
                                <div className='review_user_info admin_info'>
                                    <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                                        {hotelReview.user.img && (
                                            <div
                                                className='user_icon_review'
                                                style={{ backgroundImage: `url(http://localhost:5000/${hotelReview.user.img})` }}
                                            ></div>
                                        )}
                                        <p className='p_username_review'>{hotelReview.user.nickname}</p>
                                    </div>
                                    {hotelReview.createdAt && (
                                        <p className='p_review'>{new Date(hotelReview.createdAt).toLocaleDateString('ru-RU')}</p>
                                    )}
                                </div>
                                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                    {hotelReview.description && <p className='p_review admin_review'>{hotelReview.description}</p>}
                                </div>
                                <hr style={{border:'1px solid black'}}></hr>
                            </div>
                            <div className='admin_review_controllers'>
                                <button className='admin_controller_toogle_button' onClick={()=>acceptHotel_Review(hotelReview.id)}><FaCheck /></button>
                                <button className='admin_controller_toogle_button' onClick={()=>delHotel(hotelReview.id)}><FaXmark /></button>
                            </div>
                        </div>
                    ))
                    )
                }
                {reviews.comboReviews && reviews.comboReviews.length > 0 && (
                    reviews.comboReviews.map((comboReview, index) => (
                        <div className='admin_review_controller_container' key={index}>
                            <div key={comboReview.id} className='review_item admin_items'>
                                <div className='review_user_info admin_info'>
                                    <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                                        {comboReview.user.img && (
                                            <div
                                                className='user_icon_review'
                                                style={{ backgroundImage: `url(http://localhost:5000/${comboReview.user.img})` }}
                                            ></div>
                                        )}
                                        <p className='p_username_review'>{comboReview.user.nickname}</p>
                                    </div>
                                    {comboReview.createdAt && (
                                        <p className='p_review'>{new Date(comboReview.createdAt).toLocaleDateString('ru-RU')}</p>
                                    )}
                                </div>
                                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                    {comboReview.description && <p className='p_review admin_review'>{comboReview.description}</p>}
                                </div>
                                <hr style={{border:'1px solid black'}}></hr>
                            </div>
                            <div className='admin_review_controllers'>
                                <button className='admin_controller_toogle_button' onClick={()=>acceptCombo_Review(comboReview.id)}><FaCheck /></button>
                                <button className='admin_controller_toogle_button' onClick={()=>delCombo(comboReview.id)}><FaXmark /></button>
                            </div>
                        </div>
                    ))
                    )
                }</>
            ) : (
                <h2 style={{color:'black'}}>Отзывы на одобрение отсутствуют</h2>
            )}
        </div>
    )
}

export default ReviewsController