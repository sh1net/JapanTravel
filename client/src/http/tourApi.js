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

export const createTours = async (name, rating, price, img) => {
  try {
    const { data } = await $authHost.post('api/tour', {
      name,
      rating,
      price,
      img,
    });
    console.log('Созданный тур : ', data);
    return data;
  } 
  catch (error) {
    console.error("Error creating tours:", error);
    throw error;
  }
};
