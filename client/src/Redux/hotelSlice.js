import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHotel, fetchOneHotel } from "../http/hotelApi";

const initialState = {
    hotels: [],
    filters:{
      city:[],
      price:[],
      
    }
}

export const fetchHotelsAsync = createAsyncThunk("hotel/fetchHotels", async () => {
  try{
    const response = await fetchHotel();
    console.log('Redux Hotels : ', response.rows)
    return response.rows;
  }
  catch(error){
    console.error("Error fetching tours", error);
    throw error;
  }
})

export const fetchOneHotelAsync = createAsyncThunk("hotel/fetchhotel/id", async (id) => {
  try{
    const response = await fetchOneHotel(id)
    return response;
  }
  catch(error){
    console.error("Error fetching One tour", error)
    throw error
  }
})

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
      addHotel(state, action) {
          return {
              ...state,
              hotels: [...state.hotels, {
                  id: new Date().toISOString(),
                  name: action.payload.name,
                  description: action.payload.description,
                  city: action.payload.city,
                  rating: action.payload.rating,
                  nutrition: action.payload.nutrition,
                  img: action.payload.img
              }]
          };
      },
  },
  extraReducers: (builder) => {
      builder
          .addCase(fetchHotelsAsync.fulfilled, (state, action) => {
              state.hotels = action.payload; // Обновляем отели напрямую
          });
  }
});


export const selectHotels = (state) => state.hotel.hotels;
export const {addHotel} = hotelSlice.actions;
export default hotelSlice.reducer;