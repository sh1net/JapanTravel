import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAdminReviews } from "../http/adminApi";

const initialState = {
  reviews: [],
  status: "idle",
  error: null,
};

export const fetchReviewsAsync = createAsyncThunk("reviews/fetchTourReviews", async () => {
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
    builder.addCase(fetchReviewsAsync.fulfilled, (state, action) => {
      state.reviews = action.payload; // Обновляем отели напрямую
    });
  }
});

export const selectReviews = (state) => state.review.reviews;
export const { addReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
