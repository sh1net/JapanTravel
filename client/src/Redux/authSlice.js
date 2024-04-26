// store/slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  user: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setIsAuth, setUser } = authSlice.actions;
export const selectIsAuth = (state) => state.auth.isAuth;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
