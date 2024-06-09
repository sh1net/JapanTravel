import { $authHost, $host } from ".";


export const createTours = async (tour) => {
  try {
    const { data } = await $host.post('api/tour', tour);
    return data;
  } 
  catch (e) {
    alert(e.response?.data.message || 'Произошла ошибка')
  }
};

export const deleteTour = async (tour_id) => {
  try{
    console.log(tour_id)
    const {data} = await $host.delete('api/tour/dropTour/'+tour_id)
    if(data){
      return data
    }
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const update = async (data) => {
  try{
    const result = await $authHost.patch('/api/tour/updateTour', data)
    return result
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const fetchAdminReviews = async () => {
  try{
    const {data} = await $host.get('api/tour/acceptReviews')
    return data
  }catch(e){
    console.log(e.response?.data.message || 'Произошла ошибка')
  }
}

export const acceptReview = async (reviewId) => {
  try{
    const {data} = await $host.patch('api/tour/updateReview', {reviewId})
    if(data){
      alert(data)
    }
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const delReview = async (reviewId) => {
  try{
    const {data} = await $host.delete(`api/tour/dropReview/${reviewId}`)
    if(data){
      alert(data)
    }
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const acceptHotelReview = async (reviewId) => {
  try{
    const {data} = await $host.patch('api/hotel/reviewAccept', {reviewId})
    if(data){
      alert(data)
    }
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const delHotelReview = async (reviewId) => {
  try{
    const {data} = await $host.delete(`api/hotel/reviewCancel/${reviewId}`)
    if(data){
      alert(data)
    }
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const acceptComboReview = async (reviewId) => {
  try{
    const {data} = await $host.patch('api/combtour/acceptReview', {reviewId})
    if(data){
      alert(data)
    }
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}

export const delComboReview = async (reviewId) => {
  try{
    const {data} = await $host.delete(`api/combtour/reviewCancel/${reviewId}`)
    if(data){
      alert(data)
    }
  }catch(e){
    alert(e.response?.data.message || 'Произошла ошибка')
  }
}