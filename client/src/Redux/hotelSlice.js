import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hotels: [],
}

const hotelSlice = createSlice({
    name: "hotels",
    initialState,
    reducers: {
        addHotel(state, action) {
            state.hotels.push({
                id: new Date().toISOString(),
                name: action.payload.name,
                description: action.payload.description,
            });
        },
        removeHotel(state, action) {
            // Фильтруем туры по id, чтобы удалить нужный тур
            state.hotels = state.hotels.filter(hotel => hotel.id !== action.payload);
        },
    },
});

export const {addHotel, removeHotel} = hotelSlice.actions;
export default hotelSlice.reducer;