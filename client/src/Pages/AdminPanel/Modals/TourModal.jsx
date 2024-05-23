import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../Components/mui/CustomTextField'
import CustomFileUpload from '../../../Components/mui/CustomFileUpload'
import CheckMapLocation from '../../../Components/GoogleMaps/CheckMapLocation'
import '../Styles/AdminModal.css'
import { createTours } from '../../../http/adminApi'

function TourModal({closeModal, isEdit, tour}) {

    const [tourNameError,setTourNameError] = useState(false)
    const [tourCityError,setTourCityError] = useState(false)
    const [tourPriceError,setTourPriceError] = useState(false)
    const [tourInfoError,setTourInfoError] = useState(false)
    const [tourLocationLatError,setTourLocationLatError] = useState(false)
    const [tourLocationLngError,setTourLocationLngError] = useState(false)
    const [helperText,setHelperText] = useState('')

    const [imageFile, setImageFile] = useState([]);
    const [newImageFile, setNewImageFile] = useState([])
    const [oldImageFile,setOldImageFile] = useState('')

    useEffect(() => {
        if (isEdit && tour) {
          setTourName(tour.name);
          setTourCity(tour.city);
          setTourPrice(tour.price);
          setTourInfo(tour.info);
          setTourLocationLat(tour.location[0]);
          setTourLocationLng(tour.location[1]);
          setOldImageFile(tour.img);
        }
    }, [isEdit, tour]);
    
    const [tourName, setTourName] = useState('')
    const handleTourName = (text) => {
        setTourNameError(false)
        setHelperText(false)
        setTourName(text)
    }
    const [tourCity, setTourCity] = useState('')
    const handleTourCity = (text) => {
        setTourCityError(false)
        setHelperText(false)
        setTourCity(text)
    }
    const [tourPrice, setTourPrice] = useState('')
    const handleTourPrice = (text) => {
        setTourPriceError(false)
        setHelperText(false)
        setTourPrice(text)
    }
    const [tourInfo, setTourInfo] = useState('')
    const handleTourInfo = (text) => {
        setTourInfoError(false)
        setHelperText(false)
        setTourInfo(text)
    }
    const [tourLocationLat,setTourLocationLat] =useState()
    const [tourLocationLng,setTourLocationLng] =useState()
    const handleTourLocation_lat = (text) => {
        setTourLocationLatError(false)
        setHelperText(false)
        setTourLocationLat(text);
    }
    const handleTourLocation_lng = (text) => {
        setTourLocationLngError(false)
        setHelperText(false)
        setTourLocationLng(text);
    }
    const checkError = () => {
        let hasError = false
        if(!tourName || tourName.length<0){
            setTourNameError(true)
            hasError = true;
        }if(!tourCity || tourCity.length<0){
            setTourCityError(true)
            hasError = true;
        }if(!tourPrice || tourPrice.length<0){
            setTourPriceError(true)
            hasError = true;
        }if(!tourInfo || tourInfo.length<0){
            setTourInfoError(true)
            hasError = true;
        }if(!tourLocationLat || tourLocationLat.length<0){
            setTourLocationLatError(true)
            hasError = true;
        }if(!tourLocationLng || tourLocationLng.length<0){
            setTourLocationLngError(true)
            hasError = true;
        }if(!hasError){
            return hasError
        }
        
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(prevFiles => [...prevFiles, file]);
        const reader = new FileReader();
        reader.onload = () => {
            const imageDataUrl = reader.result;
            setNewImageFile(prevUrls => [...prevUrls, imageDataUrl]);
        };
        reader.readAsDataURL(file);
    };

    const handleClearImage = (index) => {
        const updatedImages = [...newImageFile]
        updatedImages.splice(index,1)
        setNewImageFile(updatedImages)
    }

    const createTour = async () => {
        try{
            const isError = checkError()
            if(isError){
                return
            }
            if(!isError){
                const formData = new FormData()
                formData.append('name', tourName);
                formData.append('info', tourInfo);
                formData.append('city', tourCity);
                formData.append('price', tourPrice);
                imageFile.forEach(file => {
                    formData.append('img', file);
                });  
                const   coordinates = [tourLocationLat,tourLocationLng]                 
                const coordinatesString = coordinates.join(',');
                formData.append('coordinates', coordinatesString);
                const data = await createTours(formData)
                if(data){
                    alert('Успешно')
                    window.location.reload()
                }
            }
        }catch(e){
            console.log('Ошибка запроса')
        }
    }

  return (
    <div className='admin_modal_page'>
        {!isEdit ? 
        <div className='admin_modal_container'>
            <div className='admin_modal_header'>
                <h3>Заполните данные</h3>
                <p className='admin_close_button' onClick={closeModal}>&times;</p>
            </div>
            <div className='admin_scroll_container'>
            <div className='admin_write_data'>
                <div className='admin_form_data'>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleTourName} error={tourNameError} helperText={helperText} header='Название тура' value={tourName}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleTourCity} error={tourCityError} helperText={helperText} header='Город' value={tourCity}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleTourPrice} error={tourPriceError} helperText={helperText} header='Цена за билет' value={tourPrice} type={'number'}/>
                    </div>
                </div>
                <div style={{margin:'10px 18px'}}>
                    <CheckMapLocation/>
                </div>
            </div> 
            <div className='admin_lat_lng_setter'>
                <CustomTextField onSend={handleTourLocation_lat} error={tourLocationLatError} helperText={helperText} header='Широта' value={tourLocationLat} type={'number'}/>
                <CustomTextField onSend={handleTourLocation_lng} error={tourLocationLngError} helperText={helperText} header='Долгота' value={tourLocationLng} type={'number'}/>
            </div>
            <div style={{margin:'10px 18px'}} className='admin_form_data'>
                <CustomTextField onSend={handleTourInfo} error={tourInfoError} isMulti={true} helperText={helperText} header='Описание тура' value={tourInfo}/>
            </div>
            <div style={{margin:'10px 18px'}}>
                <CustomFileUpload onChange={handleImageChange}/>
            </div>
            <div className='admin_photo_control_main_container'>
                {newImageFile.length > 0 && newImageFile.map((image, index) => (
                    <div className='admin_photo_control_container' key={index}>
                        <img key={index} src={image} alt={`${index}`} className='admin_tooks_imgs'/>
                        <p className='admin_photo_cancel' onClick={()=>handleClearImage(index)}>&times;</p>
                    </div>
                ))}
            </div>          
            <button className='admin_modal_accept' onClick={createTour}>Создать</button>
            </div>
        </div>
        :
        <div className='admin_modal_container'>
            <div className='admin_modal_header'>
                <h3>Заполните данные</h3>
                <p className='admin_close_button' onClick={closeModal}>&times;</p>
            </div>
            <div className='admin_scroll_container'>
            <div className='admin_write_data'>
                <div className='admin_form_data'>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleTourName} error={tourNameError} helperText={helperText} header='Название тура' value={tourName}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleTourCity} error={tourCityError} helperText={helperText} header='Город' value={tourCity}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleTourPrice} error={tourPriceError} helperText={helperText} header='Цена за билет' value={tourPrice} type={'number'}/>
                    </div>
                </div>
                <div style={{margin:'10px 18px'}}>
                    <CheckMapLocation/>
                </div>
            </div> 
            <div className='admin_lat_lng_setter'>
                <CustomTextField onSend={handleTourLocation_lat} error={tourLocationLatError} helperText={helperText} header='Широта' value={tourLocationLat} type={'number'}/>
                <CustomTextField onSend={handleTourLocation_lng} error={tourLocationLngError} helperText={helperText} header='Долгота' value={tourLocationLng} type={'number'}/>
            </div>
            <div style={{margin:'10px 18px'}} className='admin_form_data'>
                <CustomTextField onSend={handleTourInfo} error={tourInfoError} isMulti={true} helperText={helperText} header='Описание тура' value={tourInfo}/>
            </div>
            <div style={{margin:'10px 18px'}}>
                <CustomFileUpload onChange={handleImageChange}/>
            </div>
            <div className='admin_photo_control_main_container'>
                {oldImageFile.length>0 && oldImageFile.map((image,index) => (
                    <div className='admin_photo_control_container' key={index}>
                        <img key={index} src={`http://localhost:5000/${image}`} alt={`${index}`} className='admin_tooks_imgs'/>
                    </div>
                ))}
                {newImageFile.length > 0 && newImageFile.map((image, index) => (
                    <div className='admin_photo_control_container' key={index}>
                        <img key={index} src={image} alt={`${index}`} className='admin_tooks_imgs'/>
                        <p className='admin_photo_cancel' onClick={()=>handleClearImage(index)}>&times;</p>
                    </div>
                ))}
            </div>          
            <button className='admin_modal_accept'>Изменить</button>
            </div>
        </div>
        }
    </div>
  )
}

export default TourModal