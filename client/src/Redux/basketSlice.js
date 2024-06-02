import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchComboHistory, fetchHotelHistory, fetchTourHistory } from "../http/basketApi";

const initialState = {
  basketHotels: [],
  basketTours: [],
  basketCombo: []
};

// Создание асинхронного действия для получения истории отелей
export const fetchHotelsHistoryAsync = createAsyncThunk("basket/fetchHotels", async () => {
  try {
    const response = await fetchHotelHistory();
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
    return response;
  } catch (error) {
    console.error("Error fetching tour history", error);
    throw error;
  }
});

export const fetchComboHistoryAsync = createAsyncThunk("basket/fetchCombo", async () => {
  try {
    const response = await fetchComboHistory();
    console.log('Redux Basket Combo:', response);
    return response;
  } catch (error) {
    console.error("Error fetching combo history", error);
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
    builder.addCase(fetchComboHistoryAsync.fulfilled, (state,action) => {
      state.basketCombo = action.payload
    })
  },
});

export const selectBasketHotels = (state) => state.basket.basketHotels;
export const selectBasketTours = (state) => state.basket.basketTours;
export const selectBasketCombo = (state) => state.basket.basketCombo
export default basketSlice.reducer;
