import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PhotoSlider2 from '../photoSlider/PhotoSlider2';
import '../Styles/ControllerStyle.css'
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fetchCombToursAsync, selectCombTours } from '../../../Redux/combSlice';
import ComboModal from '../Modals/ComboModal'
import { deleteComboTour } from '../../../http/combApi';

function ComboController() {

  const combos = useSelector(selectCombTours)
  const dispatch = useDispatch()
  const [combo,setCombo] = useState()
  const [isComboModalOpen,setIsComboModalOpen]= useState(false)
  const [sortedArr, setSortedArr] = useState()

  useEffect(() => {
      dispatch(fetchCombToursAsync());
  }, [dispatch]);

  const dropCombo = async (id) => {
    try{
      const confirm = await new Promise((resolve) => {
        confirmAlert({
          title: 'Подтвердите действие',
          message: 'Вы уверены, что хотите удалить этот тур?',
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
        const data = await deleteComboTour(id)
        if(data){
          alert(data)
          window.location.reload()
        }
      }
    }catch(e){
      console.log(e.message)
    }
  }

  const closeModal = () => {
    setIsComboModalOpen(false);
    setCombo(null)
  };

  useEffect(()=>{
    if (combos.length > 0) {
      const sortedCombos = [...combos].sort((a, b) => a.id - b.id);
      setSortedArr(sortedCombos);
    }
  },[combos])

  return (
    <div>
      <div className='admin_tables_container'>
        <table className='admin_table'>
          <thead>
            <tr>
              <th>id</th>
              <th>Фото</th>
              <th>Название</th>
              <th>Рейтинг</th>
              <th>Город</th>
              <th>Отель id</th>
              <th>Туры id</th>
            </tr>
          </thead>
          <tbody>
            {combos && combos.length>0 && sortedArr && sortedArr.length>0 && sortedArr.map(combo => {
              return(
                <tr key={combo.id}>
                  <td>{combo.id}</td>
                  <td className='admin_photo_container'>
                    <PhotoSlider2 imgs={combo.hotel.img}/>
                    <div className='admin_controller_toogle_container'>
                      <button className='admin_controller_toogle_button' onClick={()=>dropCombo(combo.id)}><FaTrash/></button>
                    </div>
                  </td>
                  <td>{combo.hotel.name}</td>
                  <td>{combo.rating}</td>
                  <td>{combo.hotel.city}</td>
                  <td>{combo.hotel.id}</td>
                  <td>{combo.tours.map(item => item.id).join(',')}</td>
                </tr>
              )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComboController