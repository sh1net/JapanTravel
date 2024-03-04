import { $host, $authHost } from "./index";

export const fetchHotel = async () => {
    const {data} = await $host.get('api/hotel')
    return data
}

export const createHotel = async (hotel) =>{
    const {data} = await $authHost.post('api/hotel')
    return data
}

export const fetchOneHotel = async (id) =>{
    const {data} = await $host.get('api/hotel/' + id)
    return data
}