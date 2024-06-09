import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchToursAsync, selectTours } from '../../../Redux/tourSlice';
import {selectHotels,fetchHotelsAsync} from '../../../Redux/hotelSlice'
import '../Styles/AdminModal.css'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createComboTour } from '../../../http/combApi';

function ComboModal({closeModal, combo}) {

    const hotels = useSelector(selectHotels)
    const tours = useSelector(selectTours)
    const dispatch = useDispatch()
    const [filteredTours, setFilteredTours] = useState([]);

    useEffect(() => {
        dispatch(fetchHotelsAsync());
        dispatch(fetchToursAsync());
    }, [dispatch]);
    
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [hotelError,setHotelError] = useState(false)
    const [hotel, setHotel] = useState('')
    const [tourError,setTourError] = useState(false)
    const [tour, setTour] = useState([])
    
    const handleHotel = (e) => {
        setTour([])
        setHotelError(false)
        const selectedHotel = e.target.value;
        setHotel(selectedHotel);
        const filteredTours = tours.filter((item) => item.city === selectedHotel.city);
        setFilteredTours(filteredTours);
    }

    const handleTour = (e) => {
        setTourError(false);
        const {
          target: { value },
        } = e;
        // Если множественный выбор, преобразуем выбранные значения в массив
        const selectedValues = Array.isArray(value) ? value : [value];
        setTour(selectedValues);
    };

    const checkError = () => {
        let hasError = false
        if(!hotel || hotel===''){
            setHotelError(true)
            hasError = true;
        }if(!tour || !tour.length>0){
            setTourError(true)
            hasError = true;
        }if(!hasError){
            return hasError
        }
    }

    const createCombo = async () => {
        try{
            const isError = checkError()
            if(isError){
                return
            }
            if(!isError){
                const tourIds = tour.map(item => item.id)
                const data = await createComboTour(tourIds,hotel.id)
                if(data){
                    alert(data)
                    window.location.reload()
                }
            }
        }catch(e){
            console.log('Ошибка запроса')
        }
    }

    useEffect(() => {
        if (isModalOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
    
        return () => {
          document.body.style.overflow = "auto";
        };
    }, [isModalOpen]);

  return (
    <div className='admin_modal_page'>
        <div className='admin_modal_container'>
            <div className='admin_modal_header'>
                <h3>Заполните данные</h3>
                <p className='admin_close_button' onClick={closeModal}>&times;</p>
            </div>
            <div className='admin_scroll_container'> 
                <div className='admin_form_data' style={{marginBottom:'20px',marginTop:'20px'}}>
                    <FormControl fullWidth>
                        <InputLabel id="hotel-select-label">Отель</InputLabel>
                        <Select
                            labelId="hotel-select-label"
                            id="hotel-select"
                            value={hotel}
                            label="Отель"
                            error={hotelError}
                            onChange={handleHotel}
                            MenuProps={{ sx: { zIndex: 10001 } }}
                        >
                            {hotels && hotels.length > 0 ? (
                                
                                hotels.map((hotel, index) => (
                                    <MenuItem key={index} value={hotel} className='eshkere'>
                                        {`${hotel.name},${hotel.city}`}
                                    </MenuItem>
                                ))
                            ) : (
                                 <MenuItem disabled>Нет доступных отелей</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </div>  
                <div className='admin_form_data' style={{marginBottom:'20px',marginTop:'20px'}}>
                    <FormControl fullWidth>
                        <InputLabel id="hotel-select-label">Туры</InputLabel>
                        <Select
                            labelId="hotel-select-label"
                            id="hotel-select"
                            value={tour}
                            label="Туры"
                            error={tourError}
                            onChange={handleTour}
                            MenuProps={{ sx: { zIndex: 10001 } }}
                            multiple
                        >
                            {filteredTours && filteredTours.length > 0 ? (
                                filteredTours.map((item, index) => (
                                    <MenuItem key={index} value={item}>
                                        {`${item.name} (г.${item.city})`}
                                    </MenuItem>
                                ))
                            ) : (
                                 <MenuItem disabled>Нет доступных туров</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </div>        
                <button className='admin_modal_accept' onClick={createCombo}>Создать</button>
            </div>
        </div>
    </div>
  )
}

export default ComboModal