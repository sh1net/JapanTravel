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

export const addHotelToCart = async (hotelId,date_in,date_out,rooms,count) => {
  try{
    const { data } = await $authHost.post('api/hotel/addToBasket', { hotelId,date_in,date_out,rooms,count });
    return data
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const BuyOneHotel = async (basket_id) => {
  try{
      const {data} = await $authHost.patch('api/hotel/payBasketElem', {basket_id})
      alert(data)
  }catch(e){
      alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const createHotel = async (hotel) =>{
    const {data} = await $authHost.post('api/hotel')
    return data
}