import { $host, $authHost } from "./index";

export const fetchHotel = async () => {
    try{
        const {data} = await $host.get('api/hotel')
        return data
    }
    catch(error){
        console.error("Error fetching hotels: ", error);
        throw error;
    }
}

export const fetchOneHotel = async (id) =>{
    try{
      const {data} = await $host.get('api/hotel/'+id)
      if(data){
        return data
      }
      
    }
    catch(error){
      console.error("Error fetching 1 hotel: ", error)
    }
}

export const addHotelToCart = async (hotelId, date_in, date_out, rooms, hotelCount, price) => {
  try{
    const { data } = await $authHost.post('api/hotel/addToBasket', { hotelId, date_in, date_out, rooms, hotelCount, price });
    return data
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const BuyOneHotel = async (hotelId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price, hotelName) => {
  try{
      const {data} = await $authHost.patch('api/hotel/payBasketElem', {hotelId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price, hotelName})
      return data
  }catch(e){
      alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const checkData = async (hotelId, date_in, date_out, count) => {
  try{
    const {data} = await $authHost.post('api/hotel/isDataCorrect', {hotelId, date_in, date_out, count})
    if(data){
      return data
    }
  }catch(e){
    console.log(e.response?.data.message || 'Произошла ошибка')
  }
}

export const fetchHotelReviews = async (id) => {
  try{
    const {data} = await $host.get('api/hotel/reviews/'+id)
    return data
  }catch(e){
    console.log(e.response?.data.message || 'Произошла ошибка')
  }
}

export const createHotelReview = async (description, rate, hotelId) => {
  try{
    const {data} = await $authHost.post('api/hotel/review', {description, rate, hotelId})
    alert(data)
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const createHotel = async (hotel) =>{
  try {
    const {data} = await $authHost.post('api/hotel', hotel)
    return data
  } 
  catch (e) {
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const deleteHotel = async (hotel_id) => {
  try{
    const {data} = await $authHost.delete(`api/hotel/dropHotel/${hotel_id}`)
    return data
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const updateHotel = async (data) => {
  try{
    const result = await $authHost.patch('/api/hotel/updateHotel', data)
    return result
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}