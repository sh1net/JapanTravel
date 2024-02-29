// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Импортируйте созданный редюсер
import tourReducer from './tourSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Добавьте созданный редюсер
    tour: tourReducer,
  },
});

export default store;
