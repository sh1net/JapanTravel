import { $host, $authHost } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
    const { data } = await $host.post('api/user/registration', { email, password, role: 'ADMIN' });
    return jwtDecode(data.token);
}

export const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token',data.token)
    localStorage.setItem('role',data.role)
    return ({token:jwtDecode(data.token),role:data.role});
} 

export const check = async () => {
    const token = localStorage.getItem('token');
    const { data } = await $authHost.get('api/user/auth', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return jwtDecode(data.token);
}

export const checkPassword = async (oldPassword) => {
    try{
        const {data} = await $authHost.post('/api/user/checkPassword', {oldPassword})
        console.log(data)
        return data
    }catch(e){
        alert(e.message)
    }
}

export const updateUser = async (updatedUser) => {
    try {
        const { data } = await $authHost.patch('/api/user/update', updatedUser);
        console.log(data);
    } catch (e) {
        console.error("Ошибка при обновлении пользователя:", e.message);
    }
}

export const getUserReviews = async () => {
    try{
        const {data} = await $authHost.get('/api/user/userReviews')
        return data
    }catch(e){
        alert(e.response?.data.message || 'Произошла ошибка')
    }
}

export const getUserData = async () =>{
    try{
        const token = await check()
        if(!token){
            throw new Error('токен не найден')
        }
        const { data } = await $authHost.get('api/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    }
    catch(e){
        console.error('Ошибка в коде')
        return null
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role')
}
  
