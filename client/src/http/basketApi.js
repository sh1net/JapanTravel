import { $authHost } from ".";

export const fetchBasketHotel = async () => {
    try{
        const {data} = await $authHost.get('api/hotel/basket')
        return data
    }
    catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}

export const fetchBasketTour = async () => {
    try{
        const {data} = await $authHost.get('api/tour/basket')
        return data
    }
    catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}

export const fetchBasketCombo = async () => {
    try{
        const {data} = await $authHost.get('api/combtour/basket')
        return data
    }
    catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}

//done 1
export const fetchHotelHistory = async () => {
    try{
        const {data} = await $authHost.get('api/basket/hHistory')
        return data
    }catch(e){
        console.log(e.response?.data.message || 'Произошла ошибка')
    }
}

export const fetchTourHistory = async () => {
    try{
        const {data} = await $authHost.get('api/basket/tHistory')
        return data
    }catch(e){
        console.log(e.response?.data.message || 'Произошла ошибка')
    }
}

export const fetchComboHistory = async () => {
    try{
        const {data} = await $authHost.get('api/basket/cHistory')
        console.log(data)
        return data
    }catch(e){
        console.log(e.response?.data.message || 'Произошла ошибка')
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

export const delOneTour = async (basket_id) => {
    try{
        const {data} = await $authHost.delete(`api/basket/dropTour/${basket_id}`)
        alert(data)
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}

export const delAllTours = async() => {
    try{
        const {data} = await $authHost.delete('api/basket/dropTours')
        alert(data)
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}