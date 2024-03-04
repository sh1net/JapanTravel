import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTours } from "../http/tourApi";

const initialState = {
  tours: [],
  status: "idle",
  error: null,
};

export const fetchToursAsync = createAsyncThunk("tour/fetchTours", async () => {
  try{
    const response = await fetchTours();
    return response.data;
  }
  catch(error){
    console.error("Error fetching tours", error);
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

export const { addTour } = tourSlice.actions;
export default tourSlice.reducer;
