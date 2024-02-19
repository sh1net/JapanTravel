import {makeAutoObservable} from "mobx"
export default class TourStore{
    constructor(){
        this._tours = [
            {id:1, name:"тур по инокогаве", price:20000,rating:4.5,photo:"",hotel:"престиж"},
            {id:2, name:"тур по инокогаве", price:20000,rating:4.5,photo:"",hotel:"престиж"},
            {id:3, name:"тур по инокогаве", price:20000,rating:4.5,photo:"",hotel:"престиж"},
            {id:4, name:"тур по инокогаве", price:20000,rating:4.5,photo:"",hotel:"престиж"},
            {id:5, name:"тур по инокогаве", price:20000,rating:4.5,photo:"",hotel:"престиж"},
        ]
        makeAutoObservable(this)
    }


    setTour(tours){
        this._tours = tours
    }

    getTours(){
        return this._tours
    }
}
