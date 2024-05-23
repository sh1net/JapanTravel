import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHotelHistory, fetchTourHistory } from "../http/basketApi";

const initialState = {
  basketHotels: [],
  basketTours: [],
};

// Создание асинхронного действия для получения истории отелей
export const fetchHotelsHistoryAsync = createAsyncThunk("basket/fetchHotels", async () => {
  try {
    const response = await fetchHotelHistory();
    console.log('Redux Basket Hotels:', response);
    return response;
  } catch (error) {
    console.error("Error fetching hotel history", error);
    throw error;
  }
});

// Создание асинхронного действия для получения истории туров
export const fetchToursHistoryAsync = createAsyncThunk("basket/fetchTours", async () => {
  try {
    const response = await fetchTourHistory();
    console.log('Redux Basket Tours:', response);
    return response;
  } catch (error) {
    console.error("Error fetching tour history", error);
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
    builder.addCase(fetchToursHistoryAsync.fulfilled, (state, action) => {
      state.basketTours = action.payload; // Обновляем туры напрямую
    });
  },
});

export const selectBasketHotels = (state) => state.basket.basketHotels;
export const selectBasketTours = (state) => state.basket.basketTours;
export default basketSlice.reducer;
