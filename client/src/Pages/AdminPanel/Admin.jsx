import React, { useState } from 'react'
import "./Styles/Admin.css"
import TourController from './Controllers/TourController';
import HotelController from './Controllers/HotelController'
import ComboController from './Controllers/ComboController'
import TourModal from './Modals/TourModal';
import ReviewsController from './Controllers/ReviewsController';

function Admin() {

  const [page,setPage] = useState('place')
  const [isTourModalOpen,setIsTourModalOpen]= useState(false)
  const [isHotelModalOpen,setIsHotelModalOpen]= useState(false)
  const [isUserModalOpen,setIsUserModalOpen]= useState(false)
  const [isComboTourModalOpen,setIsComboTourModalOpen]= useState(false)

  const changeTab = (key) => {
    setPage(key)
  }
  const closeModal = () => {
    setIsTourModalOpen(false);
  };

  return (
    <div className='admin_page_container'>
      <div className='admin_tab_page'>
        <div style={{backgroundColor:'#707070',padding:'22px',borderRadius:'20px'}}>
        <div className='admin_tab_page_container'>
          <p className='admin_tab_page_text' onClick={()=>changeTab('place')}>Достопримечательности</p>
          <button 
            className='admin_add_button'
            onClick={()=>setIsTourModalOpen(!isTourModalOpen)}
          >Добавить</button>
        </div><hr style={{width:'100%'}}></hr>
        <div className='admin_tab_page_container'>
          <p className='admin_tab_page_text' onClick={()=>changeTab('hotel')}>Отели</p>
          <button className='admin_add_button'>Добавить</button>
        </div><hr style={{width:'100%'}}></hr>
        <div className='admin_tab_page_container'>
          <p className='admin_tab_page_text' onClick={()=>changeTab('combo')}>Туры</p>
          <button className='admin_add_button'>Добавить</button>
        </div><hr style={{width:'100%'}}></hr>
        <div className='admin_tab_page_container'>
          <p className='admin_tab_page_text' onClick={()=>changeTab('reviews')}>Отзывы</p>
        </div><hr style={{width:'100%'}}></hr>
        </div>
      </div>
      <div className='admin_tab_info'>
        {page==='place' && (
          <TourController/>
        )}
        {page==='hotel' && (
          <HotelController/>
        )}        
        {page==='combo' && (
          <ComboController/>
        )} 
        {page === 'reviews' && (
          <ReviewsController/>
        )}
      </div>
      {isTourModalOpen ? 
        <TourModal closeModal={closeModal} isEdit={false}/>
      :<></>}
    </div>
  )
}

export default Admin;
