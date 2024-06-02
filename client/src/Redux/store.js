import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tourReducer from './tourSlice';
import hotelReducer from './hotelSlice'
import basketReducer from './basketSlice'
import combTourReducer from './combSlice'
import reviewReducer from './reviewSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    tour: tourReducer,
    hotel: hotelReducer,
    basket: basketReducer,
    combTour: combTourReducer,
    review:reviewReducer
  },
});

export default store;
