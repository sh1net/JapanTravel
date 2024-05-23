import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTours } from "../http/tourApi";
import { fetchOneTour } from "../http/tourApi";
import { createTours } from "../http/adminApi";

const initialState = {
  tours: [],
  status: "idle",
  error: null,
};

export const fetchToursAsync = createAsyncThunk("tour/fetchTours", async () => {
  try{
    const response = await fetchTours();
    return response.rows;
  }
  catch(error){
    console.error("Error fetching tours", error);
    throw error;
  }
})

export const fetchOneTourAsync = createAsyncThunk("tour/fetchtour/id", async (id) => {
  try{
    const response = await fetchOneTour(id)
    return response;
  }
  catch(error){
    console.error("Error fetching One tour", error)
    throw error
  }
})

export const createToursAsync = createAsyncThunk("tour/createTours", async (name, info, city, price, img, coordinates) => {
  try{
    const response = await createTours(name, info, city, price, img, coordinates);
    return response;
  }
  catch(error){
    console.error("Error creating tours", error);
    throw error;
  }
})

const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    addTour(state, action) {
      state.tours.push({
        id: new Date().toISOString(),
        name: action.payload.name,
        description: action.payload.description,
        price: action.payload.price,
        rating: action.payload.rating,
        img: action.payload.img
      });
    }
  },
  extraReducers : (builder) => {
    builder
    .addCase(fetchToursAsync.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchToursAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.tours = action.payload;
    })
    .addCase(fetchToursAsync.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.payload;
    })
  }
});

export const selectTours = (state) => state.tour.tours;
export const { addTour } = tourSlice.actions;
export default tourSlice.reducer;
