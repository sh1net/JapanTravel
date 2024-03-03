import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tours: [
        {id:1,name:'Тур 1', description:'описание',price:'1000',rating:'5'},
        {id:2,name:'Тур 2', description:'описание',price:'2000',rating:'4'},
        {id:3,name:'Тур 3', description:'описание',price:'3000',rating:'3'},
        {id:4,name:'Тур 4', description:'описание',price:'4000',rating:'2'},
        {id:5,name:'Тур 5', description:'описание',price:'5000',rating:'1'},
        {id:6,name:'Тур 6', description:'описание',price:'6000',rating:'5'},
    ],
}

const tourSlice = createSlice({
    name: "tours",
    initialState,
    reducers: {
        addTour(state, action) {
            state.tours.push({
                id: new Date().toISOString(),
                name: action.payload.name,
                description: action.payload.description,
                price: action.payload.price,
                rating: action.payload.rating,
            });
        },
        removeTour(state, action) {
            // Фильтруем туры по id, чтобы удалить нужный тур
            state.tours = state.tours.filter(tour => tour.id !== action.payload);
        },
    },
});

export const {addTour, removeTour} = tourSlice.actions;
export default tourSlice.reducer;