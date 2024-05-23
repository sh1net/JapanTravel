import React, { useEffect, useState } from 'react'
import CustomTextField from '../../Components/mui/CustomTextField'
import './BasketModal.css'
import { alpha, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { payBasketTour } from '../../http/tourApi';

function BasketModal({ isOpen, onClose,type, item, basket }) {

    const [firstNameError,setFirstNameError] = useState(false)
    const [fNameError,setFNameError] = useState(false)
    const [lastNameError,setLastNameError] = useState(false)
    const [phoneNumberError, setPhoneNumberError] = useState(false)
    const [pasportNumberError, setPasportNumberError] = useState(false)
    const [cardNumberError, setCardNumberError] = useState(false)
    const [dateCardError, setDateCardError] = useState(false)
    const [CVCError, setCVCError] = useState(false)
    const [taxiError,setTaxiError] = useState(false)
    const [guideError,setGuideError] = useState(false)
    const [helperError,setHelperError] = useState(false)
    const [helperText,setHelperText] = useState('')

    const validateCardNumber = (number) => /^(4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|9112[0-9]{12})$/.test(number);
    const validateExpiryDate = (date) => /^(0[1-9]|1[0-2])\/?([2-9][0-9])$/.test(date) && checkExpiryDate(date);
    const validatePhoneNumber = (number) => /^\+375(25|29|33|44)\d{7}$/.test(number);
    const validatePassportNumber = (number) => /^[1-6][0-9]{6}[А-ЯЁ]{1}[0-9]{3}(РВ|ВА|BI)[0-9]$/.test(number);

    const checkExpiryDate = (date) => {
        const [month, year] = date.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        return (parseInt(year, 10) > currentYear) || 
               (parseInt(year, 10) === currentYear && parseInt(month, 10) >= currentMonth);
    }

    const [firstName, setFirstName] = useState('')
    const handleFirstName = (text) => {
        setFirstNameError(false)
        setHelperText(false)
        setFirstName(text)
    }

    const [fName, setFName] = useState('')
    const handleFName = (text) => {
        setFNameError(false)
        setHelperText(false)
        setFName(text)
    }

    const [lastName, setLastName] = useState('')
    const handleLastName = (text) => {
        setLastNameError(false)
        setHelperText(false)
        setLastName(text)
    }

    const [phoneNumber, setPhoneNumber] = useState('')
    const handlePhoneNumber = (text) => {
        setPhoneNumberError(false)
        setHelperText(false)
        setPhoneNumber(text)
    }

    const [pasportNumber, setPasportNumber] = useState('')
    const handlePasportNumber = (text) => {
        setPasportNumberError(false)
        setHelperText(false)
        setPasportNumber(text)
    }

    const [cardNumber, setCardNumber] = useState('')
    const handleCardNumber = (text) => {
        setCardNumberError(false)
        setHelperText(false)
        setCardNumber(text)
    }

    const [dateCard, setDateCard] = useState('')
    const handleDateCard = (text) => {
        setDateCardError(false)
        setHelperText(false)
        setDateCard(text)
    }

    const [CVC, setCVC] = useState('')
    const handleCVC = (text) => {
        setCVCError(false)
        setHelperText(false)
        setCVC(text)
    }

    const [taxi,setTaxi] = useState('')
    const handleTaxi = (text) => {
        setTaxiError(false)
        setHelperText(false)
        setTaxi(text)
    }

    const [guide,setGuide] = useState('')
    const handleGuide = (text) => {
        setGuideError(false)
        setHelperText(false)
        setGuide(text)
    }

    const [helper,setHelper] = useState('')
    const handleHelper = (text) => {
        setHelperError(false)
        setHelperText(false)
        setHelper(text)
    }

    const PinkSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: grey[600],
          '&:hover': {
            backgroundColor: alpha(grey[600], theme.palette.action.hoverOpacity),
          },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: grey[600],
        },
    }));
      
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const checkFormValidity = () => {
            const isValid = firstName && fName && lastName && phoneNumber && pasportNumber && cardNumber && dateCard && CVC;
            setIsFormValid(isValid);
        };
        checkFormValidity();
    }, [firstName, fName, lastName, phoneNumber, pasportNumber, cardNumber, dateCard, CVC]);

    const [showTaxi, setShowTaxi] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [showHelper, setShowHelper] = useState(false);

    const toggleShowObject = (object) => {
        if(object === 'taxi'){
            setShowTaxi(!showTaxi)
        }
        if(object === 'guide'){
            setShowGuide(!showGuide)
        }
        if(object === 'helper'){
            setShowHelper(!showHelper)
        }
      };
    
    
    const checkError = () => {
        let hasError = false
        if(!firstName || firstName.length<0){
            setFirstNameError(true)
            hasError = true;
        }if(!fName || fName.length<0){
            setFNameError(true)
            hasError = true;
        }if(!lastName || lastName.length<0){
            setLastNameError(true)
            hasError = true;
        }if(!validatePhoneNumber(phoneNumber)){
            setPhoneNumberError(true)
            hasError = true;
        }if(!validatePassportNumber(pasportNumber)){
            setPasportNumberError(true)
            hasError = true;
        }if(!validateCardNumber(cardNumber)){
            setCardNumberError(true)
            hasError = true;
        }if(!validateExpiryDate(dateCard)){
            setDateCardError(true)
            hasError = true;
        }if(!CVC || CVC.length < 3 || CVC.length > 4){
            setCVCError(true)
            hasError = true;
        }if(!hasError){
            return hasError
        }else{
            return true
        }
    }
    
    const payTour = async () => {
        try{
            const isError = checkError()
            if(isError){
                return
            }else if(type==='tour'){
                const fullName = [firstName,fName,lastName]
                const data = await payBasketTour(item.id,fullName.join(','),phoneNumber,pasportNumber,taxi,guide,helper)
                if(data){
                    alert(data)
                    window.location.reload()
                }
            }
        }catch(e){
            console.log('Ошибка запроса')
        }
    }
    
    if (!isOpen) {
        return null;
    }
    
  return (
    <div className='basketModal_container'>
      <div className='basketModal_content'>
        <div className='basketModal_title'>
          <h3 style={{padding:'0',margin:'15px 0 0 0'}}>Оплата</h3>
          <p className='basketClose_button' onClick={onClose}>&times;</p>
        </div>
        <div style={{padding:'0 20px 0 0',overflowY:'auto', margin:'0'}}>
            <p>Название: {item.name}</p>
            <p>Город: {item.city}</p>
            <p>Цена: {basket.price}</p>
            <h3>Заполните анкету</h3>
            <h4 style={{marginBottom:'0'}}>Личные данные</h4>
            <div className='basketModal_anket_container'>
                <div className='basket_modal_names_container'>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleFirstName} error={firstNameError} helperText={helperText} header='Имя' value={firstName}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleFName} error={fNameError} helperText={helperText} header='Фамилия' value={fName}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleLastName} error={lastNameError} helperText={helperText} header='Отчество' value={lastName} type={'text'}/>
                    </div>
                </div>
                <div className='basketModal_numbers_container'>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handlePhoneNumber} error={phoneNumberError} helperText={helperText} header='Номер телефона' value={phoneNumber} type={'text'}/>
                    </div>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handlePasportNumber} error={pasportNumberError} helperText={helperText} header='Номер паспорта' value={pasportNumber} type={'text'}/>
                    </div>
                </div>
            </div>
            <h4>Дополнительные услуги</h4>
            <div className='basketModal_dop_uslugi'>
                <div className='basketModal_uslugi_picker'>
                    <p className='basketModal_uslugi_text'>Такси</p>
                    <PinkSwitch checked={showTaxi} onChange={()=>toggleShowObject('taxi')} />
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleTaxi} error={taxiError} helperText={helperText} header='Сообщение такси' value={taxi} type={'text'}/>
                    </div>
                </div>
                <div className='basketModal_uslugi_picker'>
                    <p className='basketModal_uslugi_text'>Гид</p>
                    <PinkSwitch checked={showGuide} onChange={()=>toggleShowObject('guide')}/>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleGuide} error={guideError} helperText={helperText} header='Сообщение гида' value={guide} type={'text'}/>
                    </div>
                </div>
                <div className='basketModal_uslugi_picker'>
                    <p className='basketModal_uslugi_text'>Помощник</p>
                    <PinkSwitch checked={showHelper} onChange={()=>toggleShowObject('helper')}/>
                    <div style={{margin:'10px 18px'}}>
                        <CustomTextField onSend={handleHelper} error={helperError} helperText={helperText} header='Сообщение помощника' value={helper} type={'text'}/>
                    </div>
                </div>
            </div>
            <h4 style={{marginBottom:'0'}}>Данные карты</h4>
            <div className='basketModal_payment_container'>
                <div className='basketModal_card'>
                    <div style={{margin:'10px 18px',width:'70%'}}>
                        <CustomTextField onSend={handleCardNumber} error={cardNumberError} helperText={helperText} header='Номер карты' value={cardNumber} type={'text'}/>
                    </div>
                </div>
                <div className='basketModal_dop_info'>
                    <div style={{margin:'10px 18px',width:'160px'}}>
                        <CustomTextField onSend={handleDateCard} error={dateCardError} helperText={helperText} header='Срок действия' value={dateCard} type={'text'}/>
                    </div>
                    <div style={{margin:'10px 18px',width:'100px'}}>
                        <CustomTextField onSend={handleCVC} error={CVCError} helperText={helperText} header='CVC/CVV' value={CVC} type={'password'}/>
                    </div>
                </div>
            </div>
            <button className={`basketModal_button ${!isFormValid ? 'disabled' : ''}`} disabled={!isFormValid} onClick={() => payTour()}>Оплатить</button>
        </div>
      </div>
    </div>
  )
}

export default BasketModal