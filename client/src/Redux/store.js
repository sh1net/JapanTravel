// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tourReducer from './tourSlice';
import hotelReducer from './hotelSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    tour: tourReducer,
    hotel: hotelReducer,
  },
});

export default store;
