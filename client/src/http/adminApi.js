import { $authHost, $host } from ".";


export const createTours = async (tour) => {
  try {
    console.log(tour.get('img'))
    const { data } = await $host.post('api/tour', tour);
    console.log('Созданный тур : ', data);
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