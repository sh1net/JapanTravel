import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tours: [],
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