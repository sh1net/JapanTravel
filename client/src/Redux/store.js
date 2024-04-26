import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tourReducer from './tourSlice';
import hotelReducer from './hotelSlice'
import basketReducer from './basketSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    tour: tourReducer,
    hotel: hotelReducer,
    basket: basketReducer,
  },
});

export default store;
