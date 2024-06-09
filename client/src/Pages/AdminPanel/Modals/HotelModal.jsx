import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../Components/mui/CustomTextField'
import CustomFileUpload from '../../../Components/mui/CustomFileUpload'
import CheckMapLocation from '../../../Components/GoogleMaps/CheckMapLocation'
import '../Styles/AdminModal.css'
import { createHotel, updateHotel } from '../../../http/hotelApi'

function HotelModal({closeModal, isEdit, hotel, info}) {

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [hotelNameError,setHotelNameError] = useState(false)
    const [hotelCityError,setHotelCityError] = useState(false)
    const [hotelPriceError,setHotelPriceError] = useState(false)
    const [hotelInfoError,setHotelInfoError] = useState(false)
    const [hotelLocationLatError,setHotelLocationLatError] = useState(false)
    const [hotelLocationLngError,setHotelLocationLngError] = useState(false)
    const [helperText,setHelperText] = useState('')
    const [hotelName, setHotelName] = useState('')
    const [hotelCity, setHotelCity] = useState('')
    const [hotelPrice, setHotelPrice] = useState('')
    const [hotelInfo, setHotelInfo] = useState('')
    const [hotelLocationLat,setHotelLocationLat] =useState('')
    const [hotelLocationLng,setHotelLocationLng] =useState('')   

    const [imageFile, setImageFile] = useState([]);
    const [newImageFile, setNewImageFile] = useState([])
    const [oldImageFile,setOldImageFile] = useState('')

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

    useEffect(() => {
        if (isEdit && hotel && info) {
          setHotelName(hotel.name);
          setHotelCity(hotel.city);
          setHotelPrice(hotel.price);
          setHotelInfo(info.info[0].description);
          setHotelLocationLat(hotel.location[0]);
          setHotelLocationLng(hotel.location[1]);
          setOldImageFile(hotel.img);
        }
    }, [isEdit, hotel, info]);

    const handleHotelName = (text) => {
        setHotelNameError(false)
        setHelperText(false)
        setHotelName(text)
    }
    const handleHotelCity = (text) => {
        setHotelCityError(false)
        setHelperText(false)
        setHotelCity(text)
    }
    const handleHotelPrice = (text) => {
        setHotelPriceError(false)
        setHelperText(false)
        setHotelPrice(text)
    }
    const handleHotelInfo = (text) => {
        setHotelInfoError(false)
        setHelperText(false)
        setHotelInfo(text)
    }
    const handleHotelLocation_lat = (text) => {
        setHotelLocationLatError(false)
        setHelperText(false)
        setHotelLocationLat(text);
    }
    const handleHotelLocation_lng = (text) => {
        setHotelLocationLngError(false)
        setHelperText(false)
        setHotelLocationLng(text)
    }

    const checkError = () => {
        let hasError = false
        if(!hotelName || hotelName===''){
            setHotelNameError(true)
            hasError = true;
        }if(!hotelCity || hotelCity===''){
            setHotelCityError(true)
            hasError = true;
        }if(!hotelPrice || hotelPrice.length<0){
            setHotelPriceError(true)
            hasError = true;
        }if(!hotelInfo || hotelInfo===''){
            setHotelInfoError(true)
            hasError = true;
        }if(!hotelLocationLat || hotelLocationLat.length<0){
            setHotelLocationLatError(true)
            hasError = true;
        }if(!hotelLocationLng || hotelLocationLng.length<0){
            setHotelLocationLngError(true)
            hasError = true;
        }if(!hasError){
            return hasError
        }
    }

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(prevFiles => [...prevFiles, file]);
            const reader = new FileReader();
            reader.onload = () => {
                const imageDataUrl = reader.result;
                setNewImageFile(prevUrls => [...prevUrls, imageDataUrl]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImage = (index) => {
        const updatedImages = [...newImageFile]
        updatedImages.splice(index,1)
        setNewImageFile(updatedImages)
    }

    const handleClearOld = (index) => {
        const updatedImages = [...oldImageFile]
        updatedImages.splice(index,1)
        setOldImageFile(updatedImages)
    }

    const createHotel_1 = async () => {
        try{
            const isError = checkError()
            if(isError){
                return
            }
            if(!isError){
                const formData = new FormData()
                formData.append('name', hotelName);
                formData.append('description', hotelInfo);
                formData.append('city', hotelCity);
                formData.append('price', hotelPrice);
                imageFile.forEach(file => {
                    formData.append('img', file);
                });  
                const   coordinates = [hotelLocationLat,hotelLocationLng]                 
                const coordinatesString = coordinates.join(',');
                formData.append('coordinates', coordinatesString);
                const data = await createHotel(formData)
                if(data){
                    alert(data)
                    window.location.reload()
                }
            }
        }catch(e){
            console.log('Ошибка запроса')
        }
    }

    const updateHotel_1 = async () => {
        try{
            const isError = checkError()
            if(isError){
                return
            }
            if(!isError){
                const formData = new FormData()
                formData.append('id',hotel.id)
                formData.append('name', hotelName);
                formData.append('info', hotelInfo);
                formData.append('city', hotelCity);
                formData.append('price', hotelPrice);
                formData.append('oldImgs', oldImageFile)
                imageFile.forEach(file => {
                    formData.append('img', file);
                });   
                const   coordinates = [hotelLocationLat,hotelLocationLng]                 
                formData.append('coordinates', coordinates);
                const data = await updateHotel(formData)
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
                        <CustomTextField onSend={handleHotelName} error={hotelNameError} helperText={helperText} header='Название отеля' value={hotelName}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleHotelCity} error={hotelCityError} helperText={helperText} header='Город' value={hotelCity}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleHotelPrice} error={hotelPriceError} helperText={helperText} header='Цена за билет' value={hotelPrice} type={'number'}/>
                    </div>
                </div>
                <div style={{margin:'10px 18px'}}>
                    <CheckMapLocation location={[hotelLocationLat,hotelLocationLng]} name={hotelName}/>
                </div>
            </div> 
            <div className='admin_lat_lng_setter'>
                <CustomTextField onSend={handleHotelLocation_lat} error={hotelLocationLatError} helperText={helperText} header='Широта' value={hotelLocationLat} type={'number'}/>
                <CustomTextField onSend={handleHotelLocation_lng} error={hotelLocationLngError} helperText={helperText} header='Долгота' value={hotelLocationLng} type={'number'}/>
            </div>
            <div style={{margin:'10px 18px'}} className='admin_form_data'>
                <CustomTextField onSend={handleHotelInfo} error={hotelInfoError} isMulti={true} helperText={helperText} header='Описание отеля' value={hotelInfo}/>
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
            <button className='admin_modal_accept' onClick={createHotel_1}>Создать</button>
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
                        <CustomTextField onSend={handleHotelName} error={hotelNameError} helperText={helperText} header='Название отеля' value={hotelName}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleHotelCity} error={hotelCityError} helperText={helperText} header='Город' value={hotelCity}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleHotelPrice} error={hotelPriceError} helperText={helperText} header='Цена за билет' value={hotelPrice} type={'number'}/>
                    </div>
                </div>
                <div style={{margin:'10px 18px'}}>
                    <CheckMapLocation location={[hotelLocationLat,hotelLocationLng]} name={hotelName}/>
                </div>
            </div> 
            <div className='admin_lat_lng_setter' style={{margin:'10px 18px'}}>
                <CustomTextField onSend={handleHotelLocation_lat} error={hotelLocationLatError} helperText={helperText} header='Широта' value={hotelLocationLat} type={'number'}/>
                <CustomTextField onSend={handleHotelLocation_lng} error={hotelLocationLngError} helperText={helperText} header='Долгота' value={hotelLocationLng} type={'number'}/>
            </div>
            <div style={{margin:'10px 18px'}} className='admin_form_data'>
                <CustomTextField onSend={handleHotelInfo} error={hotelInfoError} isMulti={true} helperText={helperText} header='Описание отеля' value={hotelInfo}/>
            </div>
            <div style={{margin:'10px 18px'}}>
                <CustomFileUpload onChange={handleImageChange}/>
            </div>
            <div className='admin_photo_control_main_container'>
                {oldImageFile.length>0 && oldImageFile.map((image,index) => (
                    <div className='admin_photo_control_container' key={index}>
                        <img key={index} src={`http://localhost:5000/${image}`} alt={`${index}`} className='admin_tooks_imgs'/>
                        <p className='admin_photo_cancel' onClick={()=>handleClearOld(index)}>&times;</p>
                    </div>
                ))}
                {newImageFile.length > 0 && newImageFile.map((image, index) => (
                    <div className='admin_photo_control_container' key={index}>
                        <img key={index} src={image} alt={`${index}`} className='admin_tooks_imgs'/>
                        <p className='admin_photo_cancel' onClick={()=>handleClearImage(index)}>&times;</p>
                    </div>
                ))}
            </div>          
            <button className='admin_modal_accept' onClick={updateHotel_1}>Изменить</button>
            </div>
        </div>
        }
    </div>
  )
}

export default HotelModal