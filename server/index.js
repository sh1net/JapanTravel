const express = require("express")
require('dotenv').config()
const models = require("./models/models")
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require("./middleware/ErrorHandlingMiddleware")
const fileUpload = require('express-fileupload')
const path=require("path")

const app = express()
app.use(cors())//чтобы обращаться к серверу из клиента
app.use(express.json())//чтобы приложение могло парсить формат
app.use(express.static(path.resolve(__dirname, 'static',)))
app.use(fileUpload({}))
app.use('/api', router)//связан с маршрутизаторами описанными в routes



app.use(errorHandler)//обработка ошибок в самом конце

const PORT = process.env.PORT



const start = async () =>{
    try{
        await sequelize.authenticate()// Установка к бд
        await sequelize.sync()//Что-то связанное с запросами к бд
        app.listen(PORT,()=>console.log(`Server started on port ${PORT}`))
    }
    catch(e){
        console.log(e)
    }
}

start()