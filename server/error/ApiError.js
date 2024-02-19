class ApiError extends Error{
    constructor(status,message){
        super();//вызываем родительский конструктор
        this.status = status//присваеваем то что получаем параметрами
        this.message=message//присваеваем то что получаем параметрами
    }
    static badRequest(message){
        return new ApiError(404,message)//Ошибка запроса
    }
    static internal(message){
        return new ApiError(500,message)//
    }
    static forbidden(message){
        return new ApiError(403,message)//нет доступа
    }
}

module.exports = ApiError