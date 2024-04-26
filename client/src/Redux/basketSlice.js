import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHotelHistory } from "../http/basketApi";

const initialState = {
  basketHotels: [],
};

export const fetchHotelsHistoryAsync = createAsyncThunk("basket/fetchHotels", async () => {
  try {
    const response = await fetchHotelHistory();
    console.log('Redux Basket : ', response);
    return response;
  } catch (error) {
    console.error("Error fetching hotel history", error);
    throw error;
  }
});

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHotelsHistoryAsync.fulfilled, (state, action) => {
      state.basketHotels = action.payload; // Обновляем отели напрямую
    });
  },
});

export const selectBasketHotels = (state) => state.basket.basketHotels;
export default basketSlice.reducer;
