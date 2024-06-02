import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAdminReviews } from "../http/adminApi";

const initialState = {
  tourReviews: [],
  status: "idle",
  error: null,
};

export const fetchTourReviewsAsync = createAsyncThunk("reviews/fetchTourReviews", async () => {
    try{
      const response = await fetchAdminReviews();
      return response;
    }
    catch(error){
      console.error("Error fetching tours", error);
      throw error;
    }
  })

const reviewsSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers : (builder) => {
    builder.addCase(fetchTourReviewsAsync.fulfilled, (state, action) => {
      state.tourReviews = action.payload; // Обновляем отели напрямую
    });
  }
});

export const selectTourReviews = (state) => state.review.tourReviews;
export const { addReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
