import { $host, $authHost } from "./index";

export const fetchTours = async () => {
  try {
    const { data } = await $host.get('api/tour');
    return data;
  } 
  catch (error) {
    console.error("Error fetching tours: ", error);
    throw error;
  }
};

export const fetchOneTour = async (id) =>{
  try{
    const {data} = await $host.get('api/tour/'+id)
    if(data){
      return data
    }
    
  }
  catch(error){
    console.error("Error fetching 1 tour: ", error)
  }
}

export const checkValidableData = async (date, tourId) => {
  try{
    const {data} = await $authHost.post('api/tour/isDataCorrect', {date, tourId})
    return data
  }catch(e){
    console.log(e.response?.data.message || 'Произошла ошибка')
  }
}

export const addTourToCart = async (tourCount,date, tourId, price) => {
  try{
    const { data } = await $authHost.post('api/tour/addToCart', {tourCount,date, tourId, price});
    return data
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const getTourReviews = async (tourId) => {
  try{
    const {data} = await $host.get('api/user/tourReviews/'+tourId)
    return data
  }catch(e){
    console.log(e.response?.data.message || 'Произошла ошибка')
  }
}

export const createReview = async (description,rate,tourId) => {
  try{
    const {data} = await $authHost.post('api/user/review',{description,rate,tourId})
    alert(data)
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const payBasketTour = async (tourId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price) => {
  try{
    const {data} = await $authHost.patch('/api/tour/payTour', {tourId, fullName, phoneNumber, pasportNumber, taxi, guide, help, basketId, price})
    return data
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}