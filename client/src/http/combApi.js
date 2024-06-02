import { $authHost, $host } from ".";

export const fetchCombs = async () => {
    try{
        const { data } = await $host.get('api/combTour');

        return data
        
    }catch(e){
        console.log(e.response?.data.message || 'Произошла ошибка')
    }
}

export const fetchOneComb = async (id) => {
    try{
        const {data} = await $host.get('api/combTour/'+id)
        return data
    }catch(e){
        console.log(e.response?.data.message || 'Произошла ошибка')
    }
}

export const comboReviews = async (comboTourId) => {
    try{
        const {data} = await $host.get('api/combtour/reviews/'+comboTourId)
        return data
    }catch(e){
        console.log(e.response?.data.message || 'Произошла ошибка')
    }
}

export const createCombReviews = async (description, rate, comboTourId) => {
    try{
        const {data} = await $authHost.post('api/combtour/createReview', {description, rate, comboTourId})
        alert(data)
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}

export const checkCombData = async (date_in, date_out, dateOfTours, tourIds, hotelId, count, comboTourId) => {
    try{
        const {data} = await $authHost.post('api/combtour/isDataCorrect', {date_in, date_out, dateOfTours, tourIds, hotelId, count, comboTourId})
        return data
    }catch(e){
        console.log(e.response?.data.message || 'Произошла ошибка')
    }
}

export const addCombToBasket = async (comboId, countArr, date, date_in, date_out, price, rooms) => {
    try{
        const {data} = await $authHost.post('api/combtour/combBasket', {comboId, countArr, date, date_in, date_out, price, rooms})
        return data
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}

export const payBasketCombo = async (comboTourId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price) => {
    try{
      const {data} = await $authHost.patch('/api/combtour/payCombo', {comboTourId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price})
      return data
    }catch(e){
      alert(e.response?.data.message || 'Произошла ошибка')
    }
  }