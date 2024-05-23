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
        console.log('С Сервера',data)
        return data
    }catch(e){
        console.log(e.response?.data.message || 'Произошла ошибка')
    }
}