const ApiError = require("../error/ApiError")


module.exports = function (err,req,res,next) {
    if(err instanceof ApiError){//если статус ошибки ApiError
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message:" Непредвиденная ошибка"})//если нет ошибки в ApiError
}