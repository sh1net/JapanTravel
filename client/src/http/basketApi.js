import { $authHost } from ".";

export const fetchBasketHotel = async () => {
    try{
        const {data} = await $authHost.get('api/hotel/basket')
        console.log('Api Hotels : ', data)
        return data
    }
    catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}

export const checkData = async (hotelId, date_in, date_out, count) => {
    try{
        const {data} = await $authHost.post('api/hotel/isDataCorrect', {hotelId, date_in, date_out, count})
        console.log('data of check correct : ', data)
        return data
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}
//done 1
export const fetchHotelHistory = async () => {
    try{
        const {data} = await $authHost.get('api/basket/hHistory')
        return data
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}
//done all
export const delOneHotel = async (basket_id) => {
    try{
        const {data} = await $authHost.delete(`api/basket/dropHotel/${basket_id}`)
        alert(data)
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}
//done all
export const delAllHotels = async () => {
    try{
        const {data} = await $authHost.delete('api/basket/dropHotels')
        alert(data)
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}