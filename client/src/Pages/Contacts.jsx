import React, { useState } from 'react'
import "../Styles/Contacts.css"
import CustomTextField from '../Components/mui/CustomTextField'
import { FaPhoneAlt } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import axios from "axios";

function Contacts() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [helperText,setHelperText] = useState('')
  const [nameError,setNameError] = useState(false)
  const [emailError,setEmailError] = useState(false)
  const [messageError,setMessageError] = useState(false)

  const handleName = (text) => {
    setNameError(false)
    setHelperText(false)
    setName(text)
  }

  const handleEmail = (text) => {
    setEmailError(false)
    setHelperText(false)
    setEmail(text)
  }

  const handleMessage = (text) => {
    setMessageError(false)
    setHelperText(false)
    setMessage(text)
  }

  const checkError = () => {
    let hasError = false
    if(!name || name.length<0){
        setNameError(true)
        hasError = true;
    }if(!email || email.length<0){
        setEmailError(true)
        hasError = true;
    }if(!message || message.length<0){
        setMessageError(true)
        hasError = true;
    }if(!hasError){
        return hasError
    }
    
}

  const serviceId = 'service_1669cvg'
  const templateId = 'template_pielmqu'
  const publicKey = 'woXv6aB86fW18RnX6'

  const data = {
    service_id: serviceId,
    template_id:templateId,
    user_id:publicKey,
    template_params : {
      from_name: name,
      from_email:email,
      to_name: 'JpanTravel Worker',
      message:message,
    }
  }

  const sendMessage = async () => {
    const isError = checkError()
    if(isError){
      return
    }
    if(!isError){
      try{
        const res = await axios.post('https://api.emailjs.com/api/v1.0/email/send', data)
        console.log(res.data)
        setName('')
        setEmail('')
        setMessage('')
      }catch(error){
        console.error(error)
      }
    }
  }

  return (
    <div className='contacts_main_container'>
      <div className='contacts_page_container'>
        <div className='contacts_write_container'>
          <h3 className='write_header'>Напишите нам</h3>
          <div style={{margin:'20px'}}>
            <CustomTextField onSend={handleName} error={nameError} helperText={helperText} header='Имя' value={name} color={'white'}/>
          </div>
          <div style={{margin:'20px'}}>
            <CustomTextField onSend={handleEmail} error={emailError} helperText={helperText} header='Почта' value={email} color={'white'} type={email}/>
          </div>
          <div style={{margin:'20px'}}>
            <CustomTextField onSend={handleMessage} error={messageError} helperText={helperText} header='Сообщение' value={message} color={'white'}/>
          </div>
          <button className='contacts_send_button' onClick={sendMessage}>Отправить</button>
        </div>
        <div className='contacts_about_container'>
          <h2 className='write_header' style={{marginBottom:'0'}}>Контакты</h2>
          <p className='contacts_foot_text'>Если у вас появились вопросы отправьте форму на почту или напишите</p>
          <div className='contact_info_container'>
            <div className='contact_circle_container'>
              <FaPhoneAlt />
            </div>
            <div className='contact_info_info'>
              <h3>Телефон:</h3>
              <p className='contacts_foot_text'>+375(44) 578-14-41</p>
            </div>
          </div>
          <div className='contact_info_container'>
            <div className='contact_circle_container'>
              <FaTelegramPlane />
            </div>
            <div className='contact_info_info'>
              <h3>Телеграм:</h3>
              <p className='contacts_foot_text'>@not_ur_dream</p>
            </div>
          </div>
          <div className='contact_info_container'>
            <div className='contact_circle_container'>
              <IoIosMail />
            </div>
            <div className='contact_info_info'>
              <h3>Почта:</h3>
              <p className='contacts_foot_text'>artemworkmust@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacts